import React, { useState, useEffect } from 'react';
import { Typography, Grid2, Button, Box } from '@mui/material';
import { connectionsData } from './connectionsData';
import { useNavigate } from 'react-router-dom';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ConnectionsGame = () => {
  const { words, groups } = connectionsData;
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selected, setSelected] = useState([]);
  const [completedGroups, setCompletedGroups] = useState([]);
  const [lives, setLives] = useState(4);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShuffledWords(shuffleArray(words)); // Shuffle words on initial render
    console.log(words)
  }, [words]);

  const handleMoveOn = () => {
    navigate('/spelling-bee'); // Navigate to the next game
  };

  const handleWordClick = (word) => {
    if (selected.includes(word)) {
      setSelected(selected.filter((item) => item !== word)); // Deselect if already selected
    } else if (selected.length < 4) {
      setSelected([...selected, word]); // Add to selected list only if fewer than 4 words are selected
    }
  };

  const checkSelection = () => {
    // Iterate through all groups
    for (const [groupName, groupWords] of Object.entries(groups)) {
      const selectedWordsInGroup = selected.filter((word) => groupWords.includes(word));
  
      if (selectedWordsInGroup.length === 4) {
        // If all 4 words of the group are selected correctly
        setCompletedGroups([ ...completedGroups, { name: groupName, words: groupWords } ]);
        setShuffledWords((prevWords) => prevWords.filter((word) => !groupWords.includes(word)));
        setMessage(`Correct! You found the group: ${groupName}.`);
        setSelected([]);
        return;
      } else if (selectedWordsInGroup.length === 3) {
        // If the player selects 3 words of a group, let them know they're 1 word away
        setMessage("You're 1 word away from completing a group!");
        const remainingLives = lives - 1;
        setLives(remainingLives);
        if (remainingLives === 0) {
          setGameOver(true);
        }
        return;
      }
    }
  
    // Handle incorrect selection
    const remainingLives = lives - 1;
    setLives(remainingLives);
    setMessage("Incorrect group. Try again!");
  
    if (remainingLives === 0) {
      setGameOver(true);
    }
  };

  const isGameComplete = completedGroups.length === Object.keys(groups).length;

  return (
    <Box sx={{ textAlign: 'center', justifyContent: "center", marginTop: 4, padding: { sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '2rem' } }}>
        Connections Game
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.2rem' } }}>
        Select four words that share a common connection. Lives remaining: {lives}
      </Typography>
      <Grid2 container spacing={1}  sx={{ marginTop: 2, maxWidth: '700px' }}>
        {/* Render completed groups as single grid items */}
        {completedGroups.map((group) => (
          <Grid2 item size={12} key={group.name}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              disabled
              sx={{
                height: '100%',
                textAlign: 'center',
                padding: 2,
                fontSize: { xs: '0.75rem', sm: '1rem' },  // Smaller font size
              }}
            >
              <Typography variant="h6" sx={{px: '8px'}}>{group.name}</Typography>
              <Typography variant="body2">{group.words.join(', ')}</Typography>
            </Button>
          </Grid2>
        ))}

        {/* Render remaining words */}
        {shuffledWords.map((word) => (
          <Grid2 item size={3} key={word}> {/* xs={3} ensures a 4x4 grid */}
            <Button
              variant="contained"
              color={selected.includes(word) ? "primary" : "secondary"}
              onClick={() => handleWordClick(word)}
              fullWidth
              sx={{
                fontSize: { xs: '0.75rem', sm: '1rem' },  // Smaller font size for mobile
                padding: { xs: '8px', sm: '12px' },  // Reduced padding for compact look
                whiteSpace: 'nowrap',  // Prevent word wrapping
              }}
            >
              {word}
            </Button>
          </Grid2>
        ))}
      </Grid2>
      <Box sx={{ marginTop: 4 }}>
        {!gameOver && !isGameComplete && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={checkSelection}
              disabled={selected.length !== 4}
              sx={{
                marginRight: 2,
                fontSize: { xs: '0.75rem', sm: '1rem' },
                padding: { xs: '8px', sm: '12px' },
              }}
            >
              Check Group
            </Button>
            <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
              {message}
            </Typography>
          </>
        )}
        {isGameComplete && (
          <>
            <Typography variant="h5" color="success.main" sx={{ marginTop: 2 }}>
              Congratulations! You solved all groups!
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
        {gameOver && (
          <>
            <Typography variant="h5" color="error" sx={{ marginTop: 2 }}>
              Game Over! You ran out of lives.
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              Here are the correct groups:
            </Typography>
            {Object.entries(groups).map(([groupName, groupWords]) => (
              <Box key={groupName} sx={{ marginTop: 2 }}>
                <Typography variant="h6">{groupName}:</Typography>
                <Typography variant="body2">{groupWords.join(', ')}</Typography>
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ConnectionsGame;
