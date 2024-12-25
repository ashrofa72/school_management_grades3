// pages/index.js
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import Recharts with server-side rendering disabled
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), {
  ssr: false,
});
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), {
  ssr: false,
});
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), {
  ssr: false,
});

const Dashboard = () => {
  // Simulate client-specific rendering for charts
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure chart renders only after hydration
  }, []);

  const data = [
    { name: 'Green', value: 5, color: '#4caf50' },
    { name: 'Yellow', value: 10, color: '#ffeb3b' },
    { name: 'Red', value: 5, color: '#f44336' },
  ];

  const students = [
    { name: 'Sabine Klein', work: '33 / 36', score: 23, attention: 45 },
    { name: 'Dante Podenzana', work: '31 / 36', score: 53, attention: 6 },
    { name: 'Susan Chan', work: '27 / 36', score: 82, attention: 1 },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Overall Class Score */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overall Class Score</Typography>
              <Typography variant="h3" color="primary">
                68%
              </Typography>
              <LinearProgress variant="determinate" value={68} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Work Assigned */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Work Assigned</Typography>
              <Typography variant="h3" color="secondary">
                36
              </Typography>
              {isClient && (
                <PieChart width={150} height={150}>
                  <Pie
                    data={data}
                    cx={75}
                    cy={75}
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Alerts</Typography>
              <Grid container spacing={1}>
                {data.map((entry, index) => (
                  <Grid item xs={4} key={index}>
                    <Typography align="center">{entry.value}</Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: entry.color,
                        mx: 'auto',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Students Proficiency Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Students Proficiency
        </Typography>
        <Card>
          <CardContent>
            {/* Table Header */}
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography>Full Name</Typography>
              <Typography>Work Completed</Typography>
              <Typography>Average Score</Typography>
              <Typography>Needing Attention</Typography>
            </Box>

            {/* Table Rows */}
            {students.map((student, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 1, borderBottom: '1px solid #ddd' }}
              >
                <Typography>{student.name}</Typography>
                <Typography>{student.work}</Typography>
                <Typography>{student.score}%</Typography>
                <Typography>{student.attention}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
