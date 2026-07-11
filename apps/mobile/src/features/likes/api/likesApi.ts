export interface Like {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  createdAt: string;
}

export interface ToggleLikeRequest {
  postId?: string;
  commentId?: string;
}

export interface ToggleLikeResponse {
  id?: string;
  message?: string;
}
