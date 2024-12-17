import React, { useRef, useEffect } from 'react';
import styles from '../../styles/holidayPremit.module.css';
import Navbar from '../../components/navbar';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/router';

export default function Report() {
  const reportRef = useRef();
  const router = useRouter();

  const handleDownloadPDF = () => {
    const input = reportRef.current;

    // Capture the content and generate the PDF
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('طلب اجازة اعتيادي.pdf');
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
            <span className={styles.underline}></span>
            <span>الوظيفة:</span>
            <span className={styles.underline}></span>
            <span>المستوى الوظيفي:</span>
            <span className={styles.underline}></span>
          </div>
          <div className={styles.fieldRow}>
            <span>تاريخ الميلاد:</span>
            <span className={styles.underline}></span>
            <span>تاريخ التعيين:</span>
            <span className={styles.underline}></span>
            <span>تاريخ استلام العمل:</span>
            <span className={styles.underline}></span>
          </div>
          <div className={styles.fieldRow}>
            <span>العنوان اثناء الاجارة</span>
            <span className={styles.underline}></span>
            <span> هاتف</span>
            <span className={styles.underline}></span>
          </div>
        </section>

        <section className={styles.leaveDetails}>
          <div className={styles.tableSection}>
            <h3>مدة الإجازة المطلوبة</h3>
          </div>
          <div className={styles.fieldRow}>
            <span>عدد الأيام</span>
            <span className={styles.underline}></span>
            <span>من:</span>
            <span className={styles.underline}></span>
            <span>إلى:</span>
            <span className={styles.underline}></span>
            <span>تحريرا في</span>
            <span className={styles.underline}></span>
          </div>
          <div className={styles.fieldRow}>
            <span> توقيع طالب الأجازة</span>
            <span className={styles.underline}></span>
          </div>
          <div className={styles.fieldRow}>
            <span>اسم الموظف القائم بالعمل خلال الأجازة </span>
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
            <span className={styles.underline}></span>
            <span>بأنني أديت أعمالي الوظيفية حتى يوم </span>
            <span className={styles.underline}></span>
            <span>الموافق</span>
            <span className={styles.underline}></span>
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
              <span className={styles.underline}></span>
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
            <span className={styles.underline}></span>
            <span> وأعمل بوظيفة </span>
            <span className={styles.underline}></span>
          </div>
          <div className={styles.fieldRow}>
            <span>انني استأنفت العمل في يوم</span>
            <span className={styles.underline}></span>
            <span>الموافق </span>
            <span className={styles.underline}></span>
            <span>وهو اليوم الأول من ايام العمل الرسمية </span>
          </div>
          <div className={styles.fieldRow}>
            <span>
              {' '}
              بعد الإنتهاء من الأجازة الإعتيادية المرخص لي بها والتي بدأت في{' '}
            </span>
            <span className={styles.underline}></span>
            <span>وانتهت في </span>
            <span className={styles.underline}></span>
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
          Download as PDF
        </button>
      </div>
    </div>
  );
}
