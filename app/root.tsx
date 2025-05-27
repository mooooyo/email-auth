import { Outlet } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import './globals.css';

export function Root() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </AuthProvider>
  );
}
