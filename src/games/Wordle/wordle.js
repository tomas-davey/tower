import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid2, 
  TextField, 
  Typography, 
  Alert,
  Paper 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// List of 5-letter words for the game
const WORDS = [
  'CRAZY'
];

const Wordle = () => {
  // State management
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState(Array(5).fill(''));
  const [results, setResults] = useState(Array(6).fill(Array(5).fill('')));
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const handleMoveOn = () => {
    navigate('/cryptic');
  };

  // Initialize game on component mount
  useEffect(() => {
    startNewGame();
  }, []);

  // Start a new game
  const startNewGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuesses(Array(6).fill(''));
    setCurrentGuess(Array(5).fill(''));
    setResults(Array(6).fill(Array(5).fill('')));
    setGameOver(false);
    setGameWon(false);
    setCurrentRow(0);
    setMessage('');
  }, []);

  // Check if guess is correct
  const checkGuess = useCallback((guess) => {
    if (guess.length !== 5) {
      setMessage('Guess must be 5 letters long!');
      return Array(5).fill('');
    }

    const wordArray = word.split('');
    const guessArray = guess.split('');
    const result = new Array(5).fill('');

    // First pass: check for correct letters in correct position (green)
    guessArray.forEach((letter, index) => {
      if (letter === wordArray[index]) {
        result[index] = 'correct';
        wordArray[index] = null;
      }
    });

    // Second pass: check for letters in wrong position (yellow)
    guessArray.forEach((letter, index) => {
      if (result[index] === '') {
        const yellowIndex = wordArray.indexOf(letter);
        if (yellowIndex !== -1) {
          result[index] = 'present';
          wordArray[yellowIndex] = null;
        } else {
          result[index] = 'absent';
        }
      }
    });

    return result;
  }, [word]);

  // Handle input change
  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const newGuess = [...currentGuess];
    newGuess[index] = value.toUpperCase();
    setCurrentGuess(newGuess);
  };

  // Handle submit (when user presses "Enter")
  const handleSubmitGuess = () => {
    const guess = currentGuess.join('');
    if (guess.length !== 5) {
      setMessage('Guess must be 5 letters long!');
      return;
    }

    const newResults = [...results];
    newResults[currentRow] = checkGuess(guess);
    setResults(newResults);

    const newGuesses = [...guesses];
    newGuesses[currentRow] = guess;
    setGuesses(newGuesses);

    // Check for win
    if (guess === word) {
      setGameWon(true);
      setGameOver(true);
      setMessage('Congratulations! You won!');
      return;
    }

    // Check for game over
    if (currentRow === 5) {
      setGameOver(true);
      setMessage(`Game Over! The word was ${word}`);
      return;
    }

    // Move to next row
    setCurrentRow(prev => prev + 1);
    setCurrentGuess(Array(5).fill(''));
  };

  // Render color based on letter result
  const getLetterColor = (result) => {
    switch(result) {
      case 'correct': return 'green';
      case 'present': return 'yellow';
      case 'absent': return 'gray';
      default: return 'white';
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Wordle
        </Typography>

        {/* Game Grid */}
        <Grid2 container spacing={1} justifyContent="center">
          {guesses.map((guess, rowIndex) => (
            <Grid2 container item key={rowIndex} spacing={1} justifyContent="center">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Grid2 item size={12/5} key={colIndex}>
                    <TextField
                     value={rowIndex < currentRow ? guesses[rowIndex][colIndex] : rowIndex === currentRow ? currentGuess[colIndex] : ''}
                     onChange={(e) => handleInputChange(e, colIndex)}
                     inputProps={{
                        maxLength: 1,
                        style: { textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold' }
                      }}
                      disabled={gameOver || rowIndex < currentRow}
                      sx={{ backgroundColor: rowIndex === currentRow && currentGuess[colIndex] ? 'white' : results[rowIndex][colIndex] ? getLetterColor(results[rowIndex][colIndex]) : 'white',}}
                     />

                  {/* <TextField
                    value={rowIndex < currentRow ? guesses[rowIndex][colIndex] : rowIndex === currentRow ? currentGuess[colIndex] : ''}
                    onChange={(e) => handleInputChange(e, colIndex)}
                    inputProps={{
                      maxLength: 1,
                      style: { textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold' }
                    }}
                    sx={{
                      width: 40,
                      height: 40,
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        fontSize: '1.5rem',
                      },
                      backgroundColor: rowIndex === currentRow && currentGuess[colIndex] ? 'lightblue' : results[rowIndex][colIndex] ? getLetterColor(results[rowIndex][colIndex]) : 'white',
                      border: '2px solid gray',
                      fontWeight: 'bold'
                    }}
                    disabled={gameOver || rowIndex < currentRow}
                  /> */}
                </Grid2>
              ))}
            </Grid2>
          ))}
        </Grid2>

        {/* Message Area */}
        {message && (
        //   <Typography 
        //     variant="body1" 
        //     color={gameWon ? 'green' : 'error'} 
        //     sx={{ mt: 2 }}
        //   >
        //     {message}
        //   </Typography>
           <Alert severity={gameWon ? 'success' : "error"}>
           {message}
         </Alert>
        )}

        {/* Submit Guess Button */}
        {!gameOver && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmitGuess} 
            sx={{ mt: 2 }}
          >
            Submit Guess
          </Button>
        )}

        {/* New Game Button */}
        {gameOver && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleMoveOn} 
            sx={{ mt: 2 }}
          >
            Move On
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Wordle;
