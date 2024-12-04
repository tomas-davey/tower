import React from 'react';
import { Container, Typography, Box } from '@mui/material';


const FinishPage = ({ playerScore, onRestart }) => {


  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Congratulations!
      </Typography>
      {/* <Typography variant="h6" gutterBottom>
        Your Score: {playerScore}
      </Typography> */}
      <Box sx={{ my: 4 }}>
        <Typography variant="body1">
          Your reward for completing the game is....
        </Typography>
        <Typography variant="body1">
          A pass to indoor sky diving! (+1... me?)
        </Typography>
      </Box>
      
    </Container>
  );
};

export default FinishPage;
