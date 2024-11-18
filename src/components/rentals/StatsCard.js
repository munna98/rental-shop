import React from "react";
import { Card, CardContent, Box, Typography, useTheme } from "@mui/material";

const StatsCard = ({ icon: Icon, value, label, iconColor }) => {
  const theme = useTheme(); // Access the current theme
  
  return (
    <Card
      sx={{
        boxShadow: theme.palette.mode === "light" 
          ? "0 8px 20px rgba(0, 0, 0, 0.1)" 
          : "0 8px 20px rgba(0, 0, 0, 0.5)", // Adjusted shadow for dark mode
        borderRadius: "16px",
        background: theme.palette.mode === "light"
          ? "rgba(255, 255, 255, 0.8)" // Light mode glassmorphic background
          : "rgba(42, 42, 42, 0.8)", // Dark mode glassmorphic background
        backdropFilter: "blur(10px)",
        border: `1px solid ${
          theme.palette.mode === "light"
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.1)"
        }`,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Icon
            sx={{
              mr: 2,
              color: iconColor || theme.palette.primary.main, // Fallback to theme primary color
              fontSize: "40px",
            }}
          />
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary, // Dynamically adapt text color
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary, // Secondary text color for label
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
