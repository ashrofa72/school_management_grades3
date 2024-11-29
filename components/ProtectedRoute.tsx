import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [router, user]);

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
