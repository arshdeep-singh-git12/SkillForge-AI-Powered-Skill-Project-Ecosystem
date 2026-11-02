'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe } from '../services/auth.service';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  githubUrl?: string;
  linkedinUrl?: string;
  leetcodeUrl?: string;
  hackerrankUrl?: string;
  profileEvaluation?: string;
  connections?: string[];
  connectionRequests?: string[];
  totalLikes?: number;
  skills?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const urlToken = urlParams.get('token');
          if (urlToken) {
            localStorage.setItem('skillforge_token', urlToken);
            document.cookie = `token=${urlToken}; path=/; max-age=604800; SameSite=Lax`;
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('skillforge_token');
          document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const { logoutUser } = await import('../services/auth.service');
      await logoutUser();
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('skillforge_token');
        document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
        window.location.href = '/login';
      }
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
