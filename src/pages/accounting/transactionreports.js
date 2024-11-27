import React, { useState, useEffect } from 'react';
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
  Chip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro';

const TransactionsReportPage = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [dateRange, setDateRange] = useState([null, null]);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [reportData, setReportData] = useState({
    receipts: [],
    payments: [],
    transactionsByMethod: {
      receipts: [],
      payments: []
    }
  });

  // Simulated data fetch (replace with actual API call)
  useEffect(() => {
    const fetchTransactionData = async () => {
      // Example mock data - replace with actual backend API call
      setReportData({
        receipts: [
          { 
            date: '2024-01-15', 
            serialNumber: 'RCP001', 
            amount: 25000, 
            method: 'upi', 
            customerName: 'John Doe',
            description: 'Service Payment'
          },
          { 
            date: '2024-01-20', 
            serialNumber: 'RCP002', 
            amount: 35000, 
            method: 'cash', 
            customerName: 'Jane Smith',
            description: 'Product Sale'
          }
        ],
        payments: [
          { 
            date: '2024-01-10', 
            serialNumber: 'PYM001', 
            amount: 50000, 
            method: 'bank_transfer', 
            vendorName: 'Supplier Corp',
            description: 'Raw Materials Purchase'
          },
          { 
            date: '2024-01-25', 
            serialNumber: 'PYM002', 
            amount: 20000, 
            method: 'card', 
            vendorName: 'Office Supplies Inc',
            description: 'Office Equipment'
          }
        ],
        transactionsByMethod: {
          receipts: [
            { method: 'cash', amount: 60000, count: 15 },
            { method: 'upi', amount: 90000, count: 25 },
            { method: 'card', amount: 30000, count: 10 }
          ],
          payments: [
            { method: 'bank_transfer', amount: 120000, count: 10 },
            { method: 'card', amount: 66000, count: 18 },
            { method: 'cash', amount: 30000, count: 5 }
          ]
        }
      });
    };

    fetchTransactionData();
  }, [timeRange]);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    setIsCustomRange(value === 'custom');
  };

  const getMethodColor = (method) => {
    const colorMap = {
      'cash': 'primary',
      'upi': 'secondary',
      'card': 'success',
      'bank_transfer': 'info'
    };
    return colorMap[method] || 'default';
  };

  const renderTransactionMethodTable = (title, transactionMethods) => (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Method</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="right">Transaction Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionMethods.map((method) => (
              <TableRow key={method.method}>
                <TableCell>
                  <Chip 
                    label={method.method.toUpperCase()} 
                    color={getMethodColor(method.method)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  ₹{method.amount.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {method.count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <Box sx={{  maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography  variant="h5" component="h1">
          Transactions Report
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={timeRange}
              label="Time Period"
              onChange={(e) => handleTimeRangeChange(e.target.value)}
            >
              <MenuItem value={1}>Today</MenuItem>
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

      {/* Transactions Grid */}
      <Grid container spacing={3}>
        {/* Transactions by Payment Method */}
        <Grid item xs={12} md={6}>
          {renderTransactionMethodTable('Receipts by Method', reportData.transactionsByMethod.receipts)}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderTransactionMethodTable('Payments by Method', reportData.transactionsByMethod.payments)}
        </Grid>

        {/* Receipts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Receipts
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Receipt ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.receipts.map((receipt) => (
                    <TableRow key={receipt.serialNumber}>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell>{receipt.serialNumber}</TableCell>
                      <TableCell>{receipt.customerName}</TableCell>
                      <TableCell>{receipt.description}</TableCell>
                      <TableCell align="right">
                        ₹{receipt.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={receipt.method.toUpperCase()} 
                          color={getMethodColor(receipt.method)} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Payments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payments
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.payments.map((payment) => (
                    <TableRow key={payment.serialNumber}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.serialNumber}</TableCell>
                      <TableCell>{payment.vendorName}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell align="right">
                        ₹{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.method.toUpperCase()} 
                          color={getMethodColor(payment.method)} 
                          size="small" 
                        />
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

export default TransactionsReportPage;