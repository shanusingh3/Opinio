export interface User {
  id: string;
  phone: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}

export interface LoginPayload {
  user: User;
  token: string;
}
