import React from 'react';
import { useRouter } from 'next/router';
import { useUserAuth } from '../context/UserAuthContext';
const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();
  const router = useRouter();
  if (!user) {
    router.push('/login');
  }
  return children;
};

export default ProtectedRoute;
