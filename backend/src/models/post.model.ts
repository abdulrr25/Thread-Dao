import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  dao?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [500, 'Post content cannot exceed 500 characters']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    dao: {
      type: Schema.Types.ObjectId,
      ref: 'DAO'
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    shares: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for efficient querying
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ dao: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema); 