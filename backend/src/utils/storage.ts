import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ApiError } from './error';
import { Logger } from './logger';
import { ConfigManager } from './config';

interface StorageConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

interface UploadOptions {
  contentType?: string;
  acl?: string;
  metadata?: Record<string, string>;
}

interface SignedUrlOptions {
  expiresIn?: number;
  contentType?: string;
}

export class StorageManager {
  private static instance: StorageManager;
  private s3Client: S3Client;
  private logger: Logger;
  private config: ConfigManager;

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    const storageConfig = this.config.getStorageConfig();
    this.s3Client = new S3Client({
      region: storageConfig.region,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey,
      },
    });
  }

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  public async uploadFile(
    key: string,
    body: Buffer | string,
    options: UploadOptions = {}
  ): Promise<string> {
    try {
      const { contentType, acl, metadata } = options;
      const storageConfig = this.config.getStorageConfig();

      const command = new PutObjectCommand({
        Bucket: storageConfig.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: acl,
        Metadata: metadata,
      });

      await this.s3Client.send(command);
      return key;
    } catch (error) {
      this.logger.error('Upload file error:', error);
      throw new ApiError(500, 'Failed to upload file');
    }
  }

  public async getFile(key: string): Promise<Buffer> {
    try {
      const storageConfig = this.config.getStorageConfig();

      const command = new GetObjectCommand({
        Bucket: storageConfig.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const chunks: Uint8Array[] = [];
      const stream = response.Body as any;

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error('Get file error:', error);
      throw new ApiError(500, 'Failed to get file');
    }
  }

  public async deleteFile(key: string): Promise<void> {
    try {
      const storageConfig = this.config.getStorageConfig();

      const command = new DeleteObjectCommand({
        Bucket: storageConfig.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error('Delete file error:', error);
      throw new ApiError(500, 'Failed to delete file');
    }
  }

  public async getSignedUrl(
    key: string,
    options: SignedUrlOptions = {}
  ): Promise<string> {
    try {
      const { expiresIn = 3600, contentType } = options;
      const storageConfig = this.config.getStorageConfig();

      const command = new GetObjectCommand({
        Bucket: storageConfig.bucket,
        Key: key,
        ResponseContentType: contentType,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error('Get signed URL error:', error);
      throw new ApiError(500, 'Failed to get signed URL');
    }
  }

  public async getUploadSignedUrl(
    key: string,
    options: SignedUrlOptions = {}
  ): Promise<string> {
    try {
      const { expiresIn = 3600, contentType } = options;
      const storageConfig = this.config.getStorageConfig();

      const command = new PutObjectCommand({
        Bucket: storageConfig.bucket,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error('Get upload signed URL error:', error);
      throw new ApiError(500, 'Failed to get upload signed URL');
    }
  }

  public async getFileUrl(key: string): Promise<string> {
    try {
      const storageConfig = this.config.getStorageConfig();
      return `https://${storageConfig.bucket}.s3.${storageConfig.region}.amazonaws.com/${key}`;
    } catch (error) {
      this.logger.error('Get file URL error:', error);
      throw new ApiError(500, 'Failed to get file URL');
    }
  }

  public async listFiles(prefix: string): Promise<string[]> {
    try {
      const storageConfig = this.config.getStorageConfig();
      const command = new ListObjectsV2Command({
        Bucket: storageConfig.bucket,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(command);
      return (response.Contents || []).map((item) => item.Key || '');
    } catch (error) {
      this.logger.error('List files error:', error);
      throw new ApiError(500, 'Failed to list files');
    }
  }

  public async copyFile(
    sourceKey: string,
    destinationKey: string
  ): Promise<void> {
    try {
      const storageConfig = this.config.getStorageConfig();
      const command = new CopyObjectCommand({
        Bucket: storageConfig.bucket,
        CopySource: `${storageConfig.bucket}/${sourceKey}`,
        Key: destinationKey,
      });

      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error('Copy file error:', error);
      throw new ApiError(500, 'Failed to copy file');
    }
  }

  public async moveFile(
    sourceKey: string,
    destinationKey: string
  ): Promise<void> {
    try {
      await this.copyFile(sourceKey, destinationKey);
      await this.deleteFile(sourceKey);
    } catch (error) {
      this.logger.error('Move file error:', error);
      throw new ApiError(500, 'Failed to move file');
    }
  }
} 