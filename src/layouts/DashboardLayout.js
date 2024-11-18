import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useRouter } from 'next/router';

const DashboardLayout = ({ children, toggleTheme, isDarkMode }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationItems = [
    { text: 'Invoice', path: '/invoicing', icon: <ReceiptIcon /> },
    { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { text: 'Help', path: '/help', icon: <HelpOutlineIcon /> },
  ];

  const drawerStyles = {
    width: 280,
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${theme.palette.grey[900]}, ${theme.palette.grey[800]})`
      : `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.common.white,
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <IconButton edge="start" color="inherit" onClick={() => router.push('/')}>
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Wed Castle
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                PaperProps={{
                  sx: drawerStyles,
                }}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Wed Castle
                  </Typography>
                  <IconButton onClick={handleDrawerToggle} sx={{ color: 'inherit' }}>
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Divider />
                <List>
                  {navigationItems.map((item) => (
                    <ListItem
                      button
                      key={item.text}
                      onClick={() => {
                        router.push(item.path);
                        setDrawerOpen(false);
                      }}
                      sx={{
                        '&:hover': { backgroundColor: theme.palette.action.hover },
                        backgroundColor:
                          router.pathname === item.path
                            ? theme.palette.action.selected
                            : 'inherit',
                        color: 'inherit',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: theme.palette.mode === 'dark'
                            ? theme.palette.grey[200]
                            : theme.palette.common.white,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                  <ListItem>
                    <Switch checked={isDarkMode} onChange={toggleTheme} />
                    <Typography sx={{ ml: 1 }}>Dark Mode</Typography>
                  </ListItem>
                </List>
              </Drawer>
            </>
          ) : (
            <Box display="flex" alignItems="center">
              {navigationItems.map((item) => (
                <Button
                  color="inherit"
                  key={item.text}
                  onClick={() => router.push(item.path)}
                  sx={{ ml: 2 }}
                >
                  {item.text}
                </Button>
              ))}
              <Switch checked={isDarkMode} onChange={toggleTheme} sx={{ ml: 2 }} />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ padding: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
