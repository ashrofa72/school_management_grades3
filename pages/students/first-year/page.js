'use client'; // Add this at the very top of your file
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../../components/navbar';
import styles from '../../../styles/FirstYear.module.css';
import { useState } from 'react';

export default function FirstYear() {
  const [selectedSubject, setSelectedSubject] = useState('Math');

  const handleSelectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Head>
          <title>طلاب الصف الأول</title>
          <meta
            name="description"
            content="Information about first year students"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Header Section */}
        <section className={styles.header}>
          <h1>طلاب الصف الأول</h1>
        </section>

        {/* Dropdown Menu */}
        <section className={styles.dropdown}>
          <label htmlFor="subjects">Choose a Class:</label>
          <select
            id="subjects"
            value={selectedSubject}
            onChange={handleSelectChange}
          >
            <option value="1-1">1-1</option>
            <option value="1-2">1-2</option>
            <option value="1-3">1-3</option>
            <option value="1-4">1-4</option>
            <option value="1-5">1-5</option>
            <option value="1-6">1-6</option>
            <option value="1-7">1-7</option>
            <option value="1-8">1-8</option>
          </select>
        </section>

        {/* Content Section Based on Dropdown Selection */}
        <section className={styles.content}>
          {selectedSubject === '1-1' && <p>Content for 1-1...</p>}
          {selectedSubject === '1-2' && <p>Content for 1-2...</p>}
          {selectedSubject === '1-3' && <p>Content for 1-3...</p>}
          {selectedSubject === '1-4' && <p>Content for 1-4...</p>}
          {selectedSubject === '1-5' && <p>Content for 1-5...</p>}
          {selectedSubject === '1-6' && <p>Content for 1-6...</p>}
          {selectedSubject === '1-7' && <p>Content for 1-7...</p>}
          {selectedSubject === '1-8' && <p>Content for 1-8...</p>}
        </section>

        {/* Footer Section */}
        <footer className={styles.footer}>
          <p>&copy; 2024 مدرسة فاطمة الزهراء الثانوية للبنات</p>
          <p>Developed by Ashraf Eltayb</p>
        </footer>
      </div>
    </div>
  );
}
