import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  proposal: mongoose.Types.ObjectId;
  voter: mongoose.Types.ObjectId;
  vote: 'for' | 'against' | 'abstain';
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
      enum: ['for', 'against', 'abstain'],
      required: [true, 'Vote type is required']
    }
  },
  {
    timestamps: true
  }
);

// Add compound index to ensure one vote per user per proposal
voteSchema.index({ proposal: 1, voter: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', voteSchema); 