import { apiClient } from '@/services/api/apiClient';
import {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../api/commentsApi';

class CommentsServiceRest {
  private static instance: CommentsServiceRest;
  private readonly basePath = '/comments';

  private constructor() {}

  public static getInstance(): CommentsServiceRest {
    if (!CommentsServiceRest.instance) {
      CommentsServiceRest.instance = new CommentsServiceRest();
    }
    return CommentsServiceRest.instance;
  }

  public async getByPostId(
    postId: string,
    skip = 0,
    take = 20,
  ): Promise<Comment[]> {
    return apiClient.get<Comment[]>(
      `${this.basePath}/post/${postId}?skip=${skip}&take=${take}`,
    );
  }

  public async getReplies(
    commentId: string,
    skip = 0,
    take = 20,
  ): Promise<Comment[]> {
    return apiClient.get<Comment[]>(
      `${this.basePath}/${commentId}/replies?skip=${skip}&take=${take}`,
    );
  }

  public async getById(id: string): Promise<Comment> {
    return apiClient.get<Comment>(`${this.basePath}/${id}`);
  }

  public async create(data: CreateCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(this.basePath, data);
  }

  public async update(id: string, data: UpdateCommentRequest): Promise<Comment> {
    return apiClient.put<Comment>(`${this.basePath}/${id}`, data);
  }

  public async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const commentsService = CommentsServiceRest.getInstance();
