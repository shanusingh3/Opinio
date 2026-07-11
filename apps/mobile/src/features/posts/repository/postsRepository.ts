import { IPostsDataSource } from '../data/postsDataSource';
import { postsDataSource } from '../data/postsDataSourceImpl';
import { Post, CreatePostRequest, UpdatePostRequest } from '../api/postsApi';

export interface IPostsRepository {
  getFeed(skip?: number, take?: number): Promise<Post[]>;
  getPostById(id: string): Promise<Post>;
  getPostsByUser(userId: string, skip?: number, take?: number): Promise<Post[]>;
  createPost(data: CreatePostRequest): Promise<Post>;
  updatePost(id: string, data: UpdatePostRequest): Promise<Post>;
  deletePost(id: string): Promise<void>;
  checkLiked(postId: string): Promise<boolean>;
  checkVoted(postId: string): Promise<string | null>;
}

class PostsRepository implements IPostsRepository {
  private static instance: PostsRepository;
  private dataSource: IPostsDataSource;

  private constructor(dataSource: IPostsDataSource) {
    this.dataSource = dataSource;
  }

  public static getInstance(
    dataSource: IPostsDataSource = postsDataSource,
  ): PostsRepository {
    if (!PostsRepository.instance) {
      PostsRepository.instance = new PostsRepository(dataSource);
    }
    return PostsRepository.instance;
  }

  public async getFeed(skip = 0, take = 20): Promise<Post[]> {
    return this.dataSource.getFeed(skip, take);
  }

  public async getPostById(id: string): Promise<Post> {
    return this.dataSource.getPostById(id);
  }

  public async getPostsByUser(
    userId: string,
    skip = 0,
    take = 20,
  ): Promise<Post[]> {
    return this.dataSource.getPostsByUser(userId, skip, take);
  }

  public async createPost(data: CreatePostRequest): Promise<Post> {
    return this.dataSource.createPost(data);
  }

  public async updatePost(id: string, data: UpdatePostRequest): Promise<Post> {
    return this.dataSource.updatePost(id, data);
  }

  public async deletePost(id: string): Promise<void> {
    return this.dataSource.deletePost(id);
  }

  public async checkLiked(postId: string): Promise<boolean> {
    return this.dataSource.checkLiked(postId);
  }

  public async checkVoted(postId: string): Promise<string | null> {
    return this.dataSource.checkVoted(postId);
  }
}

export const postsRepository = PostsRepository.getInstance();
