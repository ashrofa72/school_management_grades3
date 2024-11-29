import { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '../hooks/useAuthContext';
import { useRouter } from 'next/router';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const router = useRouter();
  const login = (email, password) => {
    setError(null);
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch({ type: 'LOGIN', payload: res.user });
        router.push('/students/page');
        console.log(res.user);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return { error, login };
};
