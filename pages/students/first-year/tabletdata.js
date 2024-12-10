'use client';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Head from 'next/head';
import Navbar from '../../../components/navbar';
import styles2 from '../../../styles/Table.module.css';
import styles from '../../../styles/FirstYear.module.css';
import { useState, useEffect, useRef } from 'react';

export default function ScannerDataPage() {
  const [dataRows, setDataRows] = useState([]);
  const [error, setError] = useState(null);
  const tableRef = useRef(); // Reference to the table for printing

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching Scanner Data...');
        const response = await fetch('/api/scannerdata');

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
  }, []);

  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Scanner Data Table</title>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
              font-family: Arial, sans-serif;
              font-size: 12px;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Scanner Data</h1>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <div className={styles.container}>
          <Head>
            <title>بيانات التابلت 2024</title>
            <meta
              name="description"
              content="Scanner data from Google Sheets"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <section className={styles.header}>
            <h1>بيانات التابلت 2024</h1>
          </section>

          {/* Data Table Section */}
          <section className={styles.content}>
            {error && <p>{error}</p>}
            {dataRows.length > 0 ? (
              <div>
                <button className={styles.button} onClick={handlePrint}>
                  طباعة الجدول
                </button>
                <div ref={tableRef}>
                  <table className={styles2.table}>
                    <thead>
                      <tr>
                        <th>التاريخ</th>
                        <th>اسم الطالبة</th>
                        <th>الفصل</th>
                        <th> الأيمي</th>
                        <th>السيريال</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, index) => (
                        <tr key={index}>
                          <td>{row.Date}</td>
                          <td>{row.Name}</td>
                          <td>{row.Classroom}</td>
                          <td>{row.IMEI}</td>
                          <td>{row.Serial}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              !error && <p>No records available.</p>
            )}
          </section>

          {/* Footer Section */}
          <footer className={styles.footer}>
            <p>&copy; 2024 Your School</p>
            <p>Developed by Ashraf</p>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
