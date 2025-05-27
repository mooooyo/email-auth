import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

export function DashboardPage() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            로그인이 필요합니다
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">대시보드</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentUser.email}</span>
              <Button variant="outline" onClick={logout}>
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">환영합니다!</h2>
            <p className="text-gray-600">
              {currentUser.email}님의 계정이 정상적으로 로그인되었습니다.
            </p>
            <div className="mt-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentUser.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentUser.isVerified ? '이메일 인증완료' : '이메일 인증대기'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
