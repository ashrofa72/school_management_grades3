'use client'; // Add this at the very top of your file

import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../../components/navbar';
import styles from '../../../styles/FirstYear.module.css';
import styles2 from '../../../styles/Table.module.css';
import { useState, useEffect } from 'react';

export default function SecondYear() {
  const [selectedSubject, setSelectedSubject] = useState('Biology');
  const [dataRows, setDataRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(`Fetching data for grade: ${selectedSubject}`);
        const response = await fetch(`/api/sheets?Room=${selectedSubject}`);

        // Log the entire response for debugging
        console.log('Fetch Response:', response);

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log('Fetched Data:', data);
        setDataRows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      }
    }

    fetchData();
  }, [selectedSubject]);

  const handleSelectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>طلاب الصف الثاني</title>
        <meta
          name="description"
          content="Information about second year students"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <section className={styles.header}>
        <h1>طلاب الصف الثاني</h1>
      </section>

      <section className={styles.dropdown}>
        <label htmlFor="subjects">Choose a Class:</label>
        <select
          id="subjects"
          value={selectedSubject}
          onChange={handleSelectChange}
        >
          <option value="Biology">Biology</option>{' '}
          <option value="History">History</option>{' '}
          <option value="English">English</option>{' '}
          <option value="French">French</option>{' '}
          <option value="Math2">Math2</option>{' '}
          <option value="Arabic">Arabic</option>
        </select>
      </section>

      <section className={styles.content}>
        {error && <p>{error}</p>}
        {dataRows.length > 0 ? (
          <table className={styles2.table}>
            <thead>
              <tr>
                <th>FullName</th>
                <th>Room</th>
                <th>Course</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.FullName}</td>
                  <td>{row.Room}</td>
                  <td>{row.Course}</td>
                  <td>{row.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !error && <p>No data available for the selected grade.</p>
        )}
      </section>

      <footer className={styles.footer}>
        <p>&copy;مدرسة فاطمة الزهراء الثانوية بنات 2024</p>
        <p>Prog/Ashraf Eltayb</p>
      </footer>
    </div>
  );
}
