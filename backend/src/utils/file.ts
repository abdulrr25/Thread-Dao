import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { ApiError } from './error';
import { Logger } from './logger';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const access = promisify(fs.access);

interface FileOptions {
  encoding?: BufferEncoding;
  flag?: string;
  mode?: number;
}

export class FileManager {
  private static instance: FileManager;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
  }

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  public async readFile(
    filePath: string,
    options: FileOptions = {}
  ): Promise<string | Buffer> {
    try {
      const { encoding = 'utf8', flag = 'r' } = options;
      return await readFile(filePath, { encoding, flag });
    } catch (error) {
      this.logger.error('Read file error:', error);
      throw new ApiError(500, 'Failed to read file');
    }
  }

  public async writeFile(
    filePath: string,
    data: string | Buffer,
    options: FileOptions = {}
  ): Promise<void> {
    try {
      const { encoding = 'utf8', mode = 0o666, flag = 'w' } = options;
      await writeFile(filePath, data, { encoding, mode, flag });
    } catch (error) {
      this.logger.error('Write file error:', error);
      throw new ApiError(500, 'Failed to write file');
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      this.logger.error('Delete file error:', error);
      throw new ApiError(500, 'Failed to delete file');
    }
  }

  public async listFiles(dirPath: string): Promise<string[]> {
    try {
      return await readdir(dirPath);
    } catch (error) {
      this.logger.error('List files error:', error);
      throw new ApiError(500, 'Failed to list files');
    }
  }

  public async createDirectory(dirPath: string, recursive = true): Promise<void> {
    try {
      await mkdir(dirPath, { recursive });
    } catch (error) {
      this.logger.error('Create directory error:', error);
      throw new ApiError(500, 'Failed to create directory');
    }
  }

  public async getFileStats(filePath: string): Promise<fs.Stats> {
    try {
      return await stat(filePath);
    } catch (error) {
      this.logger.error('Get file stats error:', error);
      throw new ApiError(500, 'Failed to get file stats');
    }
  }

  public async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  public async isDirectory(filePath: string): Promise<boolean> {
    try {
      const stats = await this.getFileStats(filePath);
      return stats.isDirectory();
    } catch (error) {
      this.logger.error('Is directory error:', error);
      throw new ApiError(500, 'Failed to check if path is directory');
    }
  }

  public async isFile(filePath: string): Promise<boolean> {
    try {
      const stats = await this.getFileStats(filePath);
      return stats.isFile();
    } catch (error) {
      this.logger.error('Is file error:', error);
      throw new ApiError(500, 'Failed to check if path is file');
    }
  }

  public async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await this.getFileStats(filePath);
      return stats.size;
    } catch (error) {
      this.logger.error('Get file size error:', error);
      throw new ApiError(500, 'Failed to get file size');
    }
  }

  public async getFileExtension(filePath: string): Promise<string> {
    return path.extname(filePath).toLowerCase();
  }

  public async getFileName(filePath: string): Promise<string> {
    return path.basename(filePath);
  }

  public async getDirectoryName(filePath: string): Promise<string> {
    return path.dirname(filePath);
  }

  public async joinPaths(...paths: string[]): Promise<string> {
    return path.join(...paths);
  }

  public async resolvePath(filePath: string): Promise<string> {
    return path.resolve(filePath);
  }

  public async normalizePath(filePath: string): Promise<string> {
    return path.normalize(filePath);
  }

  public async isAbsolutePath(filePath: string): Promise<boolean> {
    return path.isAbsolute(filePath);
  }

  public async getRelativePath(from: string, to: string): Promise<string> {
 