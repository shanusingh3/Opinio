import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from '@/features/auth/state/authSlice';
import postsReducer from '@/features/posts/state/postsSlice';
import { AuthState } from '@/features/auth/state/authTypes';
import { PostsState } from '@/features/posts/state/postsTypes';

export interface RootState {
  auth: AuthState;
  posts: PostsState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
