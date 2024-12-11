'use client';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Head from 'next/head';
import Navbar from '../../../components/navbar';
import styles2 from '../../../styles/Table.module.css';
import styles from '../../../styles/tabletData.module.css';
import { useState, useEffect, useRef } from 'react';

export default function ScannerDataPage() {
  const [dataRows, setDataRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [error, setError] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const tableRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/scannerdata');
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        setDataRows(data);

        // Extract unique classrooms
        const uniqueClassrooms = [...new Set(data.map((row) => row.Classroom))];
        setClassrooms(uniqueClassrooms.sort());
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Filter students based on selected classroom
    if (selectedClassroom) {
      const classroomStudents = dataRows
        .filter((row) => row.Classroom === selectedClassroom)
        .map((row) => row.Name);
      setStudents([...new Set(classroomStudents)].sort());
    } else {
      setStudents([]);
    }
    setSelectedStudent('');
  }, [selectedClassroom, dataRows]);

  useEffect(() => {
    // Filter rows based on selected classroom and student
    const filtered = dataRows.filter(
      (row) =>
        (!selectedClassroom || row.Classroom === selectedClassroom) &&
        (!selectedStudent || row.Name === selectedStudent)
    );
    setFilteredRows(filtered);
  }, [selectedClassroom, selectedStudent, dataRows]);

  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>بيانات تسجيل التابلت2024</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@700&family=Marhey:wght@300..700&display=swap');
            body {
              font-family: Marhey, sans-serif;
            }
            h1 {
              direction: rtl;
              font-size: 15px;
              text-align: right;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              direction: rtl;
              font-family: Marhey, sans-serif;
              font-size: 10px;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1> 2024 بيانات التابلت</h1>
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

          <section className={styles.content}>
            {error && <p>{error}</p>}

            <div className={styles.filters}>
              <select
                className={styles.dropdown}
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
              >
                <option value="">اختر الفصل</option>
                {classrooms.map((classroom) => (
                  <option key={classroom} value={classroom}>
                    {classroom}
                  </option>
                ))}
              </select>

              <select
                className={styles.dropdown}
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedClassroom}
              >
                <option value="">اختر اسم الطالب</option>
                {students.map((student) => (
                  <option key={student} value={student}>
                    {student}
                  </option>
                ))}
              </select>
            </div>

            {filteredRows.length > 0 ? (
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
                      {filteredRows.map((row, index) => (
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

          <footer className={styles.footer}>
            <p>&copy; 2024 مدرسة فاطمة الزهراء الثانوية للبنات</p>
            <p>Developed by Ashraf Eltayb</p>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
