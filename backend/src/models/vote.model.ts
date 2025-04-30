import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  proposal: mongoose.Types.ObjectId;
  voter: mongoose.Types.ObjectId;
  vote: 'for' | 'against' | 'abstain';
  reason?: string;
  power: number;
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    proposal: {
      type: Schema.Types.ObjectId,
      ref: 'Proposal',
      required: [true, 'Proposal reference is required']
    },
    voter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Voter is required']
    },
    vote: {
      type: String,
      required: [true, 'Vote type is required'],
      enum: ['for', 'against', 'abstain']
    },
    reason: {
      type: String,
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    power: {
      type: Number,
      required: [true, 'Voting power is required'],
      min: [0, 'Voting power cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for efficient querying
voteSchema.index({ proposal: 1, voter: 1 }, { unique: true });
voteSchema.index({ voter: 1, createdAt: -1 });
voteSchema.index({ proposal: 1, vote: 1 });

// Add compound index for vote counting
voteSchema.index({ proposal: 1, vote: 1, power: 1 });

export const Vote = mongoose.model<IVote>('Vote', voteSchema); 