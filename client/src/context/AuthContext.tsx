import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { authApi } from '../lib/api';
import type { AuthResponse, AuthUser } from '../types/api';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = 'smart-leads-auth';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const persistAuth = (payload: AuthResponse | null): void => {
  if (!payload) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('smart-leads-token');
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  localStorage.setItem('smart-leads-token', payload.token);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue) as AuthResponse;
        setUser(parsed.user);
        setToken(parsed.token);
        localStorage.setItem('smart-leads-token', parsed.token);
      } catch {
        persistAuth(null);
      }
    }

    setReady(true);
  }, []);

  const handleAuth = (payload: AuthResponse): void => {
    setUser(payload.user);
    setToken(payload.token);
    persistAuth(payload);
  };

  const login = async (email: string, password: string): Promise<void> => {
    handleAuth(await authApi.login(email, password));
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    handleAuth(await authApi.register(name, email, password));
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    persistAuth(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      ready,
      login,
      register,
      logout
    }),
    [user, token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};