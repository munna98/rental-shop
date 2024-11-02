import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useInvoice } from "@/context/InvoiceContext";

const PaymentDetails = () => {
  const theme = useTheme();
  const { totalAmount } = useInvoice();

  // State to manage multiple payments
  const [payments, setPayments] = useState([
    { amount: "", date: new Date().toISOString().slice(0, 10), method: "cash", status: "pending" },
  ]);

  // Function to handle input changes for each payment
  const handlePaymentChange = (index, field, value) => {
    setPayments((prev) =>
      prev.map((payment, i) => (i === index ? { ...payment, [field]: value } : payment))
    );
  };

  // Function to add a new empty payment entry
  const addPayment = () => {
    setPayments((prev) => [
      ...prev,
      { amount: "", date: new Date().toISOString().slice(0, 10), method: "cash", status: "pending" },
    ]);
  };

  // Calculate the total paid amount and balance
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const balanceAmount = totalAmount - totalPaid;

  // Function to submit payment details (connect to your invoice saving logic here)
  const handlePaymentSubmit = () => {
    console.log("Payment details:", payments);
    // Integrate with backend or invoice logic here
  };

  return (
    <Box
      sx={{
        background: theme.palette.mode === "dark" ? "rgba(206, 90, 103, 0.4)" : "rgba(206, 90, 103, 0.2)",
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" color="#CE5A67" gutterBottom>
        Payment Details
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Display Total and Balance Amounts */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Total Amount"
            value={totalAmount.toLocaleString()}
            fullWidth
            disabled
            InputProps={{ startAdornment: <Typography>₹</Typography> }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Balance Amount"
            value={balanceAmount.toLocaleString()}
            fullWidth
            disabled
            InputProps={{ startAdornment: <Typography>₹</Typography> }}
          />
        </Grid>

        {/* Render each payment entry */}
        {payments.map((payment, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Amount"
                type="number"
                value={payment.amount}
                onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                fullWidth
                InputProps={{ startAdornment: <Typography>₹</Typography> }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date"
                type="date"
                value={payment.date}
                onChange={(e) => handlePaymentChange(index, "date", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={payment.method}
                  onChange={(e) => handlePaymentChange(index, "method", e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </React.Fragment>
        ))}

        {/* Button to add a new payment entry */}
        <Grid item xs={12}>
          <Button onClick={addPayment} variant="outlined" fullWidth sx={{ mt: 2 }}>
            Add Another Payment
          </Button>
        </Grid>

        {/* Notes field */}
        <Grid item xs={12}>
          <TextField
            name="notes"
            label="Payment Notes"
            rows={3}
            value={payments.notes}
            onChange={(e) => handlePaymentChange(0, "notes", e.target.value)} // Adjust as needed
            fullWidth
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handlePaymentSubmit}
            fullWidth
            sx={{
              backgroundColor: "#CE5A67",
              "&:hover": {
                backgroundColor: "#b44851",
              },
              mt: 2,
            }}
          >
            Update Payment Details
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentDetails;
