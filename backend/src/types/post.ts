export interface Post {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: number;
  isDeleted: boolean;
} 