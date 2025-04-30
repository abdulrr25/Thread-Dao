import Bull from 'bull';
import { Logger } from './logger';
import { ApiError } from './error';
import { ConfigManager } from './config';

interface QueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  prefix?: string;
  limiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: Bull.JobOptions;
}

interface QueueOptions {
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
  timeout?: number;
}

export class Queue {
  private static instance: Queue;
  private queues: Map<string, Bull.Queue>;
  private logger: Logger;
  private config: QueueConfig;
  private defaultOptions: QueueOptions = {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
    timeout: 30000,
  };

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance().get('queue') as QueueConfig;
    this.queues = new Map();
  }

  public static getInstance(): Queue {
    if (!Queue.instance) {
      Queue.instance = new Queue();
    }
    return Queue.instance;
  }

  public createQueue(name: string, processor: Bull.ProcessCallbackFunction<any>): Bull.Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
    }

    const queue = new Bull(name, {
      redis: this.config.redis,
      prefix: this.config.prefix,
      limiter: this.config.limiter,
      defaultJobOptions: {
        ...this.defaultOptions,
        ...this.config.defaultJobOptions,
      },
    });

    queue.process(processor);

    queue.on('error', (error) => {
      this.logger.error(`Queue ${name} error:`, error);
    });

    queue.on('failed', (job, error) => {
      this.logger.error(`Job ${job.id} in queue ${name} failed:`, error);
    });

    queue.on('completed', (job) => {
      this.logger.info(`Job ${job.id} in queue ${name} completed`);
    });

    queue.on('stalled', (job) => {
      this.logger.warn(`Job ${job.id} in queue ${name} stalled`);
    });

    this.queues.set(name, queue);
    return queue;
  }

  public async add<T>(
    queueName: string,
    data: T,
    options: QueueOptions = {}
  ): Promise<Bull.Job<T>> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      return await queue.add(data, mergedOptions);
    } catch (error) {
      this.logger.error(`Error adding job to queue ${queueName}:`, error);
      throw new ApiError(500, 'Failed to add job to queue');
    }
  }

  public async getJob<T>(queueName: string, jobId: string): Promise<Bull.Job<T> | null> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      return await queue.getJob(jobId);
    } catch (error) {
      this.logger.error(`Error getting job ${jobId} from queue ${queueName}:`, error);
      return null;
    }
  }

  public async getJobs(
    queueName: string,
    status: Bull.JobStatus,
    start = 0,
    end = 100
  ): Promise<Bull.Job[]> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      return await queue.getJobs([status], start, end);
    } catch (error) {
      this.logger.error(`Error getting jobs from queue ${queueName}:`, error);
      return [];
    }
  }

  public async getJobCounts(queueName: string): Promise<Bull.JobCounts> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      return await queue.getJobCounts();
    } catch (error) {
      this.logger.error(`Error getting job counts for queue ${queueName}:`, error);
      throw new ApiError(500, 'Failed to get job counts');
    }
  }

  public async removeJob(queueName: string, jobId: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      const job = await queue.getJob(jobId);
      if (job) {
        await job.remove();
      }
    } catch (error) {
      this.logger.error(`Error removing job ${jobId} from queue ${queueName}:`, error);
      throw new ApiError(500, 'Failed to remove job');
    }
  }

  public async cleanQueue(
    queueName: string,
    status: Bull.JobStatus,
    age: number
  ): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      await queue.clean(age, status);
    } catch (error) {
      this.logger.error(`Error cleaning queue ${queueName}:`, error);
      throw new ApiError(500, 'Failed to clean queue');
    }
  }

  public async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      await queue.pause();
    } catch (error) {
      this.logger.error(`Error pausing queue ${queueName}:`, error);
      throw new ApiError(500, 'Failed to pause queue');
    }
  }

  public async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      await queue.resume();
    } catch (error) {
      this.logger.error(`Error resuming queue ${queueName}:`, error);
      throw new ApiError(500, 'Failed to resume queue');
    }
  }

  public async closeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new ApiError(500, `Queue ${queueName} not found`);
    }

    try {
      await queue.close();
      this.queues.delete(queueName);
    } catch (error) {
      this.logger.error(`Error closing queue ${queueName}:`, error);
      throw new ApiError(500, 'Failed to close queue');
    }
  }

  public async closeAllQueues(): Promise<void> {
    try {
      await Promise.all(
        Array.from(this.queues.values()).map((queue) => queue.close())
      );
      this.queues.clear();
    } catch (error) {
      this.logger.error('Error closing all queues:', error);
      throw new ApiError(500, 'Failed to close all queues');
    }
  }
} 