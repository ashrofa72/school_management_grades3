import React from 'react';
import styles from '../../styles/report.module.css';

export default function Report() {
  return (
    <div className={styles.reportContainer}>
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
        <h3>بيانات الموظف</h3>
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
        <h3>مدة الإجازة المطلوبة</h3>
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

      <section className={styles.tableSection}>
        <h3>بيان برصيد إجازات الموظف</h3>
        <table className={styles.reportTable}>
          <thead>
            <tr>
              <th>رصيد الإجازات السنة الحالية</th>
              <th>رصيد السنوات السابقة المرحل</th>
              <th>الرصيد الذي تكون قبل العمل بقانون الخدمة المدنية</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> ---</td>
              <td> ----</td>
              <td>---- </td>
            </tr>
          </tbody>
        </table>
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

      <section className={styles.fieldRow}>
        <div>
          <span>توقيع الموظف:</span>
          <span className={styles.underline}></span>
        </div>
        <div>
          <span>الرئيس المباشر:</span>
          <span className={styles.underline}></span>
        </div>
      </section>
    </div>
  );
}
