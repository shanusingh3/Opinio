import { IPostsService } from '../services/postsService';
import { postsServiceRest } from '../services/postsServiceRest';
import { IPostsDataSource } from './postsDataSource';
import { Post, CreatePostRequest, UpdatePostRequest } from '../api/postsApi';

export class PostsDataSourceImpl implements IPostsDataSource {
  private static instance: PostsDataSourceImpl;
  private postsService: IPostsService;

  private constructor(postsService: IPostsService) {
    this.postsService = postsService;
  }

  public static getInstance(
    postsService: IPostsService = postsServiceRest,
  ): PostsDataSourceImpl {
    if (!PostsDataSourceImpl.instance) {
      PostsDataSourceImpl.instance = new PostsDataSourceImpl(postsService);
    }
    return PostsDataSourceImpl.instance;
  }

  public async getFeed(skip = 0, take = 20): Promise<Post[]> {
    return this.postsService.getFeed(skip, take);
  }

  public async getPostById(id: string): Promise<Post> {
    return this.postsService.getPostById(id);
  }

  public async getPostsByUser(
    userId: string,
    skip = 0,
    take = 20,
  ): Promise<Post[]> {
    return this.postsService.getPostsByUser(userId, skip, take);
  }

  public async createPost(data: CreatePostRequest): Promise<Post> {
    return this.postsService.createPost(data);
  }

  public async updatePost(id: string, data: UpdatePostRequest): Promise<Post> {
    return this.postsService.updatePost(id, data);
  }

  public async deletePost(id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }

  public async checkLiked(postId: string): Promise<boolean> {
    return this.postsService.checkLiked(postId);
  }

  public async checkVoted(postId: string): Promise<string | null> {
    return this.postsService.checkVoted(postId);
  }
}

export const postsDataSource = PostsDataSourceImpl.getInstance();
