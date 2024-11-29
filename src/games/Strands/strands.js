import React, { useState } from 'react';
import { Box, Grid2, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Example word list (you can replace it with a dynamic API or more extensive list)
const wordList = ["PERFECTDATES", "BRIGHTON", "BOWLING", "ICESKATING", "HIKES", "BAKING"];

// Sample 5x5 grid
const sampleGrid = [
  ['I', 'T', 'A', 'F', 'E', 'P'],
  ['N', 'K', 'C', 'E', 'R', 'G'],
  ['G', 'E', 'S', 'T', 'I', 'N'],
  ['I', 'C', 'D', 'S', 'B', 'L'],
  ['G', 'A', 'K', 'E', 'O', 'W'],
  ['N', 'T', 'I', 'H', 'B', 'I'],
  ['I', 'K', 'E', 'N', 'R', 'G'],
  ['A', 'B', 'S', 'O', 'T', 'H'],
];

const Strands = () => {
  const [letterGrid, setLetterGrid] = useState(sampleGrid); // Fixed sample grid
  const [currentPath, setCurrentPath] = useState([]);  // Stores the sequence of selected letters
  const [validWords, setValidWords] = useState([]);  // List of formed words
  const [highlightedCells, setHighlightedCells] = useState([]);  // Track the cells of found words
  const [gameOver, setGameOver] = useState(false);  // Check if game is over
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSwiping, setIsSwiping] = useState(false);  // Tracks if a swipe is in progress

  // Reset current word path
  const resetCurrentPath = () => {
    setCurrentPath([]);
  };

  // Check if two cells are adjacent (either horizontally, vertically, or diagonally)
  const isAdjacent = (lastCell, rowIndex, colIndex) => {
    const rowDiff = Math.abs(lastCell.row - rowIndex);
    const colDiff = Math.abs(lastCell.col - colIndex);
    
    // Check if it's adjacent and not the same cell
    return (rowDiff <= 1 && colDiff <= 1) && (rowDiff !== 0 || colDiff !== 0);
  };
  // Handle mouse down for swipe
  const handleStart = (rowIndex, colIndex, letter) => {
    if (gameOver) return; // Don't allow interaction after game over
    setFeedbackMessage(null)
    setIsSwiping(true);
    setCurrentPath([{ letter, row: rowIndex, col: colIndex }]); // Start a new word
  };

  let lastMoveTime = 0;
const throttleInterval = 10;

  const handleMove = (rowIndex, colIndex, letter) => {
    if (!isSwiping || currentPath.length === 0) return;
    const currentTime = Date.now();
    if (currentTime - lastMoveTime < throttleInterval) {
        console.log("got ya")
        return;
      }
    
      lastMoveTime = currentTime;

    const lastCell = currentPath[currentPath.length - 1];
  
    if (isAdjacent(lastCell, rowIndex, colIndex) && isCellLastInPath(rowIndex, colIndex) ) {
        currentPath.pop();
    }
     if (isAdjacent(lastCell, rowIndex, colIndex) && !isCellInPath(rowIndex, colIndex) ) {

      setCurrentPath((prev) => [...prev, { letter, row: rowIndex, col: colIndex }]);
    }
    const word = currentPath.map((cell) => cell.letter).join('');

    setFeedbackMessage(word);
  };

  // Handle mouse up or touch end to finalize the swipe
  const handleEnd = () => {
    if (gameOver) return;
    setIsSwiping(false); // End the swipe

    // Only check for valid words when the user has stopped moving
    if (currentPath.length >= 3) {
      const word = currentPath.map((cell) => cell.letter).join('');

      // Check if the word is valid and hasn't been found before
      if (wordList.includes(word) && !validWords.includes(word)) {
        // Add the word to valid words
        setValidWords((prev) => [...prev, word]);

        // Highlight the cells of the found word
        const wordCells = currentPath.map((cell) => ({ row: cell.row, col: cell.col }));
        setHighlightedCells((prev) => [...prev, ...wordCells]);

        setFeedbackMessage('Word Found!');
      } else if (validWords.includes(word)) {
        setFeedbackMessage('Word already found. Try a different word.');
      } else {
        setFeedbackMessage('Invalid Word. Try Again.');
      }
    }

    resetCurrentPath(); // Clear the path after word submission
  };

  // Check if a cell is already in the current path
  const isCellInPath = (rowIndex, colIndex) => {
    return currentPath.some(cell => cell.row === rowIndex && cell.col === colIndex);
  };
  const isCellLastInPath = (rowIndex, colIndex) => {
    const lastCell = currentPath[currentPath.length - 2];
    return lastCell && lastCell.row === rowIndex && lastCell.col === colIndex;
  };

  // Handle the game reset
  const handleResetGame = () => {
    setLetterGrid(sampleGrid);
    setCurrentPath([]);
    setValidWords([]);
    setHighlightedCells([]);
    setFeedbackMessage('');
    setGameOver(false);
  };

  // Handle game over
  const navigate = useNavigate();
  
  const handleMoveOn = () => {
    navigate('/finish'); // Navigate to the first game
  };
  // Check if all words are found
  const allWordsFound = validWords.length === wordList.length;

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        Time well spent
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        {/* Grid displaying the letters */}
        <Grid2 container spacing={1} justifyContent="center" style={{ maxWidth: '330px' }}>
          {letterGrid.map((row, rowIndex) => (
            <Grid2 container item key={rowIndex} spacing={1} justifyContent="center">
              {row.map((letter, colIndex) => (
                <Grid2 item size={2} xs={2} key={colIndex}>
                  <Button
                    size="large"
                    onTouchStart={() => handleStart(rowIndex, colIndex, letter)}
                    onTouchMove={() => handleMove(rowIndex, colIndex, letter)}
                    onTouchEnd={handleEnd}
                    onMouseDown={() => handleStart(rowIndex, colIndex, letter)}
                    onMouseMove={() => handleMove(rowIndex, colIndex, letter)}
                    onMouseUp={handleEnd}
                    style={{
                      minWidth: '10px',
                      width: '35px',
                      height: '40px',
                      fontSize: '20px',
                      backgroundColor:
                        isCellInPath(rowIndex, colIndex) // Cells in current path are blue
                          ? 'blue'
                          : highlightedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) // Cells in found words are green
                          ? 'green'
                          : 'transparent', // Other cells are transparent
                      color: 'black',
                    }}
                  >
                    {letter}
                  </Button>
                </Grid2>
              ))}
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Feedback and valid words */}
      <Typography variant="h6" align="center" gutterBottom>
        {feedbackMessage}
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
      </Box>

      {/* Valid Words Display */}
      <Box display="flex" justifyContent="center" >
       
     
          <Typography variant="h6" padding='8px'>
            {validWords.length} / {wordList.length} Words Found
          </Typography>
   
      </Box>

      {/* Show Move On button if all words are found */}
      {allWordsFound && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="primary" onClick={handleMoveOn}>
            Move On
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Strands;
