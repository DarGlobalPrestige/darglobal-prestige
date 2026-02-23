"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  fullName: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  setUserFromApply: (name: string, email: string, isAdmin?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "darglobal_user";
const ADMIN_KEY = "darglobal_admin";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const admin = sessionStorage.getItem(ADMIN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser({ ...parsed, isAdmin: admin === "true" });
      }
    } catch {
      setUser(null);
    }
  }, []);

  const setUserFromApply = (fullName: string, email: string, isAdmin = false) => {
    const u = { fullName, email, isAdmin };
    setUser(u);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    sessionStorage.setItem(ADMIN_KEY, isAdmin ? "true" : "false");
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, logout, setUserFromApply }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
