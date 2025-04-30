import { Logger } from './logger';
import { ApiError } from './error';
import { ConfigManager } from './config';
import { Cache } from './cache';
import { PrismaClient } from '@prisma/client';
import { Queue } from './queue';

interface SearchConfig {
  defaultLimit: number;
  maxLimit: number;
  cacheTTL: number;
  indexBatchSize: number;
  minSearchLength: number;
  maxSearchLength: number;
  searchFields: {
    dao: string[];
    post: string[];
    user: string[];
    proposal: string[];
  };
}

interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  include?: string[];
}

interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export class SearchManager {
  private static instance: SearchManager;
  private logger: Logger;
  private config: SearchConfig;
  private prisma: PrismaClient;
  private cache: Cache;
  private queue: Queue;

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance().get('search') as SearchConfig;
    this.prisma = new PrismaClient();
    this.cache = Cache.getInstance();
    this.queue = Queue.getInstance();
  }

  public static getInstance(): SearchManager {
    if (!SearchManager.instance) {
      SearchManager.instance = new SearchManager();
    }
    return SearchManager.instance;
  }

  public async search<T>(
    query: string,
    type: 'dao' | 'post' | 'user' | 'proposal',
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> {
    try {
      // Validate query length
      if (query.length < this.config.minSearchLength) {
        throw new ApiError(400, `Search query must be at least ${this.config.minSearchLength} characters`);
      }
      if (query.length > this.config.maxSearchLength) {
        throw new ApiError(400, `Search query must not exceed ${this.config.maxSearchLength} characters`);
      }

      // Generate cache key
      const cacheKey = `search:${type}:${query}:${JSON.stringify(options)}`;

      // Try to get from cache
      const cachedResult = await this.cache.get<SearchResult<T>>(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Prepare search parameters
      const limit = Math.min(
        options.limit || this.config.defaultLimit,
        this.config.maxLimit
      );
      const offset = options.offset || 0;
      const sortBy = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder || 'desc';

      // Build search query
      const searchFields = this.config.searchFields[type];
      const searchQuery = searchFields
        .map((field) => `${field}:${query}`)
        .join(' OR ');

      // Execute search
      const [items, total] = await Promise.all([
        this.prisma[type].findMany({
          where: {
            OR: searchFields.map((field) => ({
              [field]: {
                contains: query,
                mode: 'insensitive',
              },
            })),
            ...options.filters,
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip: offset,
          take: limit,
          include: options.include?.reduce(
            (acc, field) => ({ ...acc, [field]: true }),
            {}
          ),
        }),
        this.prisma[type].count({
          where: {
            OR: searchFields.map((field) => ({
              [field]: {
                contains: query,
                mode: 'insensitive',
              },
            })),
            ...options.filters,
          },
        }),
      ]);

      const result: SearchResult<T> = {
        items: items as T[],
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: offset + items.length < total,
      };

      // Cache the result
      await this.cache.set(cacheKey, result, { ttl: this.config.cacheTTL });

      return result;
    } catch (error) {
      this.logger.error('Error performing search:', error);
      throw new ApiError(500, 'Failed to perform search');
    }
  }

  public async indexItem<T>(
    type: 'dao' | 'post' | 'user' | 'proposal',
    item: T
  ): Promise<void> {
    try {
      await this.queue.add('search-index', {
        type,
        item,
        action: 'index',
      });
    } catch (error) {
      this.logger.error('Error indexing item:', error);
      throw new ApiError(500, 'Failed to index item');
    }
  }

  public async removeFromIndex(
    type: 'dao' | 'post' | 'user' | 'proposal',
    id: string
  ): Promise<void> {
    try {
      await this.queue.add('search-index', {
        type,
        id,
        action: 'remove',
      });
    } catch (error) {
      this.logger.error('Error removing item from index:', error);
      throw new ApiError(500, 'Failed to remove item from index');
    }
  }

  public async reindexAll(
    type: 'dao' | 'post' | 'user' | 'proposal'
  ): Promise<void> {
    try {
      const total = await this.prisma[type].count();
      const batches = Math.ceil(total / this.config.indexBatchSize);

      for (let i = 0; i < batches; i++) {
        const items = await this.prisma[type].findMany({
          skip: i * this.config.indexBatchSize,
          take: this.config.indexBatchSize,
        });

        await Promise.all(
          items.map((item) =>
            this.queue.add('search-index', {
              type,
              item,
              action: 'index',
            })
          )
        );
      }
    } catch (error) {
      this.logger.error('Error reindexing all items:', error);
      throw new ApiError(500, 'Failed to reindex all items');
    }
  }

  public async getSuggestions(
    query: string,
    type: 'dao' | 'post' | 'user' | 'proposal',
    limit = 5
  ): Promise<string[]> {
    try {
      // Generate cache key
      const cacheKey = `suggestions:${type}:${query}`;

      // Try to get from cache
      const cachedSuggestions = await this.cache.get<string[]>(cacheKey);
      if (cachedSuggestions) {
        return cachedSuggestions;
      }

      // Get suggestions from database
      const searchFields = this.config.searchFields[type];
      const items = await this.prisma[type].findMany({
        where: {
          OR: searchFields.map((field) => ({
            [field]: {
              contains: query,
              mode: 'insensitive',
            },
          })),
        },
        select: searchFields.reduce(
          (acc, field) => ({ ...acc, [field]: true }),
          {}
        ),
        take: limit,
      });

      // Extract suggestions
      const suggestions = items
        .flatMap((item) =>
          searchFields.map((field) => item[field as keyof typeof item])
        )
        .filter((value): value is string => typeof value === 'string')
        .filter((value) => value.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit);

      // Cache the suggestions
      await this.cache.set(cacheKey, suggestions, { ttl: this.config.cacheTTL });

      return suggestions;
    } catch (error) {
      this.logger.error('Error getting suggestions:', error);
      throw new ApiError(500, 'Failed to get suggestions');
    }
  }

  public async clearCache(): Promise<void> {
    try {
      const keys = await this.cache.keys('search:*');
      if (keys.length) {
        await this.cache.del(...keys);
      }
    } catch (error) {
      this.logger.error('Error clearing search cache:', error);
      throw new ApiError(500, 'Failed to clear search cache');
    }
  }
} 