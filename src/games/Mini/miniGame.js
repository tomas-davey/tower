import React, { useState, useEffect, useRef } from 'react';
import { Container, Grid2, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MiniCrossword = () => {
  const navigate = useNavigate();

  const handleMoveOn = () => {
    navigate('/strands'); // Navigate to the first game
  };

  const [clues, setClues] = useState({
    across: [
      { number: 1, clue: "What you apparently always fail to make me do, but I do", answer: "LAUGH" },
      { number: 2, clue: "What I'm convinced you're made out of", answer: "VEGETABLE" },
      { number: 3, clue: "Weekend activities", answer: "RUNS" },
      { number: 4, clue: "The reason you come to my house", answer: "KITTY" },
    ],
    down: [
      { number: 1, clue: "The park where it began", answer: "GREEN" },
      { number: 2, clue: "The first word of your first whatsapp message to me", answer: "BOY" },
      { number: 3, clue: "What I am trying to convince you im pro at in winter", answer: "SKIER" },
      { number: 4, clue: "Gainz", answer: "GYM" },
    ]
  });

  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [userGuesses, setUserGuesses] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [disabledCells, setDisabledCells] = useState([]);
  const [solution, setSolution] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  const inputRefs = useRef([]);

  const generateCrossword = () => {
    const newGrid = Array(9).fill().map(() => Array(9).fill(''));
    const presetSolution = [
      ['L', 'A', 'U', 'G', 'H', '', '', '', ''],
      ['', '', '', 'R', '', '', '', '', ''],
      ['V', 'E', 'G', 'E', 'T', 'A', 'B', 'L', 'E'],
      ['', '', '', 'E', '', '', 'O', '', ''],
      ['', 'R', 'U', 'N', 'S', '', 'Y', '', ''],
      ['', '', '', '', 'K', '', '', 'G', ''],
      ['', '', '', 'K', 'I', 'T', 'T', 'Y', ''],
      ['', '', '', '', 'E', '', '', 'M', ''],
      ['', '', '', '', 'R', '', '', '', ''],
    ];

    // Define clue positions (across and down)
    const acrossClues = [
      { start: [0, 0], word: 'LAUGH', number: 1 },
      { start: [2, 0], word: 'VEGETABLE', number: 2 },
      { start: [4, 1], word: 'RUNS', number: 3 },
      { start: [6, 3], word: 'KITTY', number: 4 }
    ];

    const downClues = [
      { start: [0, 3], word: 'GREEN', number: 1 },
      { start: [2, 6], word: 'BOY', number: 2 },
      { start: [4, 4], word: 'SKIER', number: 3 },
      { start: [5, 7], word: 'GYM', number: 4 }
    ];

    // Place clue numbers in the grid for across and down
    acrossClues.forEach(({ start, number }) => {
      const [r, c] = start;
      newGrid[r][c] = number.toString(); // Set clue number in the starting position
    });

    downClues.forEach(({ start, number }) => {
      const [r, c] = start;
      newGrid[r][c] = number.toString(); // Set clue number in the starting position
    });

    // Define cells to disable based on blacked-out ones
    const newDisabledCells = [
      [0, 5], [0, 6], [0, 7], [0, 8], 
      [1, 0], [1, 1], [1, 2], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
      [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 7], [3, 8],
      [4, 0], [4, 5], [4, 7], [4, 8],
      [5, 0], [5, 1], [5, 2], [5, 3], [5, 5], [5, 6], [5, 8],
      [6, 0], [6, 1], [6, 2], [6, 8],
      [7, 0], [7, 1], [7, 2], [7, 3], [7, 6], [7, 8], [7, 5],
      [8, 0], [8, 1], [8, 2], [8, 3], [8, 5], [8, 6], [8, 7], [8, 8]
    ];

    setSolution(presetSolution);
    setGrid(newGrid);
    setUserGuesses(Array(9).fill().map(() => Array(9).fill('')));
    setDisabledCells(newDisabledCells);
    setIsSolved(false);
  };

  const handleCellChange = (row, col, value) => {
    if (disabledCells.some(cell => cell[0] === row && cell[1] === col)) {
      return;
    }

    const newGuesses = [...userGuesses];
    newGuesses[row][col] = value.toUpperCase();
    setUserGuesses(newGuesses);

    const allCorrect = solution.every((row, rowIndex) =>
      row.every((cell, colIndex) =>
        cell === '' || cell === newGuesses[rowIndex][colIndex]
      )
    );
    setIsSolved(allCorrect);

    // Move to the next available cell
    const nextCell = getNextCell(row, col);
    if (nextCell) {
      const [nextRow, nextCol] = nextCell;
      inputRefs.current[`${nextRow}-${nextCol}`].focus();
    }
  };

  const getNextCell = (row, col) => {
    // Find the next available cell (skipping disabled cells)
    for (let r = row; r < 9; r++) {
      for (let c = col + 1; c < 9; c++) {
        if (!disabledCells.some(cell => cell[0] === r && cell[1] === c)) {
          return [r, c];
        }
      }
    }
    return null;
  };

  useEffect(() => {
    generateCrossword();
  }, []);

  return (
    <Container maxWidth="md" justifyContent="center">
      <Typography variant="h4" gutterBottom align="center" sx={{ my: 3 }}>
        Mini Crossword Puzzle
      </Typography>

      <Grid2 
        container 
        spacing={0} 
        sx={{ mb: 3, maxWidth: '300px', mx: 'auto' }}
      >
        {userGuesses.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Grid2 item size={12 / 9} xs={1} key={`${rowIndex}-${colIndex}`} sx={{ position: 'relative' }}>
              {/* Display clue numbers */}
              {(grid[rowIndex][colIndex] && !userGuesses[rowIndex][colIndex]) && (
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#000',
                  }}
                >
                  {grid[rowIndex][colIndex]}
                </Typography>
              )}

              {/* TextField for user input */}
              <TextField 
                variant="outlined"
                InputProps={{
                  style: {
                    padding: '0px',
                    width: '30px',
                    height: '30px',
                    textAlign: 'center',
                    fontSize: '12px',
                    backgroundColor: disabledCells.some(c => c[0] === rowIndex && c[1] === colIndex) ? '#000' : '',
                  }
                }}
                inputProps={{
                  maxLength: 1,
                  style: { 
                    padding: '0',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }
                }}
                value={cell}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                disabled={disabledCells.some(c => c[0] === rowIndex && c[1] === colIndex)} // Disable input
                inputRef={(el) => inputRefs.current[`${rowIndex}-${colIndex}`] = el}
              />
            </Grid2>
          ))
        ))}
      </Grid2>

      <Grid2 container spacing={2} sx={{ display: 'flex', flexDirection: 'row', mb: 3, width: '100%', maxWidth: '700px', mx: 'auto', justifyContent:'center' }}>
        <Grid2 item xs={12} md={6} minWidth='200px'>
          <Typography variant="h6">Across</Typography>
          {clues.across.map((clue, index) => (
            <Typography key={index} variant="body1">
              {clue.number}. {clue.clue}
            </Typography>
          ))}
        </Grid2>

        <Grid2 item xs={12} md={6} minWidth='250px'>
          <Typography variant="h6">Down</Typography>
          {clues.down.map((clue, index) => (
            <Typography key={index} variant="body1">
              {clue.number}. {clue.clue}
            </Typography>
          ))}
        </Grid2>
      </Grid2>

      <Box sx={{ mt: 3, justifyContent: 'space-between', alignItems: 'center' }}>
        {isSolved && (
          <>
           <Alert severity={'success'}>
           Congratulations! Puzzle Solved!
          </Alert>
           
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
      </Box>
    </Container>
  );
};

export default MiniCrossword;
