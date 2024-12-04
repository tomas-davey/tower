import React, { useState, useEffect } from 'react';
import { Container, Grid2, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MiniCrossword = () => {
  const navigate = useNavigate();

  // Clues for across and down words (9-letter words)
  const handleMoveOn = () => {
    navigate('/strands'); // Navigate to the first game
  };

  const [clues, setClues] = useState({
    across: [
      { number: 1, clue: "LAUGH", answer: "LAUGH" },
      { number: 2, clue: "VEGETABLE", answer: "VEGETABLE" },
      { number: 3, clue: "RUNS", answer: "RUNS" },
      { number: 4, clue: "KITTY", answer: "KITTY" },
    ],
    down: [
      { number: 1, clue: "GREEN", answer: "GREEN" },
      { number: 2, clue: "BOY", answer: "BOY" },
      { number: 3, clue: "SKIER", answer: "SKIER" },
      { number: 4, clue: "GYM", answer: "GYM" },
    ]
  });

  // State for the grid (9x9)
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [userGuesses, setUserGuesses] = useState(Array(9).fill().map(() => Array(9).fill('')));

  // Black-out cells
  const [disabledCells, setDisabledCells] = useState([]);

  // Solution grid (for checking answers)
  const [solution, setSolution] = useState(null);

  // Check if the puzzle is solved
  const [isSolved, setIsSolved] = useState(false);

  // Generate the crossword puzzle (now 9x9)
  const generateCrossword = () => {
    // Predefined grid layout with some blacked-out cells (example)
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

    // Define which cells to disable (black-out cells)
    const newDisabledCells = [
      [0, 5], [0, 6], [0, 7], [0, 8], // Disable certain cells
      [1, 0],[1, 1], [1, 2], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
      [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 7], [3, 8],
      [4, 0], [4, 5], [4, 7], [4, 8],
      [5, 0], [5, 1], [5, 2], [5, 3], [5, 5], [5, 6], [5, 8],
      [6, 0], [6, 1], [6, 2], [6, 8],
      [7, 0], [7, 1], [7, 2], [7, 3], [7, 6], [7, 8], [7, 5],
      [8, 0], [8, 1], [8, 2], [8,3], [8, 5], [8, 6], [8, 7], [8,8]
    ];

    setSolution(presetSolution);
    setGrid(newGrid);
    setUserGuesses(Array(9).fill().map(() => Array(9).fill('')));
    setDisabledCells(newDisabledCells);
    setIsSolved(false);
  };

  // Handle user input in grid cells
  const handleCellChange = (row, col, value) => {
    if (disabledCells.some(cell => cell[0] === row && cell[1] === col)) {
      return; // Don't allow input on blacked-out cells
    }

    const newGuesses = [...userGuesses];
    newGuesses[row][col] = value.toUpperCase();
    setUserGuesses(newGuesses);

    // Check if puzzle is solved
    const allCorrect = solution.every((row, rowIndex) => 
      row.every((cell, colIndex) => 
        cell === '' || cell === newGuesses[rowIndex][colIndex]
      )
    );
    setIsSolved(allCorrect);
  };

  // Initialize the puzzle on component mount
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
            <Grid2 item       size={12/9} xs={1} key={`${rowIndex}-${colIndex}`}>
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
              />
            </Grid2>
          ))
        ))}
      </Grid2>

      {/* Clues Section */}
      <Grid2 container spacing={2} sx={{ display: 'flex', flexDirection: 'row', mb: 3, width: '100%', maxWidth: '700px', mx: 'auto', justifyContent:'center' }}>
        {/* Across Clues */}
        <Grid2 item xs={12} md={6} minWidth='250px'>
          <Typography variant="h6">Across</Typography>
          {clues.across.map((clue, index) => (
            <Typography key={index} variant="body1">
              {clue.number}. {clue.clue}
            </Typography>
          ))}
        </Grid2>

        {/* Down Clues */}
        <Grid2 item xs={12} md={6} minWidth='250px'>
          <Typography variant="h6">Down</Typography>
          {clues.down.map((clue, index) => (
            <Typography key={index} variant="body1">
              {clue.number}. {clue.clue}
            </Typography>
          ))}
        </Grid2>
      </Grid2>

      {/* Solve Status and Buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isSolved && (
          <>
            <Typography color="success.main" variant="h6">
              Congratulations! Puzzle Solved!
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
      </Box>
    </Container>
  );
};

export default MiniCrossword;
