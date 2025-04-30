import mongoose, { Document, Schema } from 'mongoose';

export interface IProposal extends Document {
  title: string;
  description: string;
  dao: mongoose.Types.ObjectId;
  proposer: mongoose.Types.ObjectId;
  type: 'general' | 'token' | 'member';
  status: 'active' | 'passed' | 'failed' | 'executed';
  startTime: Date;
  endTime: Date;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<IProposal>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
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
    type: {
      type: String,
      required: [true, 'Proposal type is required'],
      enum: ['general', 'token', 'member']
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'passed', 'failed', 'executed'],
      default: 'active'
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required']
    },
    votes: {
      for: {
        type: Number,
        default: 0
      },
      against: {
        type: Number,
        default: 0
      },
      abstain: {
        type: Number,
        default: 0
      }
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
proposalSchema.index({ dao: 1, createdAt: -1 });
proposalSchema.index({ proposer: 1, createdAt: -1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ type: 1 });
proposalSchema.index({ endTime: 1 });

// Add method to check if proposal is active
proposalSchema.methods.isActive = function(): boolean {
  const now = new Date();
  return this.status === 'active' && now >= this.startTime && now <= this.endTime;
};

// Add method to calculate total votes
proposalSchema.methods.getTotalVotes = function(): number {
  return this.votes.for + this.votes.against + this.votes.abstain;
};

export const Proposal = mongoose.model<IProposal>('Proposal', proposalSchema); 