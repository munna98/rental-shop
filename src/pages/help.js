import React from 'react';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const HelpPage = () => {
  return (
    <Box sx={{ 
      padding: 4, 
      maxWidth: 1200, 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          width: '100%', 
          maxWidth: 600,
          textAlign: 'center'
        }}
      >
        <HelpOutlineIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Oh, You Need Help? How Shocking.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Congratulations! You've reached the ultimate destination for solving all your problems... 
          or at least pretending to solve them.
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 3 }}>
          Contact Our Absolutely Delightful Support Team
        </Typography>
        
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
          Phone: 808-609-4070
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontStyle: 'italic' }}>
          *Warning: Results may not be exactly what you expected, but they're definitely what you got.*
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={() => alert('Sorry, this button is just for show. Try the phone number.')}
        >
          Pretend to Get Help
        </Button>
      </Paper>
    </Box>
  );
};

export default HelpPage;