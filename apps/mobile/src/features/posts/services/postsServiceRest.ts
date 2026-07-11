import { apiClient } from '@/services/api/apiClient';
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
} from '../api/postsApi';
import { IPostsService } from './postsService';

class PostsServiceRest implements IPostsService {
  private static instance: PostsServiceRest;
  private readonly basePath = '/posts';

  private constructor() {}

  public static getInstance(): PostsServiceRest {
    if (!PostsServiceRest.instance) {
      PostsServiceRest.instance = new PostsServiceRest();
    }
    return PostsServiceRest.instance;
  }

  public async getFeed(skip = 0, take = 20): Promise<Post[]> {
    return apiClient.get<Post[]>(
      `${this.basePath}/feed?skip=${skip}&take=${take}`,
    );
  }

  public async getPostById(id: string): Promise<Post> {
    return apiClient.get<Post>(`${this.basePath}/${id}`);
  }

  public async getPostsByUser(
    userId: string,
    skip = 0,
    take = 20,
  ): Promise<Post[]> {
    return apiClient.get<Post[]>(
      `${this.basePath}/user/${userId}?skip=${skip}&take=${take}`,
    );
  }

  public async createPost(data: CreatePostRequest): Promise<Post> {
    return apiClient.post<Post>(this.basePath, data);
  }

  public async updatePost(id: string, data: UpdatePostRequest): Promise<Post> {
    return apiClient.put<Post>(`${this.basePath}/${id}`, data);
  }

  public async deletePost(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  public async checkLiked(postId: string): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/${postId}/liked`);
  }

  public async checkVoted(postId: string): Promise<string | null> {
    return apiClient.get<string | null>(`${this.basePath}/${postId}/voted`);
  }
}

export const postsServiceRest = PostsServiceRest.getInstance();
