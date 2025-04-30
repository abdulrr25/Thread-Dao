import mongoose, { Document, Schema } from 'mongoose';

export interface IProposal extends Document {
  title: string;
  description: string;
  dao: mongoose.Types.ObjectId;
  proposer: mongoose.Types.ObjectId;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<IProposal>(
  {
    title: {
      type: String,
      required: [true, 'Proposal title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Proposal description is required']
    },
    dao: {
      type: Schema.Types.ObjectId,
      ref: 'DAO',
      required: [true, 'DAO reference is required']
    },
    proposer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Proposer is required']
    },
    status: {
      type: String,
      enum: ['active', 'passed', 'rejected', 'executed'],
      default: 'active'
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required']
    }
  },
  {
    timestamps: true
  }
);

// Add index for efficient querying
proposalSchema.index({ dao: 1, status: 1 });
proposalSchema.index({ endTime: 1 }, { expireAfterSeconds: 0 });

export const Proposal = mongoose.model<IProposal>('Proposal', proposalSchema); 