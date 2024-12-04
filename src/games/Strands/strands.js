import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Grid2, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Example word list (you can replace it with a dynamic API or more extensive list)
const wordList = ["PERFECTDATES", "BRIGHTON", "BOWLING", "ICESKATING", "HIKES", "BAKING"];

// Sample 5x5 grid
const sampleGrid = [
  ['X', 'T', 'A', 'F', 'E', 'P'],
  ['N', 'K', 'C', 'E', 'R', 'G'],
  ['G', 'E', 'S', 'T', 'I', 'N'],
  ['I', 'C', 'D', 'S', 'B', 'L'],
  ['G', 'A', 'K', 'E', 'O', 'W'],
  ['N', 'T', 'I', 'H', 'B', 'I'],
  ['I', 'K', 'E', 'N', 'R', 'G'],
  ['A', 'B', 'S', 'O', 'T', 'H'],
];

const Strands = () => {
  const [letterGrid, setLetterGrid] = useState(sampleGrid);
  const [currentPath, setCurrentPath] = useState([]);
  const [validWords, setValidWords] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const gridRef = useRef(null);
  const containerRef = useRef(null);
  const isSwipingRef = useRef(false);

  // Prevent default touch and scroll behaviors
  useEffect(() => {
    const container = containerRef.current;
  
    if (container) {
      // Prevent pull-to-refresh and other default touch behaviors
      container.style.touchAction = 'none';
      container.style.overscrollBehavior = 'contain';
  
      const preventDefaults = (e) => {
        if (e.cancelable) {
          e.preventDefault(); // Only call preventDefault if the event is cancelable
        }
      };
  
      const disablePullToRefresh = (e) => {
        if (e.touches && e.touches.length > 1) return; // Ignore multi-touch gestures
        preventDefaults(e);
      };
  
      container.addEventListener('touchstart', disablePullToRefresh, { passive: false });
      container.addEventListener('touchmove', disablePullToRefresh, { passive: false });
      container.addEventListener('touchend', preventDefaults, { passive: false });
  
      return () => {
        container.removeEventListener('touchstart', disablePullToRefresh);
        container.removeEventListener('touchmove', disablePullToRefresh);
        container.removeEventListener('touchend', preventDefaults);
      };
    }
  }, []);

  // Check if two cells are adjacent (either horizontally, vertically, or diagonally)
  const isAdjacent = useCallback((lastCell, rowIndex, colIndex) => {
    const rowDiff = Math.abs(lastCell.row - rowIndex);
    const colDiff = Math.abs(lastCell.col - colIndex);
    
    // Check if it's adjacent and not the same cell
    return (rowDiff <= 1 && colDiff <= 1) && (rowDiff !== 0 || colDiff !== 0);
  }, []);

  let lastMoveTime = 0;
  const throttleInterval = 10;

  // Get the cell at a specific touch point
  const getCellAtPoint = useCallback((clientX, clientY) => {
    if (!gridRef.current) return null;
  
    const gridRect = gridRef.current.getBoundingClientRect();
    const rows = letterGrid.length;
    const cols = letterGrid[0].length;
  
    // Calculate the dimensions of each cell within the actual grid
    const cellWidth = gridRect.width / cols;
    const cellHeight = gridRect.height / rows;
  
    // Get the position of the touch/click relative to the grid
    const relativeX = clientX - gridRect.left;
    const relativeY = clientY - gridRect.top;
  
    // Calculate the corresponding row and column indices
    const colIndex = Math.floor(relativeX / cellWidth);
    const rowIndex = Math.floor(relativeY / cellHeight);
  
    // Ensure the indices are within valid bounds of the grid
    if (
      rowIndex >= 0 &&
      rowIndex < rows &&
      colIndex >= 0 &&
      colIndex < cols
    ) {
      return {
        rowIndex,
        colIndex,
        letter: letterGrid[rowIndex][colIndex],
      };
    }
  
    return null;
  }, [letterGrid]);
  
  // Handle touch/mouse start for swipe
  const handleStart = useCallback((event) => {
    if (gameOver) return;
    
    // Prevent default to stop scrolling/selection
    event.preventDefault();
    
    // Determine touch point (works for both touch and mouse events)
    const clientX = event.type.includes('touch') 
      ? (event ).touches[0].clientX 
      : (event ).clientX;
    const clientY = event.type.includes('touch') 
      ? (event ).touches[0].clientY 
      : (event ).clientY;
    
    const cellAtPoint = getCellAtPoint(clientX, clientY);
    
    if (cellAtPoint) {
      isSwipingRef.current = true;
      setCurrentPath([{ 
        letter: cellAtPoint.letter, 
        row: cellAtPoint.rowIndex, 
        col: cellAtPoint.colIndex 
      }]);
      setFeedbackMessage(cellAtPoint.letter);
    }
  }, [gameOver, getCellAtPoint]);

  // Handle touch/mouse move for swipe
  const handleMove = useCallback((event) => {
    if (!isSwipingRef.current) return;
    const currentTime = Date.now();
    if (currentTime - lastMoveTime < throttleInterval) {
        return;
    }
    lastMoveTime = currentTime;
    
    // Prevent default to stop scrolling/selection
    event.preventDefault();
    
    // Determine touch point (works for both touch and mouse events)
    const clientX = event.type.includes('touch') 
      ? (event ).touches[0].clientX 
      : (event).clientX;
    const clientY = event.type.includes('touch') 
      ? (event ).touches[0].clientY 
      : (event ).clientY;
    
    const cellAtPoint = getCellAtPoint(clientX, clientY);
    
    if (cellAtPoint && currentPath.length > 0) {
      const lastCell = currentPath[currentPath.length - 1];

      if (isAdjacent(lastCell, cellAtPoint.rowIndex, cellAtPoint.colIndex) && isCellLastInPath(cellAtPoint.rowIndex,cellAtPoint.colIndex) ) {
        setCurrentPath(prevPath => prevPath.slice(0, -1));
        const word = currentPath.slice(0, -1).map(cell => cell.letter).join('');
        setFeedbackMessage(word);
      }
      // Check if the new cell is adjacent and not already in the path
      if (isAdjacent(lastCell, cellAtPoint.rowIndex, cellAtPoint.colIndex) &&
          !currentPath.some(cell => 
            cell.row === cellAtPoint.rowIndex && 
            cell.col === cellAtPoint.colIndex)) {
        
        // Add the new cell to the path
        setCurrentPath(prev => [
          ...prev, 
          { 
            letter: cellAtPoint.letter, 
            row: cellAtPoint.rowIndex, 
            col: cellAtPoint.colIndex 
          }
        ]);
        
        // Update feedback message
        const word = currentPath.map(cell => cell.letter).join('') + cellAtPoint.letter;
        setFeedbackMessage(word);
      }
    }
  }, [currentPath, isAdjacent, getCellAtPoint]);

  const isCellLastInPath = (rowIndex , colIndex) => {
    const lastCell = currentPath[currentPath.length - 2];
    return lastCell && lastCell.row === rowIndex && lastCell.col === colIndex;
  };

  // Handle touch/mouse end to finalize the swipe
  const handleEnd = useCallback((event) => {
    if (gameOver) return;
    
    // Prevent default to stop scrolling/selection
    event.preventDefault();
    
    isSwipingRef.current = false;

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

    // Reset the current path
    setCurrentPath([]);
  }, [gameOver, currentPath, validWords, wordList]);

  // Navigation
  const navigate = useNavigate();
  const handleMoveOn = () => {
    navigate('/wordle');
  };

  // Check if all words are found
  const allWordsFound = validWords.length === wordList.length;

  return (
    <Box 
      ref={containerRef}
      style={{ 
        userSelect: 'none', 
        touchAction: 'none', 
        overscrollBehavior: 'contain' 
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Time well spent
      </Typography>

      <Box 
        display="flex" 
        justifyContent="center" 
        mb={2}
        // Global touch and mouse handlers
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Grid2 container spacing={1} justifyContent="center" style={{ maxWidth: '260px' }} ref={gridRef}>
          {letterGrid.map((row, rowIndex) => (
            <Grid2 container item key={rowIndex} spacing={1} justifyContent="center">
              {row.map((letter, colIndex) => (
                <Grid2 item size={2} xs={2} key={colIndex}>
                  <Button
                    size="large"
                    style={{
                      minWidth: '10px',
                      width: '35px',
                      height: '40px',
                      fontSize: '20px',
                      backgroundColor:
                        currentPath.some(cell => cell.row === rowIndex && cell.col === colIndex)
                          ? 'blue'
                          : highlightedCells.some(cell => cell.row === rowIndex && cell.col === colIndex)
                          ? 'green'
                          : 'transparent',
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

      <Box display="flex" justifyContent="center">
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