export interface CommentAuthor {
  id: string;
  phone: string;
  name?: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author: CommentAuthor;
  parentId?: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    replies: number;
    likes: number;
  };
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}
