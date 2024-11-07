import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import ItemIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalculateIcon from '@mui/icons-material/Calculate';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReportIcon from '@mui/icons-material/Assessment';
import { useRouter } from 'next/router';

const icons = [
  { component: <ItemIcon />, label: 'Items', route: '/items' }, // Add route here
  { component: <PeopleIcon />, label: 'Customers', route: '/customers' },
  { component: <ShoppingCartIcon />, label: 'Rentals', route: '/rentals' },
  { component: <CalculateIcon />, label: 'Accounting', route: '/accounting' },
  { component: <BarChartIcon />, label: 'Statistics', route: '/statistics' },
  { component: <ReportIcon />, label: 'Report', route: '/report' },
];

const HomePage = () => {
  const theme = useTheme();
  const router = useRouter(); // Initialize useRouter for routing
  const appBarHeight = 100; // Adjust if your AppBar height is different

  const handleIconClick = (route) => {
    router.push(route); // Navigate to the corresponding route
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={`calc(100vh - ${appBarHeight}px)`} // Adjust for the navbar
      sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}
    >
      <Typography variant="h4" gutterBottom>
        WED CASTLE
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        marginTop="30px"
        sx={{ gap: 2 }}
      >
        {icons.map((icon, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            onClick={() => handleIconClick(icon.route)} // Handle icon click for routing
            sx={{
              background: theme.palette.mode === 'dark' ? 'rgba(206, 90, 103, 0.4)' : 'rgba(206, 90, 103, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              width: '120px',
              transition: 'transform 0.2s',
              cursor: 'pointer', // Add cursor pointer for clickability
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {icon.component}
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              {icon.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
