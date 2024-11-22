// ReceiptList.js
import React from "react";
import { Paper, Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";

export const ReceiptList = ({ groupedReceipts, receipts, handleSubmitReceipts }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Pending Receipts
      </Typography>
      
      {Object.entries(groupedReceipts).map(([key, groupReceipts]) => (
        <Box key={key} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {groupReceipts[0].entityName}
            </Typography>
            <Chip 
              label={groupReceipts[0].entityType === 'customer' ? 'Customer' : 'Account'}
              color={groupReceipts[0].entityType === 'customer' ? 'primary' : 'secondary'}
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
                {groupReceipts.map((receipt, index) => (
                  <TableRow key={index}>
                    <TableCell>{receipt.date}</TableCell>
                    <TableCell align="right">
                      {receipt.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {receipt.method.charAt(0).toUpperCase() + 
                       receipt.method.slice(1).replace('_', ' ')}
                    </TableCell>
                    <TableCell>{receipt.note}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={1}><strong>Total</strong></TableCell>
                  <TableCell align="right">
                    <strong>
                      {groupReceipts
                        .reduce((sum, receipt) => sum + receipt.amount, 0)
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

      {receipts.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitReceipts}
          fullWidth
        >
          Submit All Receipts
        </Button>
      )}

      {receipts.length === 0 && (
        <Typography color="text.secondary" align="center">
          No pending receipts
        </Typography>
      )}
    </Paper>
  );
};  