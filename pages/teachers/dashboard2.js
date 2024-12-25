// components/Charts.js
import React from 'react';

import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

export const DoughnutChart = ({ data }) => <Doughnut data={data} />;

export const LineChart = ({ data }) => <Line data={data} />;

export const BarChart = ({ data }) => <Bar data={data} />;

// components/Layout.js

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';

const drawerWidth = 240;

export const Sidebar = () => (
  <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0 }}>
    <Toolbar />
    <List>
      {['Home', 'Calendar', 'Messages', 'Statistics', 'Payments'].map(
        (text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index === 0 && <HomeIcon />}
              {index === 1 && <CalendarTodayIcon />}
              {index === 2 && <MessageIcon />}
              {index === 3 && <AssessmentIcon />}
              {index === 4 && <PaymentIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        )
      )}
    </List>
  </Drawer>
);

export const Header = () => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography variant="h6" noWrap component="div">
        Dashboard
      </Typography>
    </Toolbar>
  </AppBar>
);

// pages/teachers/dashboard2.js

import { Box, Grid, Paper } from '@mui/material';

const Dashboard = () => {
  const doughnutData = {
    labels: ['Invited Lessons', 'Completed Tasks'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#FFCE56', '#36A2EB'],
      },
    ],
  };

  const lineData = {
    labels: ['12', '13', '14', '15', '16'],
    datasets: [
      {
        label: 'Productivity',
        data: [3, 2, 5, 4, 6],
        fill: false,
        borderColor: '#36A2EB',
      },
    ],
  };

  const barData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Time Tracking',
        data: [8, 9, 7, 6, 5, 10, 4],
        backgroundColor: '#FF6384',
      },
    ],
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Invited Lessons</Typography>
              <DoughnutChart data={doughnutData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">My Productivity</Typography>
              <LineChart data={lineData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Time Tracking</Typography>
              <BarChart data={barData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
