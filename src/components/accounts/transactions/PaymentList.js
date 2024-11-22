// PaymentList.js
import React from "react";
import { Paper, Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";

export const PaymentList = ({ groupedPayments, payments, handleSubmitPayments }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payments List
      </Typography>
      
      {groupedPayments && Object.entries(groupedPayments).map(([key, groupPayments]) => (
        <Box key={key} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {groupPayments[0].entityName}
            </Typography>
            <Chip 
              label={groupPayments[0].entityType === 'customer' ? 'Customer' : 'Account'}
              color={groupPayments[0].entityType === 'customer' ? 'primary' : 'secondary'}
              size="small"
            />
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupPayments.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell align="right">
                      {payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {payment.method.charAt(0).toUpperCase() + 
                       payment.method.slice(1).replace('_', ' ')}
                    </TableCell>
                    <TableCell>{payment.note}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={1}><strong>Total</strong></TableCell>
                  <TableCell align="right">
                    <strong>
                      {groupPayments
                        .reduce((sum, payment) => sum + payment.amount, 0)
                        .toFixed(2)}
                    </strong>
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {payments.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitPayments}
          fullWidth
        >
          Submit All Payments
        </Button>
      )}

      {payments.length === 0 && (
        <Typography color="text.secondary" align="center">
          No pending payments
        </Typography>
      )}
    </Paper>  
  );
};