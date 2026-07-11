import { apiClient } from '@/services/api/apiClient';
import { Vote, CreateVoteRequest } from '../api/votesApi';

class VotesServiceRest {
  private static instance: VotesServiceRest;
  private readonly basePath = '/votes';

  private constructor() {}

  public static getInstance(): VotesServiceRest {
    if (!VotesServiceRest.instance) {
      VotesServiceRest.instance = new VotesServiceRest();
    }
    return VotesServiceRest.instance;
  }

  public async vote(data: CreateVoteRequest): Promise<Vote> {
    return apiClient.post<Vote>(this.basePath, data);
  }

  public async changeVote(data: CreateVoteRequest): Promise<Vote> {
    return apiClient.post<Vote>(`${this.basePath}/change`, data);
  }

  public async unvote(pollOptionId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${this.basePath}/${pollOptionId}`);
  }
}

export const votesService = VotesServiceRest.getInstance();
