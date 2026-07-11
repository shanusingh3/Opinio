import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostsState } from './postsTypes';
import {
  fetchFeed,
  fetchPostById,
  fetchUserPosts,
  createPost,
  updatePost,
  deletePost,
  checkPostLiked,
  checkPostVoted,
} from './postsThunks';

const initialState: PostsState = {
  feed: [],
  currentPost: null,
  userPosts: [],
  isLoading: false,
  isRefreshing: false,
  isCreating: false,
  error: null,
  hasMore: true,
  likedPosts: {},
  votedOptions: {},
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearCurrentPost: state => {
      state.currentPost = null;
    },
    clearError: state => {
      state.error = null;
    },
    updatePostLikeCount: (
      state,
      action: PayloadAction<{ postId: string; increment: boolean }>,
    ) => {
      const { postId, increment } = action.payload;
      const post = state.feed.find(p => p.id === postId);
      if (post) {
        post.likeCount += increment ? 1 : -1;
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.likeCount += increment ? 1 : -1;
      }
      state.likedPosts[postId] = increment;
    },
    updatePollVote: (
      state,
      action: PayloadAction<{
        postId: string;
        oldOptionId: string | null;
        newOptionId: string;
      }>,
    ) => {
      const { postId, oldOptionId, newOptionId } = action.payload;
      const updatePoll = (post: typeof state.feed[0] | null) => {
        if (!post?.poll) return;
        if (oldOptionId) {
          const oldOption = post.poll.options.find(o => o.id === oldOptionId);
          if (oldOption) oldOption.voteCount -= 1;
        } else {
          post.poll.totalVotes += 1;
        }
        const newOption = post.poll.options.find(o => o.id === newOptionId);
        if (newOption) newOption.voteCount += 1;
      };

      const feedPost = state.feed.find(p => p.id === postId);
      updatePoll(feedPost ?? null);
      if (state.currentPost?.id === postId) {
        updatePoll(state.currentPost);
      }
      state.votedOptions[postId] = newOptionId;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        if (action.meta.arg.isRefresh) {
          state.isRefreshing = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        const { posts, isRefresh, likedPosts, votedOptions } = action.payload;
        if (isRefresh) {
          state.feed = posts;
          state.likedPosts = likedPosts;
          state.votedOptions = votedOptions;
        } else {
          state.feed = [...state.feed, ...posts];
          state.likedPosts = { ...state.likedPosts, ...likedPosts };
          state.votedOptions = { ...state.votedOptions, ...votedOptions };
        }
        state.hasMore = posts.length === 20;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = action.payload ?? 'Failed to fetch feed';
      })

      .addCase(fetchPostById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch post';
      })

      .addCase(fetchUserPosts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch user posts';
      })

      .addCase(createPost.pending, state => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreating = false;
        state.feed = [action.payload, ...state.feed];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload ?? 'Failed to create post';
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.feed.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.feed[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.feed = state.feed.filter(p => p.id !== action.payload);
        state.userPosts = state.userPosts.filter(p => p.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })

      .addCase(checkPostLiked.fulfilled, (state, action) => {
        state.likedPosts[action.payload.postId] = action.payload.liked;
      })

      .addCase(checkPostVoted.fulfilled, (state, action) => {
        state.votedOptions[action.payload.postId] = action.payload.optionId;
      });
  },
});

export const {
  clearCurrentPost,
  clearError,
  updatePostLikeCount,
  updatePollVote,
} = postsSlice.actions;

interface RootStateWithPosts {
  posts: PostsState;
}

export const selectFeed = (state: RootStateWithPosts) => state.posts.feed;
export const selectCurrentPost = (state: RootStateWithPosts) =>
  state.posts.currentPost;
export const selectUserPosts = (state: RootStateWithPosts) =>
  state.posts.userPosts;
export const selectPostsLoading = (state: RootStateWithPosts) =>
  state.posts.isLoading;
export const selectPostsRefreshing = (state: RootStateWithPosts) =>
  state.posts.isRefreshing;
export const selectPostsCreating = (state: RootStateWithPosts) =>
  state.posts.isCreating;
export const selectPostsError = (state: RootStateWithPosts) =>
  state.posts.error;
export const selectHasMore = (state: RootStateWithPosts) => state.posts.hasMore;
export const selectLikedPosts = (state: RootStateWithPosts) =>
  state.posts.likedPosts;
export const selectVotedOptions = (state: RootStateWithPosts) =>
  state.posts.votedOptions;

export default postsSlice.reducer;
