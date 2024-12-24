import React from 'react';
import styles from '../../styles/EvaluationTable.module.css';

const EvaluationTable = () => {
  return (
    <div className={styles.container}>
      <h1>بيان تقييم طالب للفصل الدراسي الأول 2024-2025</h1>
      <h2>
        الصف الثاني الثانوي العام (الشعبة العلمية) طبقاَ للقرار الوزاري 138 لسنة
        2024
      </h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.alignRight}>اسم الطالب:</th>
            <th className={styles.alignLeft}>رقم الجلوس:</th>
          </tr>
          <tr>
            <th>المادة</th>
            <th>اللغة العربية</th>
            <th>اللغة الأجنبية الأولى</th>
            <th>الرياضيات</th>
            <th>الفيزياء</th>
            <th>الكيمياء</th>
            <th>الأحياء</th>
            <th>إجمالي الدرجات للفصل الدراسي الأول</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>النهاية العظمى</td>
            <td>80</td>
            <td>60</td>
            <td>60</td>
            <td>60</td>
            <td>60</td>
            <td>60</td>
            <td>380</td>
          </tr>
          <tr>
            <td>النهاية الصغرى</td>
            <td>40</td>
            <td>30</td>
            <td>30</td>
            <td>30</td>
            <td>30</td>
            <td>30</td>
            <td>190</td>
          </tr>
          <tr>
            <td>التقييم الأسبوعي 15%</td>
            <td>-----</td>
            <td>-----</td>
            <td>-----</td>
            <td>-----</td>
            <td>-----</td>
            <td>-----</td>
            <td></td>
          </tr>
          <tr>
            <td>كشكول الحصة والواجب 15%</td>
            <td>-----</td>
            <td>-----</td>
            <td>-----</td>
            <td>-----</td>
            <td>-----</td>
            <td>-----</td>
            <td></td>
          </tr>
          <tr>
            <td>السلوك والمواظبة 10%</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td></td>
          </tr>
          <tr>
            <td>درجة اختبار الشهري 30%</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td></td>
          </tr>
          <tr>
            <td>اختبار الفصل الدراسي الأول 30%</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td>----</td>
            <td></td>
          </tr>
          <tr>
            <td> المجموع الكلي للمادة 100%</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <p>ملحوظة: عدد أيام غياب الطالب خلال الفصل الدراسي الأول</p>
      <p>كتب / أملاه / رئيس لجنة النظام والمراقبة / يعتمد مدير المدرسة</p>
    </div>
  );
};

export default EvaluationTable;
