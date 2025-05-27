export interface User {
  id: number;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode: string | null;
  codeExpiry: string | null;
  createdAt: string;
}

export interface AuthSession {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface EmailLog {
  id: number;
  email: string;
  type: 'verification' | 'password-reset';
  code: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'delivered';
}

export interface MockData {
  users: User[];
  authSessions: AuthSession[];
  emailLogs: EmailLog[];
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  resendCode: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}
