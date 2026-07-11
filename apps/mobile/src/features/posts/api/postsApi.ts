export enum PostType {
  QUESTION = 'QUESTION',
  POLL = 'POLL',
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  avatarUrl?: string;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
  order: number;
}

export interface Poll {
  id: string;
  totalVotes: number;
  endsAt?: string;
  options: PollOption[];
}

export interface Post {
  id: string;
  type: PostType;
  content: string;
  authorId: string;
  author: User;
  likeCount: number;
  commentCount: number;
  poll?: Poll;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  type: PostType;
  content: string;
  pollOptions?: { text: string }[];
  pollEndsAt?: string;
}

export interface UpdatePostRequest {
  content: string;
}

export interface FeedResponse {
  posts: Post[];
}
