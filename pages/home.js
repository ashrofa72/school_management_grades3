import React from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthContext();

  const cardData = [
    { title: "المعلمون", description: "إدارة بيانات المعلمين وتفاصيلهم التعليمية.", path: "/teachers", color: "from-blue-500 to-indigo-600" },
    { title: "الطلاب", description: "عرض وتحديث معلومات الطلاب المسجلين في المدرسة.", path: "/students/page", color: "from-green-500 to-teal-500" },
    { title: "الرئيسية", description: "الصفحة الرئيسية للموقع والأخبار والإشعارات.", path: "/main/page", color: "from-purple-500 to-pink-500" },
    { title: "إعلانات", description: "آخر الإعلانات والملاحظات المدرسية.", path: "/", color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <main className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 dark:from-indigo-400 dark:to-pink-300">
            مدرسة فاطمة الزهراء الثانوية للبنات
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            نظام إدارة المعلومات المدرسية
          </p>

          {/* Illustration Image */}
          <div className="mt-8 flex justify-center">
            <img
              src="/images/undraw_online-test_20lm.png"
              alt="School Management Illustration"
              className="w-full max-w-md rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              onClick={() => router.push(card.path)}
              className="group cursor-pointer backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center">
                &rarr; {card.title}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {card.description}
              </p>
              <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${card.color}`}></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}