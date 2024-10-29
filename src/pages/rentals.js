import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from '@mui/material';
import { useRouter } from 'next/router';
import StatusChip from '@/components/StatusChip';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const sampleRentedItems = [
  {
    id: 1,
    customer: 'Neymar Jr',
    item: 'Blazer',
    code: 'BZ123',
    deliveryDate: '2024-10-20',
    weddingDate: '2024-11-05',
    status: 'On Rent',
  },
  {
    id: 2,
    customer: 'Lamin Yamal',
    item: 'Kurtha',
    code: 'KR101',
    deliveryDate: '2024-10-18',
    weddingDate: '2024-11-02',
    status: 'On Rent',
  },
];

const RentalsPage = () => {
  const router = useRouter();

  const handleRentNow = () => {
    router.push('/invoicing'); // Ensure the path matches your Next.js page structure
  };

  const handleReturn = (itemId) => {
    // Functionality for handling item return
    console.log(`Returning item with ID: ${itemId}`);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Current Rentals
        </Typography>
        <Button variant="contained" color="primary" onClick={handleRentNow}>
          Rent Now
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Delivery Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Wedding Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell> {/* New column for actions */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleRentedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.customer}</TableCell>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.deliveryDate}</TableCell>
                <TableCell>{item.weddingDate}</TableCell>
                <TableCell>
                  <StatusChip status={item.status} /> {/* Use StatusChip */}
                </TableCell>
                <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AutorenewIcon />}
                  sx={{ marginRight: 1 }} // Add space between buttons
                  onClick={() => console.log("Edit", item.id)} // Placeholder action
                >
                  Return
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RentalsPage;
