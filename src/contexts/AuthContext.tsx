import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  district?: string;
  language?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, district: string, language: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      // Fallback: if backend is down, allow demo login
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        if (email === 'farmer@example.com' && password === 'password') {
          const mockUser = { id: 'farmer-001', email, name: 'Rajesh Kumar', district: 'Kendrapara', language: 'en' };
          setToken('demo-token-' + Date.now());
          setUser(mockUser);
          return;
        }
        if (email === 'kisan@example.com' && password === 'password') {
          const mockUser = { id: 'farmer-002', email, name: 'ସୁନୀଲ ମହାନ୍ତି', district: 'Puri', language: 'or' };
          setToken('demo-token-' + Date.now());
          setUser(mockUser);
          return;
        }
      }
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, district: string, language: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, district, language })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      // Fallback: if backend is down, allow demo registration
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const mockUser = { id: 'farmer-' + Date.now(), email, name, district, language };
        setToken('demo-token-' + Date.now());
        setUser(mockUser);
        return;
      }
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
