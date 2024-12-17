import React from 'react';
import styles from '../styles/Home.module.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useRouter } from 'next/router';

const Home = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h6 className={styles.title}> مدرسة فاطمة الزهراء الثانوية للبنات </h6>
        <h7 className={styles.title}>أقسام نظام المعلومات المدرسية</h7>
        <div className={styles.grid}>
          <a onClick={() => router.push('/teachers')} className={styles.card}>
            <h2>المعلمون &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>
          <a
            onClick={() => router.push('/students/page')}
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>الطلاب &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
          <a onClick={() => router.push('/adspage')} className={styles.card}>
            <h2>اعلانات المدرسة &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
