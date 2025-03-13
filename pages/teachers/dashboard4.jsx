// pages/dashboard.js
'use client';
import Link from 'next/link';
import React from 'react';
import {
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Dashboard() {
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Attendance',
        data: [85, 90, 88, 92, 94],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
    ],
  };

  const attendanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200,200,200,0.2)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans direction-rtl text-right">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-cyan-500 to-blue-600 text-white">
        <div className="p-6 font-bold text-xl text-center">
           فاطمة الزهراء الثانوية
        </div>
        <nav className="mt-6 ">
          <ul>
            <Link href="/home">
              {' '}
              <li className="p-4 bg-blue-700 rounded-lg m-2 flex items-center justify-center gap-3 hover:bg-blue-800 transition font-bold text-center">
                {' '}
                <FaHome className="text-xl" /> <span>الرئيسية</span>{' '}
              </li>{' '}
            </Link>{' '}
            {/* Add more navigation items here */}
            <li className="p-4 m-2 flex items-center gap-3 hover:bg-blue-600 rounded-lg transition">
              <FaUsers /> الطلاب
            </li>
            <li className="p-4 m-2 flex items-center gap-3 hover:bg-blue-600 rounded-lg transition">
              <FaChalkboardTeacher /> المعلمين
            </li>
            <li className="p-4 m-2 flex items-center gap-3 hover:bg-blue-600 rounded-lg transition">
              <FaCalendarAlt /> التقويم
            </li>
            <li className="p-4 m-2 flex items-center gap-3 hover:bg-blue-600 rounded-lg transition">
              <FaChartBar /> التحليلات
            </li>
            <li className="p-4 m-2 flex items-center gap-3 hover:bg-blue-600 rounded-lg transition text-bold-500">
              <FaCog /> الاعدادات
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            واجهة بيانات المدرسة
          </h1>
          <p className="text-gray-500">مرحبا بعودتك ، مسئول المدرسة</p>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-4 gap-6 my-8">
          <div className="bg-gradient-gray-white shadow-md p-6 rounded-lg border-t-4 border-cyan-500">
            <h2 className="text-white">Total Students</h2>
            <p className="text-3xl font-bold">2,856</p>
            <p className="text-red text-bold">+12% from last month</p>
          </div>
          <div className="bg-gradient-gray-white shadow-md p-6 rounded-lg border-t-4 border-cyan-500">
            <h2 className="text-white">Total Teachers</h2>
            <p className="text-3xl font-bold">145</p>
            <p className="text-green-500">+4% from last month</p>
          </div>
          <div className="bg-gradient-gray-white shadow-md p-6 rounded-lg border-t-4 border-cyan-500">
            <h2 className="text-white">Attendance Rate</h2>
            <p className="text-3xl font-bold">94%</p>
            <p className="text-green-500">+2% from last month</p>
          </div>
          <div className="bg-gradient-gray-white shadow-md p-6 rounded-lg border-t-4 border-cyan-500">
            <h2 className="text-white">Upcoming Events</h2>
            <p className="text-3xl font-bold">12</p>
            <p className="text-gray-400">0 from last month</p>
          </div>
        </section>

        {/* Charts and Lists */}
        <section className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-gray-600 mb-4">Weekly Attendance</h2>
            <Line data={attendanceData} options={attendanceOptions} />
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-gray-600 mb-4">Recent Activities</h2>
            <ul>
              <li className="mb-2">
                Parent-Teacher Meeting -{' '}
                <span className="text-gray-500">2 hours ago</span>
              </li>
              <li className="mb-2">
                New Student Registration -{' '}
                <span className="text-gray-500">4 hours ago</span>
              </li>
              <li>Sports Day</li>
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-gray-600 mb-4">Recent Assignments</h2>
            <ul>
              <li className="mb-4">
                <div className="flex justify-between">
                  <span>Quadratic Equations</span>
                  <span className="text-red-500">high</span>
                </div>
                <p className="text-gray-500">Mathematics - Due: 2024-03-25</p>
              </li>
              <li>
                <div className="flex justify-between">
                  <span>Newton&apos;s Laws</span>
                  <span className="text-yellow-500">medium</span>
                </div>
                <p className="text-gray-500">Physics - Due: 2024-03-23</p>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
