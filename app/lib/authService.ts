import mockData from '../data/mockData.json';
import { User, MockData } from '../types/auth';

class MockAuthService {
  private data: MockData;

  constructor() {
    // 로컬스토리지에서 기존 데이터를 가져오거나 초기 데이터 사용
    const stored = localStorage.getItem('email-auth-data');
    this.data = stored ? JSON.parse(stored) : mockData;
  }

  private saveToStorage() {
    localStorage.setItem('email-auth-data', JSON.stringify(this.data));
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateToken(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  async register(email: string, password: string): Promise<{ success: boolean; message: string }> {
    // 이메일 중복 체크
    const existingUser = this.data.users.find(user => user.email === email);
    if (existingUser) {
      return { success: false, message: '이미 등록된 이메일입니다.' };
    }

    // 새 사용자 생성
    const verificationCode = this.generateCode();
    const newUser: User = {
      id: Math.max(...this.data.users.map(u => u.id), 0) + 1,
      email,
      password, // 실제로는 해시화해야 함
      isVerified: false,
      verificationCode,
      codeExpiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10분 후 만료
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);

    // 이메일 로그 추가 (실제로는 이메일 발송)
    this.data.emailLogs.push({
      id: Math.max(...this.data.emailLogs.map(e => e.id), 0) + 1,
      email,
      type: 'verification',
      code: verificationCode,
      sentAt: new Date().toISOString(),
      status: 'sent',
    });

    this.saveToStorage();

    return { 
      success: true, 
      message: `회원가입이 완료되었습니다. ${email}로 인증코드를 발송했습니다.` 
    };
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    const user = this.data.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    if (!user.isVerified) {
      return { success: false, message: '이메일 인증이 필요합니다.' };
    }

    // 세션 생성
    const session = {
      id: Math.max(...this.data.authSessions.map(s => s.id), 0) + 1,
      userId: user.id,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24시간
      createdAt: new Date().toISOString(),
    };

    this.data.authSessions.push(session);
    this.saveToStorage();

    // 토큰을 localStorage에 저장
    localStorage.setItem('auth-token', session.token);

    return { success: true, message: '로그인에 성공했습니다.', user };
  }

  async verifyEmail(email: string, code: string): Promise<{ success: boolean; message: string }> {
    const user = this.data.users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }

    if (user.isVerified) {
      return { success: false, message: '이미 인증된 이메일입니다.' };
    }

    if (user.verificationCode !== code) {
      return { success: false, message: '인증코드가 올바르지 않습니다.' };
    }

    if (user.codeExpiry && new Date(user.codeExpiry) < new Date()) {
      return { success: false, message: '인증코드가 만료되었습니다.' };
    }

    // 이메일 인증 완료
    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpiry = null;

    this.saveToStorage();

    return { success: true, message: '이메일 인증이 완료되었습니다!' };
  }

  async resendCode(email: string): Promise<{ success: boolean; message: string }> {
    const user = this.data.users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }

    if (user.isVerified) {
      return { success: false, message: '이미 인증된 이메일입니다.' };
    }

    // 새 인증코드 생성
    const newCode = this.generateCode();
    user.verificationCode = newCode;
    user.codeExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10분 후 만료

    // 이메일 로그 추가
    this.data.emailLogs.push({
      id: Math.max(...this.data.emailLogs.map(e => e.id), 0) + 1,
      email,
      type: 'verification',
      code: newCode,
      sentAt: new Date().toISOString(),
      status: 'sent',
    });

    this.saveToStorage();

    return { success: true, message: '새로운 인증코드를 발송했습니다.' };
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem('auth-token');
    if (!token) return null;

    const session = this.data.authSessions.find(s => s.token === token);
    if (!session || new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem('auth-token');
      return null;
    }

    return this.data.users.find(u => u.id === session.userId) || null;
  }

  logout(): void {
    const token = localStorage.getItem('auth-token');
    if (token) {
      // 세션 제거
      this.data.authSessions = this.data.authSessions.filter(s => s.token !== token);
      this.saveToStorage();
      localStorage.removeItem('auth-token');
    }
  }

  // 개발용 헬퍼 메서드들
  getAllUsers(): User[] {
    return this.data.users;
  }

  getEmailLogs() {
    return this.data.emailLogs;
  }

  resetData(): void {
    localStorage.removeItem('email-auth-data');
    localStorage.removeItem('auth-token');
    this.data = mockData;
  }
}

export const authService = new MockAuthService();
