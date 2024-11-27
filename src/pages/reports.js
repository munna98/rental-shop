import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { 
  Box, 
  Typography, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Grid, 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  Button,
  TextField
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
// import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro';

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [dateRange, setDateRange] = useState([null, null]);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    invoiceCount: 0,
    topCustomers: [],
    revenueByMonth: []
  });

  // Simulated data fetch (replace with actual API call)
  useEffect(() => {
    const fetchReportData = async () => {
      // Example mock data - replace with actual backend API call
      setReportData({
        totalRevenue: 125000,
        invoiceCount: 42,
        topCustomers: [
          { name: 'John Doe', totalSpent: 45000 },
          { name: 'Emily Smith', totalSpent: 35000 },
          { name: 'Michael Johnson', totalSpent: 25000 }
        ],
        revenueByMonth: [
          { month: 'Jan', revenue: 25000 },
          { month: 'Feb', revenue: 35000 },
          { month: 'Mar', revenue: 45000 },
          { month: 'Apr', revenue: 20000 }
        ]
      });
    };

    fetchReportData();
  }, [timeRange]);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    setIsCustomRange(value === 'custom');
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h4" component="h1">
          Reports
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={timeRange}
              label="Time Period"
              onChange={(e) => handleTimeRangeChange(e.target.value)}
            >
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={90}>Last 90 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>

          {isCustomRange && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} />
                  </>
                )}
              />
            </LocalizationProvider>
          )}
        </Box>
      </Box>

      {/* Financial Overview Grid */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Financial Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2">Total Revenue</Typography>
                <Typography variant="h5">₹{reportData.totalRevenue.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Total Invoices</Typography>
                <Typography variant="h5">{reportData.invoiceCount}</Typography>
              </Box>
              <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                Download Full Report
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Top Customers */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Customers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell align="right">Total Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.topCustomers.map((customer) => (
                    <TableRow key={customer.name}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell align="right">
                        ₹{customer.totalSpent.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;