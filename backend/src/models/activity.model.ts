import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  type: 'proposal' | 'member' | 'token';
  dao: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ['proposal', 'member', 'token'],
      required: [true, 'Activity type is required']
    },
    dao: {
      type: Schema.Types.ObjectId,
      ref: 'DAO',
      required: [true, 'DAO reference is required']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    description: {
      type: String,
      required: [true, 'Activity description is required']
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
activitySchema.index({ dao: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema); 