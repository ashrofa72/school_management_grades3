import React from 'react';

const StudentEvaluationTable = () => {
  return (
    <div className="overflow-x-auto" dir="rtl">
      <header>
        <p>
          محافظة قنا
          <br />
          مديرية التربية والتعليم بقنا
          <br />
          إدارة قنا التعليمية
          <br />
          مدرسة فاطمة الزهراء الثانوية للبنات
        </p>
      </header>
      <div>
        <span className="p-5">اسم الطالب</span>
        <span>.....................</span>
      </div>
      <table className="border-collapse border border-black-300 w-full text-center">
        <thead>
          <tr>
            <th className="border border-black-300 p-2">المادة</th>
            <th colSpan="8" className="border border-gray-300 p-2">
              أولا المواد التي تدخل للمجموع الكلي
            </th>
            <th colSpan="4" className="border border-gray-300 p-2">
              ثانياَ المواد التي لا تدخل للمجموع الكلي
            </th>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2">الوصف</th>
            <th className="border border-gray-300 p-2">اللغة العربية</th>
            <th className="border border-gray-300 p-2">
              اللغة الأجنبية الأولى
            </th>
            <th className="border border-gray-300 p-2">الرياضيات</th>
            <th className="border border-gray-300 p-2">الفيزياء</th>
            <th className="border border-gray-300 p-2">الكيمياء</th>
            <th className="border border-gray-300 p-2">الأحياء</th>
            <th className="border border-gray-300 p-2">إجمالي الدرجات</th>
            <th className="border border-gray-300 p-2">...</th>
            <th className="border border-gray-300 p-2">التربية الدينية</th>
            <th className="border border-gray-300 p-2">التربية الوطنية</th>
            <th className="border border-gray-300 p-2">التربية المهنية</th>
          </tr>
        </thead>
        <tbody>
          {/* First Row */}
          <tr>
            <td className="border border-gray-300 p-2">النهاية العظمى</td>
            <td className="border border-gray-300 p-2">80</td>
            <td className="border border-gray-300 p-2">60</td>
            <td className="border border-gray-300 p-2">60</td>
            <td className="border border-gray-300 p-2">60</td>
            <td className="border border-gray-300 p-2">60</td>
            <td className="border border-gray-300 p-2">60</td>
            <td className="border border-gray-300 p-2">380</td>
            <td className="border border-gray-300 p-2">...</td>
            <td className="border border-gray-300 p-2">40</td>
            <td className="border border-gray-300 p-2">10</td>
            <td className="border border-gray-300 p-2">20</td>
          </tr>
          {/* Second Row */}
          <tr>
            <td className="border border-gray-300 p-2">النهاية الصغرى</td>
            <td className="border border-gray-300 p-2">40</td>
            <td className="border border-gray-300 p-2">30</td>
            <td className="border border-gray-300 p-2">30</td>
            <td className="border border-gray-300 p-2">30</td>
            <td className="border border-gray-300 p-2">30</td>
            <td className="border border-gray-300 p-2">30</td>
            <td className="border border-gray-300 p-2">190</td>
            <td className="border border-gray-300 p-2">...</td>
            <td className="border border-gray-300 p-2">20</td>
            <td className="border border-gray-300 p-2">5</td>
            <td className="border border-gray-300 p-2">10</td>
          </tr>
          {/* Percentage Rows */}
          <tr>
            <td className="border border-gray-300 p-2" dir="ltr">
              %15 التقييم الأسبوعي
            </td>
            <td colSpan="12" className="border border-gray-300 p-2">
              -
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2" dir="ltr">
              %10 تكوين الصف والواجب
            </td>
            <td colSpan="12" className="border border-gray-300 p-2">
              -
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2" dir="ltr">
              %10 السلوك والمواظبة
            </td>
            <td colSpan="12" className="border border-gray-300 p-2">
              -
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2" dir="ltr">
              %20 درجة اختبار الشهرين
            </td>
            <td colSpan="12" className="border border-gray-300 p-2">
              -
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2" dir="ltr">
              %30 اختبار الفصل الدراسي الأول
            </td>
            <td colSpan="12" className="border border-gray-300 p-2">
              -
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2" dir="ltr">
              - المجموع الكلي للمادة
            </td>
            <td colSpan="12" className="border border-gray-300 p-2">
              -
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentEvaluationTable;
