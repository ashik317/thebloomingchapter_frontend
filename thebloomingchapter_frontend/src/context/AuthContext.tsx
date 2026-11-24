"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, tokens } from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (data: AuthResponse) => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (u: User) => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!tokens.access && !tokens.refresh) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<User>("/auth/me/");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    const onLogout = () => setUser(null);
    window.addEventListener("bb:logout", onLogout);
    return () => window.removeEventListener("bb:logout", onLogout);
  }, [refreshUser]);

  const signIn = (data: AuthResponse) => {
    tokens.set(data.access, data.refresh);
    setUser(data.user);
  };

  const signOut = async () => {
    try {
      if (tokens.refresh) await api.post("/auth/logout/", { refresh: tokens.refresh });
    } catch {
      /* token may already be invalid */
    }
    tokens.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refreshUser, setUser }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
