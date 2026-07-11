import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { useAppDispatch, useAppSelector } from '@/store';

import {
  selectIsAuthenticated,
  selectIsHydrated,
  selectUser,
  selectIsLoading,
  selectError,
  clearError,
} from '../state/authSlice';
import {
  sendOtp,
  verifyOtp,
  hydrateAuthFromStorage,
  logout as logoutThunk,
} from '../state/authThunks';
import { User } from '../state/authTypes';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  user: User | null;
  error: string | null;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrated = useAppSelector(selectIsHydrated);
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(hydrateAuthFromStorage());
  }, [dispatch]);

  const handleSendOtp = useCallback(
    async (phone: string): Promise<boolean> => {
      const result = await dispatch(sendOtp(phone));
      return !sendOtp.rejected.match(result);
    },
    [dispatch],
  );

  const handleVerifyOtp = useCallback(
    async (phone: string, otp: string): Promise<boolean> => {
      const result = await dispatch(verifyOtp({ phone, otp }));
      return !verifyOtp.rejected.match(result);
    },
    [dispatch],
  );

  const handleLogout = useCallback(async (): Promise<void> => {
    await dispatch(logoutThunk());
  }, [dispatch]);

  const clearAuthError = useCallback((): void => {
    dispatch(clearError());
  }, [dispatch]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      isHydrated,
      user,
      error,
      sendOtp: handleSendOtp,
      verifyOtp: handleVerifyOtp,
      logout: handleLogout,
      clearAuthError,
    }),
    [
      isAuthenticated,
      isLoading,
      isHydrated,
      user,
      error,
      handleSendOtp,
      handleVerifyOtp,
      handleLogout,
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
