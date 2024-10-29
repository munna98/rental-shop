import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Switch, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/router';

const DashboardLayout = ({ children, toggleTheme, isDarkMode }) => {
  const router = useRouter();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <IconButton edge="start" color="inherit" onClick={() => router.push('/')}>
              <HomeIcon /> {/* Changed to Home icon */}
            </IconButton>
            <Typography variant="h6">Wed Castle</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Button color="inherit" onClick={() => router.push('/invoicing')}>
              Invoice
            </Button>
            <Button color="inherit" onClick={() => router.push('/settings')}>
              Settings
            </Button>
            <Button color="inherit" onClick={() => router.push('/help')}>
              Help
            </Button>
            {/* Add any additional navigation buttons here */}
            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ padding: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
