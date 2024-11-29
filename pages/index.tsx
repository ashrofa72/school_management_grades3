import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
  const { user } = useAuthContext(); // Access the user from AuthContext
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home'); // Redirect to home if user is logged in
      } else {
        router.push('/login'); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, [router]);

  return <div>Loading...</div>; // Placeholder content while redirecting
};

export default Home;
