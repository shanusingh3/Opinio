import { createAsyncThunk } from '@reduxjs/toolkit';
import { postsRepository } from '../repository/postsRepository';
import { Post, CreatePostRequest, UpdatePostRequest } from '../api/postsApi';

export const fetchFeed = createAsyncThunk<
  { posts: Post[]; isRefresh: boolean },
  { skip?: number; take?: number; isRefresh?: boolean },
  { rejectValue: string }
>('posts/fetchFeed', async ({ skip = 0, take = 20, isRefresh = false }, { rejectWithValue }) => {
  try {
    const posts = await postsRepository.getFeed(skip, take);
    return { posts, isRefresh };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch feed';
    return rejectWithValue(message);
  }
});

export const fetchPostById = createAsyncThunk<
  Post,
  string,
  { rejectValue: string }
>('posts/fetchPostById', async (id, { rejectWithValue }) => {
  try {
    return await postsRepository.getPostById(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch post';
    return rejectWithValue(message);
  }
});

export const fetchUserPosts = createAsyncThunk<
  Post[],
  { userId: string; skip?: number; take?: number },
  { rejectValue: string }
>('posts/fetchUserPosts', async ({ userId, skip = 0, take = 20 }, { rejectWithValue }) => {
  try {
    return await postsRepository.getPostsByUser(userId, skip, take);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user posts';
    return rejectWithValue(message);
  }
});

export const createPost = createAsyncThunk<
  Post,
  CreatePostRequest,
  { rejectValue: string }
>('posts/createPost', async (data, { rejectWithValue }) => {
  try {
    return await postsRepository.createPost(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create post';
    return rejectWithValue(message);
  }
});

export const updatePost = createAsyncThunk<
  Post,
  { id: string; data: UpdatePostRequest },
  { rejectValue: string }
>('posts/updatePost', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await postsRepository.updatePost(id, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update post';
    return rejectWithValue(message);
  }
});

export const deletePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('posts/deletePost', async (id, { rejectWithValue }) => {
  try {
    await postsRepository.deletePost(id);
    return id;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete post';
    return rejectWithValue(message);
  }
});

export const checkPostLiked = createAsyncThunk<
  { postId: string; liked: boolean },
  string,
  { rejectValue: string }
>('posts/checkLiked', async (postId, { rejectWithValue }) => {
  try {
    const liked = await postsRepository.checkLiked(postId);
    return { postId, liked };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to check like status';
    return rejectWithValue(message);
  }
});

export const checkPostVoted = createAsyncThunk<
  { postId: string; optionId: string | null },
  string,
  { rejectValue: string }
>('posts/checkVoted', async (postId, { rejectWithValue }) => {
  try {
    const optionId = await postsRepository.checkVoted(postId);
    return { postId, optionId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to check vote status';
    return rejectWithValue(message);
  }
});
