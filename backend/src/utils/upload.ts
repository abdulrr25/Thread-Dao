import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ApiError } from './error';
import { v4 as uuidv4 } from 'uuid';

export class UploadManager {
  private static instance: UploadManager;
  private s3Client: S3Client;
  private bucket: string;

  private constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

  public static getInstance(): UploadManager {
    if (!UploadManager.instance) {
      UploadManager.instance = new UploadManager();
    }
    return UploadManager.instance;
  }

  public async getSignedUploadUrl(
    fileType: string,
    folder: string = 'uploads'
  ): Promise<{ url: string; key: string }> {
    try {
      const fileExtension = fileType.split('/')[1];
      const key = `${folder}/${uuidv4()}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: fileType,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return { url, key };
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new ApiError(500, 'Failed to generate upload URL');
    }
  }

  public async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new ApiError(500, 'Failed to delete file');
    }
  }

  public getFileUrl(key: string): string {
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  public validateFileType(fileType: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ];
    return allowedTypes.includes(fileType);
  }

  public validateFileSize(size: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return size <= maxSize;
  }

  public async uploadAvatar(
    file: Express.Multer.File,
    userId: string
  ): Promise<string> {
    try {
      if (!this.validateFileType(file.mimetype)) {
        throw new ApiError(400, 'Invalid file type');
      }

      if (!this.validateFileSize(file.size)) {
        throw new ApiError(400, 'File size too large');
      }

      const key = `avatars/${userId}/${uuidv4()}.${file.mimetype.split('/')[1]}`;
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      return this.getFileUrl(key);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new ApiError(500, 'Failed to upload avatar');
    }
  }

  public async uploadDAOLogo(
    file: Express.Multer.File,
    daoId: string
  ): Promise<string> {
    try {
      if (!this.validateFileType(file.mimetype)) {
        throw new ApiError(400, 'Invalid file type');
      }

      if (!this.validateFileSize(file.size)) {
        throw new ApiError(400, 'File size too large');
      }

      const key = `daos/${daoId}/logo/${uuidv4()}.${file.mimetype.split('/')[1]}`;
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      return this.getFileUrl(key);
    } catch (error) {
      console.error('Error uploading DAO logo:', error);
      throw new ApiError(500, 'Failed to upload DAO logo');
    }
  }

  public async uploadPostMedia(
    file: Express.Multer.File,
    postId: string
  ): Promise<string> {
    try {
      if (!this.validateFileType(file.mimetype)) {
        throw new ApiError(400, 'Invalid file type');
      }

      if (!this.validateFileSize(file.size)) {
        throw new ApiError(400, 'File size too large');
      }

      const key = `posts/${postId}/${uuidv4()}.${file.mimetype.split('/')[1]}`;
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      return this.getFileUrl(key);
    } catch (error) {
      console.error('Error uploading post media:', error);
      throw new ApiError(500, 'Failed to upload post media');
    }
  }
} 