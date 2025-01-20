'use client';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Head from 'next/head';
import Navbar from '../../../components/navbar';
import styles from '../../../styles/SecondYear.module.css';
import styles2 from '../../../styles/Table.module.css';
import { useState, useEffect, useRef } from 'react';

export default function SecondYear() {
  const [selectedRoom, setSelectedRoom] = useState('2-1');
  const [selectedSubject, setSelectedSubject] = useState('Biology');
  const [selectedMonth, setSelectedMonth] = useState('October'); // State for month
  const [dataRows, setDataRows] = useState([]);
  const [error, setError] = useState(null);
  const tableRef = useRef(); // Reference to the table for printing

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(
          `Fetching data for Room: ${selectedRoom}, Subject: ${selectedSubject}, Month: ${selectedMonth}`
        );
        const response = await fetch(
          `/api/sheets?Room=${selectedRoom}&Subject=${selectedSubject}&Month=${selectedMonth}`
        );

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
  }, [selectedRoom, selectedSubject, selectedMonth]);

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedSubject} كشف درجات</title>
          <style>
            /* Custom print styles */
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
          <h1>المادة: ${selectedSubject} | الشهر: ${selectedMonth}</h1>
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
            <title>طلاب الصف الثاني</title>
            <meta
              name="description"
              content="Information about second year students"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <section className={styles.header}>
            <h1>طلاب الصف الثاني</h1>
          </section>

          {/* Dropdown Section */}
          <section className={styles.dropdown}>
            <div>
              <label htmlFor="rooms">اختار الصف :</label>
              <select
                id="rooms"
                value={selectedRoom}
                onChange={handleRoomChange}
              >
                <option value="2-1">2-1</option>
                <option value="2-2">2-2</option>
                <option value="2-3">2-3</option>
                <option value="2-4">2-4</option>
                <option value="2-5">2-5</option>
                <option value="2-6">2-6</option>
                <option value="2-7">2-7</option>
              </select>
            </div>
            <div>
              <label htmlFor="subjects">اختار المادة:</label>
              <select
                id="subjects"
                value={selectedSubject}
                onChange={handleSubjectChange}
              >
                <option value="Biology">Biology</option>
                <option value="Maths 1 Science">Maths 1 Science</option>
                <option value="Arabic">Arabic</option>
                <option value="English First Language">
                  English First Language
                </option>
                <option value="Maths 1 Arts">Maths 1 Arts</option>
                <option value="Maths 2 ">Maths 2 </option>
                <option value="Chemistry">Chemistry</option>
                <option value="French Second Language">
                  French Second Language
                </option>
                <option value="Geography">Geography</option>
                <option value="German Second Language">
                  German Second Language
                </option>
                <option value="History">History</option>
                <option value="Physics">Physics</option>
                <option value="Psychology">Psychology</option>
                <option value="Spanish Second Language">
                  Spanish Second Language
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="months">اختار الشهر:</label>
              <select
                id="months"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="Term 1">Term 1</option>
              </select>
            </div>
          </section>

          {/* Data Table Section */}
          <section className={styles.content}>
            {error && <p>{error}</p>}
            {dataRows.length > 0 ? (
              <div>
                <button
                  className={`${styles2.printButton}`}
                  onClick={handlePrint}
                >
                  طباعة الجدول
                </button>
                <div ref={tableRef}>
                  <table className={styles2.table}>
                    <thead>
                      <tr>
                        <th>اسم الطالبة</th>
                        <th>الصف</th>
                        <th>المادة</th>
                        <th>كود الطالب</th>
                        <th>التاريخ</th>
                        <th>الدرجة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, index) => (
                        <tr key={index}>
                          <td>{row.FullName}</td>
                          <td>{row.Room}</td>
                          <td>{row.Subject}</td>
                          <td>{row.SISUserID}</td>
                          <td>{row.StartDate}</td>
                          <td>{row.Total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              !error && <p>لا يوجد سجلات موجودة للصف والمادة والشهر المحددين</p>
            )}
          </section>

          {/* Footer Section */}
          <footer className={styles.footer}>
            <p>&copy; 2024 مدرسة فاطمة الزهراء الثانوية للبنات</p>
            <p>Developed by Ashraf Eltayb</p>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
