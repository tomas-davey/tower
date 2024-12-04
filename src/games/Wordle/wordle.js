import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  TextField, 
  Typography, 
  Modal, 
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
  const [currentGuess, setCurrentGuess] = useState('');
  const [results, setResults] = useState(Array(6).fill(Array(5).fill('')));
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const handleMoveOn = () => {
    navigate('/wordle');
  };
 <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="primary" onClick={handleMoveOn}>
            Move On
          </Button>
        </Box>
  // Initialize game on component mount
  useEffect(() => {
    startNewGame();
  }, []);

  // Start a new game
  const startNewGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuesses(Array(6).fill(''));
    setCurrentGuess('');
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

  // Handle keyboard input
  const handleKeyPress = useCallback((event) => {
    const key = event.key.toUpperCase();

    // Prevent input if game is over
    if (gameOver) return;

    // Handle letter input
    if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
      return;
    }

    // Handle backspace
    if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    // Handle enter
    if (key === 'ENTER' && currentGuess.length === 5) {
      // Check if guess is valid
      const newResults = [...results];
      newResults[currentRow] = checkGuess(currentGuess);
      setResults(newResults);

      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;
      setGuesses(newGuesses);

      // Check for win
      if (currentGuess === word) {
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
      setCurrentGuess('');
    }
  }, [currentGuess, currentRow, word, results, checkGuess, gameOver]);

  // Add event listener for keyboard
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

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
          Wordle Clone
        </Typography>

        {/* Game Grid */}
        <Grid container spacing={1} justifyContent="center">
          {guesses.map((guess, rowIndex) => (
            <Grid container item key={rowIndex} spacing={1} justifyContent="center">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Grid item key={colIndex}>
                  <Paper
                    elevation={3}
                    sx={{
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 
                        rowIndex === currentRow && currentGuess[colIndex] 
                          ? 'lightblue' 
                          : results[rowIndex][colIndex] 
                            ? getLetterColor(results[rowIndex][colIndex]) 
                            : 'white',
                      border: '2px solid gray',
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: '2rem'
                    }}
                  >
                    {rowIndex < currentRow 
                      ? guesses[rowIndex][colIndex] 
                      : rowIndex === currentRow 
                        ? currentGuess[colIndex] 
                        : ''}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>

        {/* Message Area */}
        {message && (
  <>
    <Typography 
      variant="body1" 
      color={gameWon ? 'green' : 'error'} 
      sx={{ mt: 2 }}
    >
      {message}
    </Typography>
    {message === 'Congratulations! You won!' && (
      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" color="primary" onClick={handleMoveOn}>
          Move On
        </Button>
      </Box>
    )}
  </>
)}


       
      </Box>
    </Container>
  );
};

export default Wordle;