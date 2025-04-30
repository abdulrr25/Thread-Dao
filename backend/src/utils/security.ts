import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ApiError } from './error';
import { Logger } from './logger';

interface SecurityOptions {
  jwtSecret?: string;
  jwtExpiresIn?: string;
  saltRounds?: number;
}

export class Security {
  private static instance: Security;
  private logger: Logger;
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private saltRounds: number;

  private constructor(options: SecurityOptions = {}) {
    this.logger = Logger.getInstance();
    this.jwtSecret = options.jwtSecret || process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = options.jwtExpiresIn || '1d';
    this.saltRounds = options.saltRounds || 10;
  }

  public static getInstance(options?: SecurityOptions): Security {
    if (!Security.instance) {
      Security.instance = new Security(options);
    }
    return Security.instance;
  }

  public async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      this.logger.error('Hash password error:', error);
      throw new ApiError(500, 'Failed to hash password');
    }
  }

  public async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      this.logger.error('Compare passwords error:', error);
      throw new ApiError(500, 'Failed to compare passwords');
    }
  }

  public generateToken(payload: any): string {
    try {
      return jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (error) {
      this.logger.error('Generate token error:', error);
      throw new ApiError(500, 'Failed to generate token');
    }
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      this.logger.error('Verify token error:', error);
      throw new ApiError(401, 'Invalid token');
    }
  }

  public generateRandomString(length: number): string {
    try {
      return crypto.randomBytes(length).toString('hex');
    } catch (error) {
      this.logger.error('Generate random string error:', error);
      throw new ApiError(500, 'Failed to generate random string');
    }
  }

  public generateHash(data: string): string {
    try {
      return crypto.createHash('sha256').update(data).digest('hex');
    } catch (error) {
      this.logger.error('Generate hash error:', error);
      throw new ApiError(500, 'Failed to generate hash');
    }
  }

  public encryptData(data: string, key: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      this.logger.error('Encrypt data error:', error);
      throw new ApiError(500, 'Failed to encrypt data');
    }
  }

  public decryptData(encryptedData: string, key: string): string {
    try {
      const [ivHex, encrypted] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      this.logger.error('Decrypt data error:', error);
      throw new ApiError(500, 'Failed to decrypt data');
    }
  }

  public generateKey(): string {
    try {
      return crypto.randomBytes(32).toString('hex');
    } catch (error) {
      this.logger.error('Generate key error:', error);
      throw new ApiError(500, 'Failed to generate key');
    }
  }

  public generateNonce(): string {
    try {
      return crypto.randomBytes(16).toString('hex');
    } catch (error) {
      this.logger.error('Generate nonce error:', error);
      throw new ApiError(500, 'Failed to generate nonce');
    }
  }

  public generateSignature(data: string, key: string): string {
    try {
      return crypto
        .createHmac('sha256', key)
        .update(data)
        .digest('hex');
    } catch (error) {
      this.logger.error('Generate signature error:', error);
      throw new ApiError(500, 'Failed to generate signature');
    }
  }

  public verifySignature(
    data: string,
    signature: string,
    key: string
  ): boolean {
    try {
      const expectedSignature = this.generateSignature(data, key);
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      this.logger.error('Verify signature error:', error);
      throw new ApiError(500, 'Failed to verify signature');
    }
  }
} 