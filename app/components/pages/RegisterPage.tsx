import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = await register(email, password);
    setMessage(result.message);
    
    if (result.success) {
      setShowVerification(true);
    }
  };

  if (showVerification) {
    return <VerificationPage email={email} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {message && (
            <div className={`text-sm text-center ${
              message.includes('완료') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? '등록 중...' : '회원가입'}
          </Button>
        </form>
      </div>
    </div>
  );
}

function VerificationPage({ email }: { email: string }) {
  const { verifyEmail, resendCode, isLoading } = useAuth();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verifyEmail(email, code);
    setMessage(result.message);
    
    if (result.success) {
      setCode('');
      // 인증 성공 후 로그인 페이지로 리다이렉트 등의 로직 추가 가능
    }
  };

  const handleResend = async () => {
    const result = await resendCode(email);
    setMessage(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            이메일 인증
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {email}로 발송된 인증코드를 입력해주세요
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div>
            <Input
              type="text"
              placeholder="인증코드 (6자리)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
            />
          </div>
          
          {message && (
            <div className={`text-sm text-center ${
              message.includes('완료') || message.includes('발송') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </div>
          )}
          
          <div className="space-y-3">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '인증 중...' : '인증하기'}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={isLoading}
              className="w-full"
            >
              인증코드 재발송
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm text-gray-600">
          <p>개발용 인증코드는 콘솔에서 확인할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}
