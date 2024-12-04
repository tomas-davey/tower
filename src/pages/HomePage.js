import React from 'react';
import { Button, Container, Typography, Box, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.module.css'

const HomePage = () => {
  const navigate = useNavigate();

  const handleBegin = () => {
    navigate('/connections'); // Navigate to the first game
  };

  return (
<>  
      {/* <Navbar /> */}
      <Container sx={{ marginTop: 8, alignItems: 'center', display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
     backgroundColor: '#3F7CB6'  }}>
        <Grid2 container spacing={0} alignItems="center">
          {/* Left Section */}
          <Grid2 item size={{xs: 12, sm: 6}}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h3" gutterBottom fontWeight='bold'>
                Welcome to The Tower
              </Typography>
              <Typography variant="body1" gutterBottom fontWeight='bold'>
                A series of fun games you have to complete to unlock your present!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBegin}
                sx={{ marginTop: 4 }}
              >
                Begin
              </Button>
            </Box>
          </Grid2>

          {/* Right Section */}
          <Grid2 size={{xs: 12, sm: 6}}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src="/logo192.png"
                alt="Game Logo"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </Box>
       
          </Grid2>
        </Grid2>
      </Container>
</>
  );
};

export default HomePage;
