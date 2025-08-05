// components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading, refreshAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Try to refresh auth on mount if we have a token but not authenticated
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage && !isAuthenticated && !isLoading) {
      try {
        const parsedStorage = JSON.parse(authStorage);
        if (parsedStorage.state?.refreshToken) {
          refreshAuth().catch(() => {
            // Refresh failed, will be handled by the auth store
          });
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }
  }, [isAuthenticated, isLoading, refreshAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect logic
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // If user is authenticated but trying to access auth pages, redirect to dashboard
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;