import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid2 } from '@mui/material';
import { pangramData } from './spellingBeeData';
import { useNavigate } from 'react-router-dom';

const PangramGame = () => {
  const { letters, pangramWord } = pangramData;
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [found, setFound] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const navigate = useNavigate();
  
  const handleMoveOn = () => {
    navigate('/mini'); // Navigate to the first game
  };

  // Handle letter click to append to input
  const handleLetterClick = (letter) => {
    if (!found) {
      setInput((prevInput) => prevInput + letter); // Append the clicked letter to the input
      setInvalidInput(false); // Reset invalid input warning
    }
  };

  // Handle input change (validate if the character is in the provided letters)
  const handleInputChange = (e) => {
    const newInput = e.target.value.toUpperCase();

    // Check if the new input contains only valid letters
    if (newInput.split('').every(letter => letters.includes(letter))) {
      setInput(newInput);
      setInvalidInput(false); // Reset invalid input warning
    } else {
      setInvalidInput(true); // Set warning if invalid input is detected
    }
  };

  // Clear input
  const clearInput = () => {
    setInput('');
    setMessage('');
    setInvalidInput(false); // Reset invalid input flag
  };

  // Check if the input is the correct pangram
  const checkPangram = () => {
    const inputSet = new Set(input.split('').sort()); // Set of unique letters in input
    const pangramSet = new Set(pangramWord.split('').sort()); // Set of unique letters in the pangram

    // If the input word has all letters in the pangram word
    if (inputSet.size === pangramSet.size && [...inputSet].every(letter => pangramSet.has(letter))) {
        if (pangramWord === input) {
            setFound(true);
            setMessage(`Congratulations! You found the pangram: "${pangramWord}"`);        }
        else {
            setMessage(`Oops! Try again. This is not the pangram`);
        }
    } else {
      setMessage(`Oops! Try again. Make sure your word contains all the letters: ${letters.join(', ')}`);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pangram Game
      </Typography>
      <Typography variant="h6" gutterBottom>
        Find the word that uses all of these letters:
      </Typography>
      <Grid2 container spacing={1} justifyContent="center" sx={{ marginBottom: 2 }}>
  {letters.map((letter, index) => (
    <Grid2 item xs={1} key={index}>  {/* Adjust xs value as needed */}
      <Button 
        sx={{ width: '10px', color: 'black'  }}  // You can still apply this to the button
        onClick={() => handleLetterClick(letter)}
        disabled={found}
      >
        {letter}
      </Button>
    </Grid2>
  ))}
</Grid2>


      <TextField
        value={input}
        onChange={handleInputChange}
        label="Enter Pangram Word"
        variant="outlined"
        sx={{ marginBottom: 2 }}
        disabled={found}
      />

      {invalidInput && (
        <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
          Invalid input! Only the letters {letters.join(', ')} are allowed.
        </Typography>
      )}

      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={checkPangram}
          sx={{ marginRight: 2, }}
          disabled={found} // Disable button after finding the pangram
        >
          Submit Word
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={clearInput}
          sx={{ marginLeft: 2 }}
          disabled={found}
        >
          Clear
        </Button>

        {found && (
          <>
          <Typography variant="h5" color="success.main" sx={{ marginTop: 2 }}>
            You have completed the game! Your word: "{pangramWord}"
          </Typography>
           <Button 
           variant="contained" 
           color="primary" 
           size="large" 
           onClick={handleMoveOn} 
           sx={{ marginTop: 4 }}
         >
           Move on
         </Button>
         </>
        )}

        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {message}
        </Typography>

      </Box>
    </Box>
  );
};

export default PangramGame;