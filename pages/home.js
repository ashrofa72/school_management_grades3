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
        {/* Add image with a link to Facebook on the left */}
        {/*<div className={styles.imageContainer}>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/undraw_social-notifications_mzoe.png"
              alt="Educator Illustration"
              className={styles.imageContainer}
            />
          </a>
        </div>
        {/* Add image at the top of the page */}
        <img
          src="/images/undraw_online-test_20lm.png"
          alt="Educator Illustration"
          className={styles.image}
        />

        <h6 className={styles.title}> مدرسة فاطمة الزهراء الثانوية للبنات </h6>
        <h7 className={styles.title}>أقسام نظام المعلومات المدرسية</h7>
        <div className={styles.grid}>
          <a onClick={() => router.push('/teachers')} className={styles.card}>
            <h2> &rarr; المعلمون </h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>
          <a
            onClick={() => router.push('/')}
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2> &rarr; اعلانات </h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
          <a
            onClick={() => router.push('/students/page')}
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2> &rarr; الطلاب </h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
          <a
            onClick={() => router.push('/teachers/dashboard3')}
            className={styles.card}
          >
            <h2> &rarr; الرئيسية</h2>
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
