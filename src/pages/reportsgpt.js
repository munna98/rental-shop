import React, { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, Select, FormControl, InputLabel, CircularProgress, Grid } from '@mui/material';
import axios from 'axios'; // For API calls
import { Bar } from 'react-chartjs-2';

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/reports?timeRange=${timeRange}`);
      setReportData(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const chartData = {
    labels: reportData?.categories || [],
    datasets: [
      {
        label: 'Revenue',
        data: reportData?.revenues || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: reportData?.expenses || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Reports
        </Typography>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timeRange}
            label="Time Period"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value={7}>Last 7 Days</MenuItem>
            <MenuItem value={30}>Last 30 Days</MenuItem>
            <MenuItem value={90}>Last 90 Days</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Content Section */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Total Revenue: ₹{reportData.totalRevenue || 0}</Typography>
            <Typography variant="h6">Total Expenses: ₹{reportData.totalExpenses || 0}</Typography>
            <Typography variant="h6">Pending Payments: ₹{reportData.pendingPayments || 0}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Revenue vs Expenses' },
                },
              }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ReportsPage;
