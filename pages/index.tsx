import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

const MainPage = () => {
  const router = useRouter();
  const auth = getAuth(); // Initialize Firebase Auth instance

  useEffect(() => {
    // Check authentication state on load
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, navigate to home page
        router.push('/home');
      } else {
        // User is not logged in, navigate to login page
        router.push('/login');
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth, router]);

  return <div>Loading...</div>; // Optional: Show a loading state while checking auth
};

export default MainPage;
