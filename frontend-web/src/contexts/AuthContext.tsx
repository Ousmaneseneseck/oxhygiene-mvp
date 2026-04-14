import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userRole: string | null;
  userId: number | null;
  login: (phone: string, otp: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Décoder le token pour extraire les informations
  const decodeToken = (tokenValue: string) => {
    try {
      const payload = JSON.parse(atob(tokenValue.split('.')[1]));
      setUserRole(payload.role || 'patient');
      setUserId(payload.sub || null);
      return payload;
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return null;
    }
  };

  // Vérifier le token au chargement
  useEffect(() => {
    if (token) {
      decodeToken(token);
      // Configurer l'API interceptor
      api.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    }
  }, [token]);

  const sendOtp = async (phone: string) => {
    await api.post('/auth/send-otp', { phone });
  };

  const login = async (phone: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    const { access_token } = response.data;
    
    localStorage.setItem('token', access_token);
    setToken(access_token);
    
    // Décoder le token pour obtenir le rôle
    const payload = decodeToken(access_token);
    
    return payload;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        userRole,
        userId,
        login,
        sendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};