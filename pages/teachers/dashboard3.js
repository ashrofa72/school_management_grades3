import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import styles from '../../styles/Dashboard.module.css';

// Register required elements
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const invitedLessonsData = {
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#4e73df', '#f8f9fc'],
      },
    ],
  };

  const completedTaskData = {
    datasets: [
      {
        data: [8, 4],
        backgroundColor: ['#1cc88a', '#f8f9fc'],
      },
    ],
  };

  const productivityData = {
    labels: ['12', '13', '14', '15', '16', '17', '18'],
    datasets: [
      {
        label: 'Productivity',
        data: [3, 2, 2, 4, 5, 3, 4],
        fill: false,
        backgroundColor: '#4e73df',
        borderColor: '#4e73df',
      },
    ],
  };

  const skillsSuccessData = {
    datasets: [
      {
        data: [22, 10, 68],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
      },
    ],
    labels: [
      'AI Game Programming',
      'Virtual Reality Art',
      'Intellectual Sports',
    ],
  };

  const timeTrackingData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Hours',
        data: [5, 6, 8, 7, 6, 5, 6],
        backgroundColor: '#4e73df',
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <div className={styles.dashboard}>
        <div className={styles.sidebar}>
          <div className={styles.profile}>
            <img
              src="/images/download.jpg"
              alt="Profile"
              className={styles.profilePic}
            />
            <h2>Prog/ Ashraf Kamel</h2>
          </div>
          <ul className={styles.menu}>
            <li>
              <Link href="/home">Home</Link>
            </li>
            <li>
              <Link href="/students/page">Classrooms</Link>
            </li>
            <li>
              <Link href="/students/first-year/page">Frst Classrooms</Link>
            </li>
            <li>
              <Link href="/students/second-year/page">Second Classrooms</Link>
            </li>
            <li>
              <Link href="/students/third-year/page">Third Classrooms</Link>
            </li>
            <li>
              <Link href="/teachers">Teachers </Link>
            </li>
          </ul>
          <div className={styles.promo}>
            <img
              src="/images/undraw_social-notifications_mzoe.png"
              alt="Promo"
            />
            <button>Get now</button>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.header}>
            <input type="text" placeholder="Find mentor or course" />
            <button className={styles.settingsBtn}>Settings</button>
          </div>
          <div className={styles.content}>
            <div className={styles.card}>
              <h3>Invited Lessons</h3>
              <Doughnut data={invitedLessonsData} />
            </div>
            <div className={styles.card}>
              <h3>Completed Task</h3>
              <Doughnut data={completedTaskData} />
            </div>
            <div className={styles.card}>
              <h3>My Productivity</h3>
              <Line data={productivityData} />
            </div>
            <div className={styles.card}>
              <h3>Skills Success</h3>
              <Doughnut data={skillsSuccessData} />
            </div>
            <div className={styles.card}>
              <h3>Appointments</h3>
              <ul className={styles.appointmentsList}>
                <li>
                  <img
                    src="/images/download.jpg"
                    alt="Profile"
                    className={styles.profilePic}
                  />
                  <span>Video Call with John</span>
                  <span>15:00</span>
                </li>
                <li>
                  <img
                    src="/images/download.jpg"
                    alt="Profile"
                    className={styles.profilePic}
                  />
                  <span>Meeting with Jane</span>
                  <span>16:00</span>
                </li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Time Tracking</h3>
              <Bar data={timeTrackingData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
