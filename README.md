# Email Auth - Mock Data Development Setup

JSON 기반 임시 데이터를 사용한 이메일 인증 시스템 개발 환경입니다.

## 🚀 개발 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어주세요.

## 📱 페이지 구조

- `/` 또는 `/login` - 로그인 페이지
- `/register` - 회원가입 페이지  
- `/dashboard` - 로그인 후 대시보드

## 🔐 테스트 계정

### 인증 완료된 계정
- 이메일: `verified@example.com`
- 비밀번호: `password456`

### 인증 필요한 계정
- 이메일: `test@example.com` 
- 비밀번호: `password123`
- 인증코드: `123456`

## 🛠 개발 기능

### Mock 데이터 시스템
- 실제 데이터베이스 없이 JSON 파일 기반으로 동작
- localStorage를 사용해 브라우저 새로고침 후에도 데이터 유지
- 실제 이메일 발송 없이 콘솔에서 인증코드 확인 가능

### 포함된 기능
- [x] 회원가입
- [x] 이메일 인증 코드 발송/확인
- [x] 로그인/로그아웃
- [x] 세션 관리
- [x] 인증코드 재발송
- [x] 사용자 상태 관리 (React Context)

### 개발자 도구
- 대시보드에서 "데이터 초기화" 버튼으로 모든 데이터 리셋 가능
- 브라우저 개발자 도구에서 localStorage 확인 가능

## 📦 기술 스택

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v7
- **State Management**: React Context API
- **Build Tool**: Webpack
- **Data Storage**: JSON + localStorage

## 🔧 Scripts

```bash
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅
```

## 📝 데이터 구조

### 사용자 (User)
```typescript
{
  id: number;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode: string | null;
  codeExpiry: string | null;
  createdAt: string;
}
```

### 세션 (AuthSession)
```typescript
{
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
}
```

### 이메일 로그 (EmailLog)
```typescript
{
  id: number;
  email: string;
  type: 'verification' | 'password-reset';
  code: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'delivered';
}
```

## 🎯 다음 단계

1. 실제 백엔드 API 연결
2. 이메일 발송 서비스 연동 
3. 비밀번호 재설정 기능
4. 소셜 로그인 추가
5. 사용자 프로필 관리

---

**참고**: 이 설정은 개발 환경용입니다. 프로덕션에서는 실제 데이터베이스와 이메일 서비스를 사용해야 합니다.
