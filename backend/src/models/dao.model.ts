import mongoose, { Document, Schema } from 'mongoose';

export interface IDAO extends Document {
  name: string;
  description: string;
  category: string;
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  tokenSymbol: string;
  tokenAddress?: string;
  isPublic: boolean;
  votingPeriod: number;
  quorum: number;
  createdAt: Date;
  updatedAt: Date;
}

const daoSchema = new Schema<IDAO>(
  {
    name: {
      type: String,
      required: [true, 'DAO name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['defi', 'nft', 'governance', 'social', 'other']
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required']
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    tokenSymbol: {
      type: String,
      required: [true, 'Token symbol is required'],
      uppercase: true
    },
    tokenAddress: {
      type: String
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    votingPeriod: {
      type: Number,
      required: [true, 'Voting period is required'],
      min: [1, 'Voting period must be at least 1 day'],
      max: [30, 'Voting period cannot exceed 30 days']
    },
    quorum: {
      type: Number,
      required: [true, 'Quorum is required'],
      min: [1, 'Quorum must be at least 1%'],
      max: [100, 'Quorum cannot exceed 100%']
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for efficient querying
daoSchema.index({ name: 1 });
daoSchema.index({ category: 1 });
daoSchema.index({ creator: 1 });
daoSchema.index({ members: 1 });
daoSchema.index({ tokenSymbol: 1 });
daoSchema.index({ isPublic: 1 });

export const DAO = mongoose.model<IDAO>('DAO', daoSchema); 