import '../styles/globals.css';
import type { AppProps } from 'next/app';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import Footer3 from "../components/Footer3";
//import adspage from "../pages/adspage";
//import Navstrap2 from "../components/Navbar2";
import { AuthContextProvider } from '../context/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
//import 'bootstrap/dist/css/bootstrap.css';
import Script from 'next/script';

const noAuthRequired = ['/login', '/signup'];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      {noAuthRequired.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthContextProvider>
  );
}

export default MyApp;
