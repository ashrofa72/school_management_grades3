import React, { useRef, useEffect, useState } from 'react';
import styles from '../../styles/holidayPremit.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAuth } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/router';

export default function Report({ email }) {
  const router = useRouter();
  const reportRef = useRef(null);

  const [userEmail, setUserEmail] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState({
    name: '',
    position: '',
    level: '',
    birth_date: '',
    appointment_date: '',
    starting_date: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserEmail(user.email);
      fetchEmployeeData(user.email);
    }
  }, []);

  const fetchEmployeeData = async (email) => {
    try {
      const response = await fetch(
        `/api/employees?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching employee data:', data.error);
      } else {
        setSelectedEmployee(data[0] || {}); // Assuming the data is an array
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // useEffect to fetch data when email changes
  useEffect(() => {
    if (email) {
      fetchEmployeeData(email); // Call the function when email is available
    }
  }, [email]); // Dependency array to re-run effect when email changes

  const handleDownloadPDF = async () => {
    const input = reportRef.current;
    if (!input) {
      console.error('Report content not found.');
      return;
    }

    // Replace <select> and <input type="date"> elements with their display values
    const originalElements = replaceDynamicElements(input);

    // Generate the PDF
    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scale = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      const imgWidth = canvasWidth * scale;
      const imgHeight = canvasHeight * scale;

      const xOffset = (pdfWidth - imgWidth) / 2;
      const yOffset = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      pdf.save('Holiday_Permit_Request.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      restoreDynamicElements(originalElements);
    }
  };

  const replaceDynamicElements = (container) => {
    const originalElements = [];
    const selectors = container.querySelectorAll('select, input[type="date"]');

    selectors.forEach((element) => {
      const span = document.createElement('span');
      span.textContent =
        element.value || element.options[element.selectedIndex]?.text || '---';
      span.style.cssText = window.getComputedStyle(element).cssText;

      originalElements.push({ element, parent: element.parentNode, span });
      element.parentNode.replaceChild(span, element);
    });

    return originalElements;
  };

  const restoreDynamicElements = (originalElements) => {
    originalElements.forEach(({ element, parent, span }) => {
      parent.replaceChild(element, span);
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
            <span className={styles.select['.span']}>
              {selectedEmployee.name || '---'}
            </span>
            <span>الوظيفة:</span>
            <span className={styles.select['.span']}>
              {selectedEmployee.position || '---'}
            </span>
            <span>المستوى الوظيفي:</span>
            <span className={styles.select['.span']}>
              {selectedEmployee.level || '---'}
            </span>
          </div>
          <div className={styles.fieldRow}>
            <span>تاريخ الميلاد:</span>
            <span className={styles.select['.span']}>
              {selectedEmployee.birth_date || '---'}
            </span>
            <span>تاريخ التعيين:</span>
            <span className={styles.select['.span']}>
              {selectedEmployee.appointment_date || '---'}
            </span>
            <span>تاريخ الأستلام:</span>
            <span className={styles.select['.span']}>
              {selectedEmployee.starting_date || '---'}
            </span>
          </div>
          <div className={styles.fieldRow}>
            <span>العنوان اثناء الاجارة</span>
            <span className={styles.select['.span']}>
              {selectedEmployee.address || '---'}
            </span>
            <span> هاتف</span>
            <span className={styles.select['.span']}>
              {selectedEmployee.phone || '---'}
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
            <span className={styles.select['.span']}>
              {selectedEmployee.name || '---'}
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
              <span className={styles.select['.span']}>
                {selectedEmployee.name || '---'}
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
            <span className={styles.select['.span']}>
              {selectedEmployee.name || '---'}
            </span>
            <span> وأعمل بوظيفة </span>
            <span className={styles.select['.span']}>
              {selectedEmployee.position || '---'}
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
