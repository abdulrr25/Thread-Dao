import mongoose, { Document, Schema } from 'mongoose';

export interface IDAO extends Document {
  name: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  tokenSymbol: string;
  initialSupply: number;
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
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'DAO description is required']
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'DAO creator is required']
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
    initialSupply: {
      type: Number,
      required: [true, 'Initial supply is required'],
      min: [0, 'Initial supply cannot be negative']
    },
    votingPeriod: {
      type: Number,
      required: [true, 'Voting period is required'],
      min: [1, 'Voting period must be at least 1 day']
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

export const DAO = mongoose.model<IDAO>('DAO', daoSchema); 