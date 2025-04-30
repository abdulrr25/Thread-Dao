import nodemailer from 'nodemailer';
import { ApiError } from './error';
import { Logger } from './logger';
import { ConfigManager } from './config';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export class EmailManager {
  private static instance: EmailManager;
  private transporter: nodemailer.Transporter;
  private logger: Logger;
  private config: ConfigManager;

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.transporter = this.createTransporter();
  }

  public static getInstance(): EmailManager {
    if (!EmailManager.instance) {
      EmailManager.instance = new EmailManager();
    }
    return EmailManager.instance;
  }

  private createTransporter(): nodemailer.Transporter {
    const emailConfig = this.config.getEmailConfig();
    return nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const emailConfig = this.config.getEmailConfig();
      const mailOptions = {
        from: emailConfig.from,
        ...options,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.info('Email sent:', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });
    } catch (error) {
      this.logger.error('Send email error:', error);
      throw new ApiError(500, 'Failed to send email');
    }
  }

  public async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const template = this.getWelcomeTemplate(name);
    await this.sendEmail({
      to,
      ...template,
    });
  }

  public async sendPasswordResetEmail(
    to: string,
    resetToken: string
  ): Promise<void> {
    const template = this.getPasswordResetTemplate(resetToken);
    await this.sendEmail({
      to,
      ...template,
    });
  }

  public async sendVerificationEmail(
    to: string,
    verificationToken: string
  ): Promise<void> {
    const template = this.getVerificationTemplate(verificationToken);
    await this.sendEmail({
      to,
      ...template,
    });
  }

  public async sendNotificationEmail(
    to: string,
    subject: string,
    message: string
  ): Promise<void> {
    const template = this.getNotificationTemplate(subject, message);
    await this.sendEmail({
      to,
      ...template,
    });
  }

  private getWelcomeTemplate(name: string): EmailTemplate {
    return {
      subject: 'Welcome to ThreadDAO',
      text: `Welcome ${name} to ThreadDAO! We're excited to have you on board.`,
      html: `
        <h1>Welcome to ThreadDAO!</h1>
        <p>Hi ${name},</p>
        <p>We're excited to have you join our community. Get started by:</p>
        <ul>
          <li>Creating your first DAO</li>
          <li>Joining existing DAOs</li>
          <li>Participating in discussions</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      `,
    };
  }

  private getPasswordResetTemplate(resetToken: string): EmailTemplate {
    const resetUrl = `${this.config.getServerConfig().baseUrl}/reset-password?token=${resetToken}`;
    return {
      subject: 'Reset Your Password',
      text: `Click the following link to reset your password: ${resetUrl}`,
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        ">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };
  }

  private getVerificationTemplate(verificationToken: string): EmailTemplate {
    const verificationUrl = `${this.config.getServerConfig().baseUrl}/verify-email?token=${verificationToken}`;
    return {
      subject: 'Verify Your Email',
      text: `Click the following link to verify your email: ${verificationUrl}`,
      html: `
        <h1>Verify Your Email</h1>
        <p>Click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #28a745;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        ">Verify Email</a>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    };
  }

  private getNotificationTemplate(
    subject: string,
    message: string
  ): EmailTemplate {
    return {
      subject,
      text: message,
      html: `
        <h1>${subject}</h1>
        <p>${message}</p>
      `,
    };
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      this.logger.error('Email connection verification error:', error);
      return false;
    }
  }
} 