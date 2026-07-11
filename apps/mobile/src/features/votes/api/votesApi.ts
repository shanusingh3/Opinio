export interface Vote {
  id: string;
  userId: string;
  pollOptionId: string;
  createdAt: string;
}

export interface CreateVoteRequest {
  pollOptionId: string;
}
