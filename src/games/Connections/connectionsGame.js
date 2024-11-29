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
    for (const [groupName, groupWords] of Object.entries(groups)) {
      if (groupWords.every((word) => selected.includes(word))) {
        // Add the group to completed groups
        setCompletedGroups([
          ...completedGroups,
          { name: groupName, words: groupWords },
        ]);

        // Remove the group's words from the shuffled words list
        setShuffledWords((prevWords) =>
          prevWords.filter((word) => !groupWords.includes(word))
        );

        setMessage(`Correct! You found the group: ${groupName}.`);
        setSelected([]);
        return;
      }
    }

    // Handle incorrect selection
    const remainingLives = lives - 1;
    setLives(remainingLives);
    setMessage("Incorrect group. Try again!");
    setSelected([]);

    if (remainingLives === 0) {
      setGameOver(true);
    }
  };

  const isGameComplete = completedGroups.length === Object.keys(groups).length;

  return (
    <Box sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Connections Game
      </Typography>
      <Typography variant="body1" gutterBottom>
        Select four words that share a common connection. Lives remaining: {lives}
      </Typography>
      <Grid2 container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        {/* Render completed groups as single grid items */}
        {completedGroups.map((group) => (
          <Grid2 size={12} xs={12} key={group.name}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              disabled
              sx={{ height: '100%', textAlign: 'center', padding: 2 }}
            >
              <Typography variant="h6">{group.name}</Typography>
              <Typography variant="body2">{group.words.join(', ')}</Typography>
            </Button>
          </Grid2>
        ))}

        {/* Render remaining words */}
        {shuffledWords.map((word) => (
          <Grid2 size={3} xs={3} key={word}>
            <Button
              variant="contained"
              color={selected.includes(word) ? "primary" : "secondary"}
              onClick={() => handleWordClick(word)}
              fullWidth
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
              sx={{ marginRight: 2 }}
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
