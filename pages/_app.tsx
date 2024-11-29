import '@/styles/globals.css';
import type { AppProps } from 'next/app';
//import Navbar2 from '../components/Navbar2';
//import Footer from '../components/Footer';
import { UserAuthContextProvider } from '../context/UserAuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import { GoogleFonts } from 'next-google-fonts';

const noAuthRequired = ['/phonesignup', '/signup', '/login'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <UserAuthContextProvider>
      {noAuthRequired.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </UserAuthContextProvider>
  );
}
