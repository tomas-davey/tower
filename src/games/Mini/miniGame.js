import React, { useState, useEffect } from 'react';
import { Container, Grid2, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MiniCrossword = () => {
  const navigate = useNavigate();
    // Clues for across and down words (5-letter words)
    const handleMoveOn = () => {
      navigate('/strands'); // Navigate to the first game
    };

    const [clues, setClues] = useState({
        across: [
            { number: 1, clue: "Celestial body that gives light", answer: "STARS" },
            { number: 2, clue: "Melody's emotional core", answer: "HEART" },
            { number: 3, clue: "Place of rest for travelers", answer: "HOTEL" },
            { number: 4, clue: "Ancient writing material", answer: "PAPYR" },
            { number: 5, clue: "Small stringed instrument", answer: "BANJO" }
        ],
        down: [
            { number: 1, clue: "Cheerful greeting", answer: "SMILE" },
            { number: 2, clue: "Soaring bird of prey", answer: "HAWK" },
            { number: 3, clue: "Sweet sticky substance", answer: "HONEY" },
            { number: 4, clue: "Vehicle with two wheels", answer: "BIKE" },
            { number: 5, clue: "Cooking vessel", answer: "POT" }
        ]
    });

    // State for the grid
    const [grid, setGrid] = useState(Array(5).fill().map(() => Array(5).fill('')));
    
    // State for user's guesses
    const [userGuesses, setUserGuesses] = useState(Array(5).fill().map(() => Array(5).fill('')));

    // Solution grid (for checking answers)
    const [solution, setSolution] = useState(null);

    // Check if the puzzle is solved
    const [isSolved, setIsSolved] = useState(false);

    // Generate the crossword puzzle
    const generateCrossword = () => {
        // Predefined grid layout that ensures intersections
        const newGrid = Array(5).fill().map(() => Array(5).fill(''));
        const presetSolution = [
            ['C', 'L', 'U', 'E', '1'],
            ['C', 'L', 'U', 'E', '2'],
            ['C', 'L', 'U', 'E', '3'],
            ['C', 'L', 'U', 'E', '4'],
            ['C', 'L', 'U', 'E', '5'],
        ];

        setSolution(presetSolution);
        setGrid(presetSolution);
        setUserGuesses(Array(5).fill().map(() => Array(5).fill('')));
        setIsSolved(false);
    };

    // Handle user input in grid cells
    const handleCellChange = (row, col, value) => {
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
                sx={{ mb: 3, width: '100%', maxWidth: '400px', mx: 'auto' }}
            >
                {userGuesses.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <Grid2 item size={12/5} spacing={5} key={`${rowIndex}-${colIndex}`}>
                            <TextField 
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        width: '50px',
                                        height: '50px',
                                        textAlign: 'center',
                                        fontSize: '24px',
                                    }
                                }}
                                inputProps={{
                                    maxLength: 1,
                                    style: { 
                                        textAlign: 'center',
                                        textTransform: 'uppercase'
                                    }
                                }}
                                value={cell}
                                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            />
                        </Grid2>
                    ))
                ))}
            </Grid2>

            {/* Clues Section */}
            <Grid2 container spacing={2}   sx={{ display: 'flex', flexDirection: 'row', mb: 3, width: '100%', maxWidth: '700px', mx: 'auto', justifyContent:'center' }}>
                {/* Across Clues */}
                <Grid2 item xs={12} md={6} minWidth='250px'>
                    <Typography variant="h6"  >Across</Typography>
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