import Link from 'next/link';
import styles from '../styles/navbar.module.css';
import { useLogout } from '../hooks/useLogout';
import { auth } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  console.log(user);

  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.item}>
          <p style={{ color: 'white' }}>
            {user ? auth.currentUser.displayName : 'No User'}
          </p>
          <a onClick={logout} className={styles.link}>
            {user && <button>خروج</button>}
          </a>
        </li>
        <li>
          <Link href="/scanner/page">التابلت</Link>
        </li>
        <li>
          <Link href="/students/third-year/page">الصف الثالث </Link>
        </li>
        <li>
          <Link href="/students/second-year/page">الصف الثاني</Link>
        </li>
        <li>
          <Link href="/students/first-year/page">الصف الأول</Link>
        </li>
        <li>
          <Link href="/students/page">الصفوف</Link>
        </li>
        <li>
          <Link href="/home">الرئيسية</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
