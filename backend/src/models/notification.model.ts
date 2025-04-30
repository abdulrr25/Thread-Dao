import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'dao' | 'proposal' | 'vote' | 'comment' | 'mention';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender reference is required']
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: ['dao', 'proposal', 'vote', 'comment', 'mention']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    read: {
      type: Boolean,
      default: false
    },
    link: {
      type: String
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for efficient querying
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ sender: 1 });
notificationSchema.index({ type: 1 });

// Add method to mark as read
notificationSchema.methods.markAsRead = async function(): Promise<void> {
  this.read = true;
  await this.save();
};

export const Notification = mongoose.model<INotification>('Notification', notificationSchema); 