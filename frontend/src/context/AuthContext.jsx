import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('verdict_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('verdict_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const saveAuthSession = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('verdict_token', newToken);
    localStorage.setItem('verdict_user', JSON.stringify(newUser));
  }, []);

  const clearAuthSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('verdict_token');
    localStorage.removeItem('verdict_user');
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      saveAuthSession(response.token, response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup(userData);
      saveAuthSession(response.token, response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    clearAuthSession();
  }, [clearAuthSession]);

  const updateCurrentUser = useCallback((updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('verdict_user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
