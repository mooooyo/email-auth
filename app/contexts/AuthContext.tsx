import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';
import { authService } from '../lib/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 로드 시 현재 사용자 확인
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setCurrentUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      return await authService.register(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const result = await authService.verifyEmail(email, code);
      // 인증 성공 후 자동 로그인을 위해 사용자 정보 업데이트
      if (result.success) {
        const updatedUser = authService.getCurrentUser();
        setCurrentUser(updatedUser);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async (email: string) => {
    setIsLoading(true);
    try {
      return await authService.resendCode(email);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    verifyEmail,
    resendCode,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
