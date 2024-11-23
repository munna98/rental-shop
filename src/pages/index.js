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
  { component: <ReportIcon />, label: 'Reports', route: '/reports' },
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


// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   useTheme, 
//   CircularProgress,
//   Fade,
//   Skeleton
// } from '@mui/material';
// import ItemIcon from '@mui/icons-material/Category';
// import PeopleIcon from '@mui/icons-material/People';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import CalculateIcon from '@mui/icons-material/Calculate';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import ReportIcon from '@mui/icons-material/Assessment';
// import { useRouter } from 'next/router';

// const icons = [
//   { component: <ItemIcon />, label: 'Items', route: '/items' },
//   { component: <PeopleIcon />, label: 'Customers', route: '/customers' },
//   { component: <ShoppingCartIcon />, label: 'Rentals', route: '/rentals' },
//   { component: <CalculateIcon />, label: 'Accounting', route: '/accounting' },
//   { component: <BarChartIcon />, label: 'Statistics', route: '/statistics' },
//   { component: <ReportIcon />, label: 'Report', route: '/report' },
// ];

// const NavigationCard = ({ icon, label, onClick, isLoading }) => {
//   const theme = useTheme();
  
//   if (isLoading) {
//     return (
//       <Skeleton
//         variant="rounded"
//         width={120}
//         height={100}
//         sx={{
//           bgcolor: theme.palette.mode === 'dark' 
//             ? 'rgba(206, 90, 103, 0.1)' 
//             : 'rgba(206, 90, 103, 0.05)'
//         }}
//       />
//     );
//   }

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       onClick={onClick}
//       sx={{
//         background: theme.palette.mode === 'dark' 
//           ? 'rgba(206, 90, 103, 0.4)' 
//           : 'rgba(206, 90, 103, 0.2)',
//         borderRadius: '8px',
//         padding: '16px',
//         width: '120px',
//         transition: 'transform 0.2s, box-shadow 0.2s',
//         cursor: 'pointer',
//         '&:hover': {
//           transform: 'scale(1.05)',
//           boxShadow: '0 4px 20px rgba(206, 90, 103, 0.2)',
//         },
//         '&:active': {
//           transform: 'scale(0.98)',
//         }
//       }}
//     >
//       {icon}
//       <Typography 
//         variant="body1" 
//         sx={{ 
//           marginTop: 1,
//           fontWeight: 500,
//           textAlign: 'center'
//         }}
//       >
//         {label}
//       </Typography>
//     </Box>
//   );
// };

// const HomePage = () => {
//   const theme = useTheme();
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isNavigating, setIsNavigating] = useState(false);

//   useEffect(() => {
//     // Simulate initial data loading
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleIconClick = async (route) => {
//     setIsNavigating(true);
//     await router.push(route);
//     setIsNavigating(false);
//   };

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       minHeight="calc(100vh - 100px)"
//       sx={{ padding: 4, maxWidth: 1200, margin: "0 auto", position: 'relative' }}
//     >
//       {/* Navigation overlay loader */}
//       <Fade in={isNavigating}>
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             bgcolor: 'rgba(0, 0, 0, 0.3)',
//             zIndex: 1000,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//         >
//           <CircularProgress sx={{ color: theme.palette.primary.main }} />
//         </Box>
//       </Fade>

//       <Fade in={!isLoading} timeout={500}>
//         <Box sx={{ textAlign: 'center' }}>
//           <Typography 
//             variant="h4" 
//             gutterBottom
//             sx={{ 
//               fontWeight: 600,
//               color: theme.palette.mode === 'dark' 
//                 ? theme.palette.primary.light 
//                 : theme.palette.primary.main
//             }}
//           >
//             WED CASTLE
//           </Typography>
          
//           <Box
//             display="flex"
//             justifyContent="center"
//             flexWrap="wrap"
//             marginTop="30px"
//             sx={{ gap: 2 }}
//           >
//             {icons.map((icon, index) => (
//               <NavigationCard
//                 key={index}
//                 icon={icon.component}
//                 label={icon.label}
//                 onClick={() => handleIconClick(icon.route)}
//                 isLoading={isLoading}
//               />
//             ))}
//           </Box>
//         </Box>
//       </Fade>
//     </Box>
//   );
// };

// export default HomePage;