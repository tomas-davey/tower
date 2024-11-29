import React from 'react';
import { Container } from '@mui/material';
import Navbar from '../components/Navbar';

const GamePage = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Container sx={{ marginTop: 4 }}>
        {children}
      </Container>
    </div>
  );
};

export default GamePage;
