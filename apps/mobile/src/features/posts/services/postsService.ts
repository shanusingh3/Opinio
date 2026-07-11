import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
} from '../api/postsApi';

export interface IPostsService {
  getFeed(skip?: number, take?: number): Promise<Post[]>;
  getPostById(id: string): Promise<Post>;
  getPostsByUser(userId: string, skip?: number, take?: number): Promise<Post[]>;
  createPost(data: CreatePostRequest): Promise<Post>;
  updatePost(id: string, data: UpdatePostRequest): Promise<Post>;
  deletePost(id: string): Promise<void>;
  checkLiked(postId: string): Promise<boolean>;
  checkVoted(postId: string): Promise<string | null>;
}
