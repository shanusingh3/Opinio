import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState, LoginPayload } from './authTypes';
import {
  sendOtp,
  verifyOtp,
  hydrateAuthFromStorage,
  logout,
} from './authThunks';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendOtp.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to send OTP';
      })

      .addCase(verifyOtp.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to verify OTP';
      })

      .addCase(hydrateAuthFromStorage.pending, state => {
        state.isLoading = true;
      })
      .addCase(hydrateAuthFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isHydrated = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(hydrateAuthFromStorage.rejected, state => {
        state.isLoading = false;
        state.isHydrated = true;
      })

      .addCase(logout.pending, state => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, clearCredentials, clearError } =
  authSlice.actions;

interface RootStateWithAuth {
  auth: AuthState;
}

export const selectAuth = (state: RootStateWithAuth) => state.auth;
export const selectIsAuthenticated = (state: RootStateWithAuth) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootStateWithAuth) => state.auth.user;
export const selectToken = (state: RootStateWithAuth) => state.auth.token;
export const selectIsHydrated = (state: RootStateWithAuth) =>
  state.auth.isHydrated;
export const selectIsLoading = (state: RootStateWithAuth) =>
  state.auth.isLoading;
export const selectError = (state: RootStateWithAuth) => state.auth.error;

export default authSlice.reducer;
