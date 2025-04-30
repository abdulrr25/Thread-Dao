import mongoose, { Document, Schema } from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password';

export interface IUser extends Document {
  name: string;
  handle: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  walletAddress?: string;
  daos: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    handle: {
      type: String,
      required: [true, 'Handle is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    avatar: {
      type: String
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true
    },
    daos: [{
      type: Schema.Types.ObjectId,
      ref: 'DAO'
    }]
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return comparePassword(candidatePassword, this.password);
};

// Add indexes for efficient querying
userSchema.index({ email: 1 });
userSchema.index({ handle: 1 });
userSchema.index({ walletAddress: 1 });

export const User = mongoose.model<IUser>('User', userSchema); 