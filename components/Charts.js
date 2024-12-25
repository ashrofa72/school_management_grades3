import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Register the required components
ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export const DoughnutChart = ({ data }) => (
  <Doughnut
    data={{
      labels: ['Completed', 'Remaining'],
      datasets: [
        {
          data: [data.value, data.total - data.value],
          backgroundColor: ['#3f51b5', '#e0e0e0'],
        },
      ],
    }}
    options={{ responsive: true, maintainAspectRatio: false }}
  />
);

export const LineChart = ({ data }) => (
  <Line
    data={{
      labels: data.x,
      datasets: [
        {
          label: 'Productivity',
          data: data.y,
          fill: false,
          borderColor: '#3f51b5',
          tension: 0.4,
        },
      ],
    }}
    options={{ responsive: true, maintainAspectRatio: false }}
  />
);

export const BarChart = ({ data }) => (
  <Bar
    data={{
      labels: data.x,
      datasets: [
        {
          label: 'Time Tracking',
          data: data.y,
          backgroundColor: '#3f51b5',
        },
      ],
    }}
    options={{ responsive: true, maintainAspectRatio: false }}
  />
);
