import { createAsyncThunk } from '@reduxjs/toolkit';

import { authRepository } from '../repository/authRepository';
import { AuthCredentials } from '../data/authDataSource';

export const sendOtp = createAsyncThunk<void, string, { rejectValue: string }>(
  'auth/sendOtp',
  async (phone, { rejectWithValue }) => {
    try {
      await authRepository.sendOtp(phone);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send OTP';
      return rejectWithValue(message);
    }
  },
);

export const verifyOtp = createAsyncThunk<
  AuthCredentials,
  { phone: string; otp: string },
  { rejectValue: string }
>('auth/verifyOtp', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const credentials = await authRepository.verifyOtp(phone, otp);
    return credentials;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to verify OTP';
    return rejectWithValue(message);
  }
});

export const hydrateAuthFromStorage = createAsyncThunk<
  AuthCredentials | null,
  void,
  { rejectValue: string }
>('auth/hydrate', async (_, { rejectWithValue }) => {
  try {
    const credentials = await authRepository.getStoredCredentials();
    return credentials;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to hydrate auth';
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authRepository.logout();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to logout';
      return rejectWithValue(message);
    }
  },
);
