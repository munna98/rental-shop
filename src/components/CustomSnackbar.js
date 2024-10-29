// src/components/CustomSnackbar.js
import React from "react";
import { Snackbar, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

const icons = {
  success: <CheckCircleIcon fontSize="inherit" />,
  error: <ErrorIcon fontSize="inherit" />,
  warning: <WarningIcon fontSize="inherit" />,
  info: <InfoIcon fontSize="inherit" />,
};

const CustomSnackbar = ({ open, onClose, message, severity = "info", duration = 3000 }) => {
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={onClose}>
      <Alert
        onClose={onClose}
        severity={severity}
        icon={icons[severity]}
        sx={{
          bgcolor: severity === "success" ? "green.500" : severity === "error" ? "red.500" : severity === "warning" ? "orange.500" : "blue.500",
          color: "black",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
