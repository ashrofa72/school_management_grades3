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
          <title>طلاب الصف الثالث</title>
          <meta
            name="description"
            content="Information about first year students"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Header Section */}
        <section className={styles.header}>
          <h1>طلاب الصف الثالث</h1>
        </section>

        {/* Dropdown Menu */}
        <section className={styles.dropdown}>
          <label htmlFor="subjects">Choose a subject:</label>
          <select
            id="subjects"
            value={selectedSubject}
            onChange={handleSelectChange}
          >
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
          </select>
        </section>

        {/* Content Section Based on Dropdown Selection */}
        <section className={styles.content}>
          {selectedSubject === 'Math' && <p>Content for Math...</p>}
          {selectedSubject === 'Science' && <p>Content for Science...</p>}
          {selectedSubject === 'History' && <p>Content for History...</p>}
        </section>

        {/* Footer Section */}
        <footer className={styles.footer}>
          <p>&copy; مدرسة فاطمة الزهراء الثانوية بنات 2024</p>
          <p>Prog/Ashraf Eltayb</p>
        </footer>
      </div>
    </div>
  );
}
