import React, { useRef, useEffect, useState } from 'react';
import styles from '../../styles/holidayPremit.module.css';
import DatePicker from 'react-datepicker';
import { useReactToPrint } from 'react-to-print';
import 'react-datepicker/dist/react-datepicker.css';
import domToPdf from 'dom-to-pdf';

import Navbar from '../../components/navbar';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/router';

export default function Report() {
  //const reportRef = useRef();
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({
    Name: '',
    Position: '',
    Level: '',
    Birth_Date: '',
    Appointment_Date: '',
    Starting_Date: '',
    Address: '',
    Phone: '',
  });

  useEffect(() => {
    async function fetchEmployees() {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);

      // Set the first employee as the default selected employee
      if (data.length > 0) {
        setSelectedEmployee(data[0]);
      }
    }
    fetchEmployees();
  }, []);

  const handleEmployeeChange = (e) => {
    const selected = employees.find((emp) => emp.Name === e.target.value);
    setSelectedEmployee(
      selected || {
        Name: '',
        Position: '',
        Birth_Date: '',
        Appointment_Date: '',
        Starting_Date: '',
        Address: '',
        Phone: '',
      }
    );
  };

  const reportRef = useRef(null);

  const handleDownloadPDF = () => {
    const input = reportRef.current;

    if (!input) {
      console.error('Report content not found.');
      return;
    }

    // Replace <select> elements with their selected values
    const selectElements = input.querySelectorAll('select');
    const dateElements = input.querySelectorAll('input[type="date"]');
    const originalContent = [];

    // Replace <select> with <span>
    selectElements.forEach((select) => {
      const selectedValue = select.options[select.selectedIndex]?.text || '';
      const span = document.createElement('span');
      span.textContent = selectedValue;
      span.style.fontSize = window.getComputedStyle(select).fontSize; // Match font size
      span.style.fontFamily = window.getComputedStyle(select).fontFamily; // Match font family
      originalContent.push({
        element: select,
        parent: select.parentNode,
        span,
      });
      select.parentNode.replaceChild(span, select);
    });

    // Replace <input type="date"> with <span>
    dateElements.forEach((dateInput) => {
      const dateValue = dateInput.value || ''; // Get the date value
      const span = document.createElement('span');
      span.textContent = dateValue;
      span.style.fontSize = window.getComputedStyle(dateInput).fontSize; // Match font size
      span.style.fontFamily = window.getComputedStyle(dateInput).fontFamily; // Match font family
      originalContent.push({
        element: dateInput,
        parent: dateInput.parentNode,
        span,
      });
      dateInput.parentNode.replaceChild(span, dateInput);
    });

    // Generate the PDF
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm for A4
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm for A4

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Scale the canvas image to fit within the PDF dimensions
      const scale = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      const imgWidth = canvasWidth * scale;
      const imgHeight = canvasHeight * scale;

      // Calculate margins to center the image
      const xOffset = (pdfWidth - imgWidth) / 2; // Center horizontally
      const yOffset = (pdfHeight - imgHeight) / 2; // Center vertically

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      pdf.save('طلب اجازة اعتيادي.pdf');

      // Restore the original elements
      originalContent.forEach(({ element, parent, span }) => {
        parent.replaceChild(element, span);
      });
    });
  };

  return (
    <div>
      <Navbar />
      <div className={styles.reportContainer} ref={reportRef}>
        <header className={styles.header}>
          <p>
            محافظة قنا
            <br />
            مديرية التربية والتعليم بقنا
            <br />
            إدارة قنا التعليمية
            <br />
            الموارد البشرية - إجازات
            <br />
            مدرسة فاطمة الزهراء الثانوية للبنات
          </p>
          <h2>طلب إجازة اعتيادية</h2>
        </header>

        <section className={styles.employeeDetails}>
          <div className={styles.tableSection}>
            <h3>بيانات الموظف</h3>
          </div>
          <div className={styles.fieldRow}>
            <span>الاسم:</span>
            <span className={styles.select}>
              {selectedEmployee.Name || '---'}
            </span>
            <span>الوظيفة:</span>
            <span className={styles.select}>
              {selectedEmployee.Position || '---'}
            </span>
            <span>المستوى الوظيفي:</span>
            <span className={styles.select}>
              {selectedEmployee.Level || '---'}
            </span>
          </div>
          <div className={styles.fieldRow}>
            <span>تاريخ الميلاد:</span>
            <span className={styles.select}>
              {selectedEmployee.Birth_Date || '---'}
            </span>
            <span>تاريخ التعيين:</span>
            <span className={styles.select}>
              {selectedEmployee.Appointment_Date || '---'}
            </span>
            <span>تاريخ الأستلام:</span>
            <span className={styles.select}>
              {selectedEmployee.Starting_Date || '---'}
            </span>
          </div>
          <div className={styles.fieldRow}>
            <span>العنوان اثناء الاجارة</span>
            <span className={styles.select}>
              {selectedEmployee.Address || '---'}
            </span>
            <span> هاتف</span>
            <span className={styles.select}>
              {selectedEmployee.Phone || '---'}
            </span>
          </div>
        </section>

        <section className={styles.leaveDetails}>
          <div className={styles.tableSection}>
            <h3>مدة الإجازة المطلوبة</h3>
          </div>
          <div className={styles.fieldRow}>
            <span>عدد الأيام</span>
            <select className={styles.select}>
              <option>يوم واحد</option>
              <option>يومان </option>
              <option>ثلاثة أيام </option>
              <option>أربعة أيام </option>
              <option>خمسة أيام </option>
              <option>ستة أيام </option>
            </select>

            <span>من:</span>
            <input type="date" className={styles.input} />
            <span>إلى:</span>
            <input type="date" className={styles.input} />
            <span>تحريرا في</span>
            <input type="date" className={styles.input} />
          </div>
          <div className={styles.fieldRow}>
            <span> توقيع طالب الأجازة</span>
            <span className={styles.underline}></span>
          </div>
          <div className={styles.fieldRow}>
            <span>اسم الموظف القائم بالعمل خلال الأجازة</span>
            <span className={styles.underline}></span>
            <span>التوقيع</span>
            <span className={styles.underline}></span>
          </div>
        </section>

        <section>
          <div className={styles.tableSection}>
            <h3>بيان برصيد إجازات الموظف</h3>
          </div>
          <div>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th colSpan="3" style={{ padding: '8px' }}>
                    رصيد الإجازات عن السنة الحالية
                  </th>
                  <th colSpan="3" style={{ padding: '8px' }}>
                    رصيد السنوات السابقة المرحل
                  </th>
                  <th rowSpan="2" style={{ padding: '8px' }}>
                    الرصيد الذي تكون قبل العمل بقانون الخدمة المدنية
                  </th>
                </tr>
                <tr>
                  <th style={{ padding: '8px' }}>عددها</th>
                  <th style={{ padding: '8px' }}>ما رخص به</th>
                  <th style={{ padding: '8px' }}>المتبقي</th>
                  <th style={{ padding: '8px' }}>السنة الأولى</th>
                  <th style={{ padding: '8px' }}> السنه الثانية</th>
                  <th style={{ padding: '8px' }}>السنة الثالثة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px' }}>---</td>
                  <td style={{ padding: '8px' }}>---</td>
                  <td style={{ padding: '8px' }}>---</td>
                  <td style={{ padding: '8px' }}>---</td>
                  <td style={{ padding: '8px' }}>---</td>
                  <td style={{ padding: '8px' }}>---</td>
                  <td style={{ padding: '8px' }}>---</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <div className={styles.fieldRow}>
            <span>يعتمد مدير إدارة الموارد البشرية</span>
            <span className={styles.underline}></span>
          </div>
        </section>
        <section className={styles.tableSection}>
          <h3> رأي السلطة المختصة</h3>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>رأي الرئيس المباشر</th>
                <th>اعتماد الرئيس المختص</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> ---</td>
                <td> ----</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <div className={styles.tableSection}>
            <h3> إقرار القيام</h3>
          </div>
          <div className={styles.fieldRow}>
            <span>اقر أنا/</span>
            <span className={styles.select}>
              {selectedEmployee.Name || '---'}
            </span>
            <span>بأنني أديت أعمالي الوظيفية حتى يوم </span>
            <select className={styles.select}>
              <option> السبت</option>
              <option> الأحد</option>
              <option> الأثنين </option>
              <option> الثلاثاء </option>
              <option> الأربعاء </option>
              <option> الخميس </option>
            </select>
            <span>الموافق</span>
            <input type="date" className={styles.input} />
          </div>
          <div className={styles.fieldRow}>
            <span>
              وهو اخر يوم من ايام العمل الرسمية لابتداء الاجازة الاعتيادية
            </span>
          </div>
          <div className={styles.tableSection}>
            <h3>القائم بالاجازة الإعتيادية</h3>
            <div className={styles.fieldRow}>
              <span>الأسم</span>
              <span className={styles.select}>
                {selectedEmployee.Name || '---'}
              </span>
              <span>الرئيس المباشر</span>
              <span className={styles.underline}></span>
            </div>
            <div className={styles.fieldRow}>
              <span>يعتمد مدير عام الأدارة</span>
              <span className={styles.underline}></span>
            </div>
          </div>
        </section>
        <section>
          <div className={styles.tableSection}>
            <h3> إقرار العودة</h3>
          </div>
          <div className={styles.fieldRow}>
            <span>اقر أنا/</span>
            <span className={styles.select}>
              {selectedEmployee.Name || '---'}
            </span>
            <span> وأعمل بوظيفة </span>
            <span className={styles.select}>
              {selectedEmployee.Position || '---'}
            </span>
          </div>
          <div className={styles.fieldRow}>
            <span>انني استأنفت العمل في يوم</span>
            <select className={styles.select}>
              <option> السبت</option>
              <option> الأحد</option>
              <option> الأثنين </option>
              <option> الثلاثاء </option>
              <option> الأربعاء </option>
              <option> الخميس </option>
            </select>
            <span>الموافق </span>
            <input type="date" className={styles.input} />
            <span>وهو اليوم الأول من ايام العمل الرسمية </span>
          </div>
          <div className={styles.fieldRow}>
            <span>
              {' '}
              بعد الإنتهاء من الأجازة الإعتيادية المرخص لي بها والتي بدأت في{' '}
            </span>
            <input type="date" className={styles.input} />
            <span>وانتهت في </span>
            <input type="date" className={styles.input} />
          </div>
          <div className={styles.tableSection}>
            <h3>وهذا إقرار مني بذلك</h3>
          </div>
          <div>
            <div className={styles.fieldRow}>
              <span>توقيع الموظف</span>
              <span className={styles.underline}></span>
              <span>الرئيس المباشر</span>
              <span className={styles.underline}></span>
            </div>
          </div>
        </section>
      </div>
      {/* Print Button */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          //onClick={handleDownloadPDF}
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: '#008CBA',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          طباعة طلب الأجازة
        </button>
      </div>
    </div>
  );
}
