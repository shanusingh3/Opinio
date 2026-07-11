import { apiClient } from '@/services/api/apiClient';
import { Like, ToggleLikeRequest, ToggleLikeResponse } from '../api/likesApi';

class LikesServiceRest {
  private static instance: LikesServiceRest;
  private readonly basePath = '/likes';

  private constructor() {}

  public static getInstance(): LikesServiceRest {
    if (!LikesServiceRest.instance) {
      LikesServiceRest.instance = new LikesServiceRest();
    }
    return LikesServiceRest.instance;
  }

  public async toggleLike(data: ToggleLikeRequest): Promise<ToggleLikeResponse> {
    return apiClient.post<ToggleLikeResponse>(`${this.basePath}/toggle`, data);
  }

  public async likePost(postId: string): Promise<Like> {
    return apiClient.post<Like>(`${this.basePath}/post/${postId}`);
  }

  public async unlikePost(postId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.basePath}/post/${postId}`);
  }

  public async likeComment(commentId: string): Promise<Like> {
    return apiClient.post<Like>(`${this.basePath}/comment/${commentId}`);
  }

  public async unlikeComment(commentId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.basePath}/comment/${commentId}`);
  }
}

export const likesService = LikesServiceRest.getInstance();
