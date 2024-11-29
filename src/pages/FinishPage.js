import React from 'react';
import { Container, Typography, Box } from '@mui/material';


const FinishPage = ({ playerScore, onRestart }) => {


  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Congratulations!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Score: {playerScore}
      </Typography>
      <Box sx={{ my: 4 }}>
        <Typography variant="body1">
          Great job! You've completed the game. Would you like to play again or return to the home page?
        </Typography>
      </Box>
      
    </Container>
  );
};

export default FinishPage;
