import { Post } from '../api/postsApi';

export interface PostsState {
  feed: Post[];
  currentPost: Post | null;
  userPosts: Post[];
  isLoading: boolean;
  isRefreshing: boolean;
  isCreating: boolean;
  error: string | null;
  hasMore: boolean;
  likedPosts: Record<string, boolean>;
  votedOptions: Record<string, string | null>;
}
