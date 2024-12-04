import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

const MinuteCryptic = () => {
  const [clue, setClue] = useState("Inside Hannah's and Tom's heads is an artists missing piece on love (5)");
  const [answer, setAnswer] = useState("HEART"); // The correct answer
  const [input, setInput] = useState(Array(answer.length).fill(""));
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  // Handles user input in the individual boxes
  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Ensure only one letter per box
    const updatedInput = [...input];
    updatedInput[index] = value.toUpperCase(); // Enforce uppercase letters
    setInput(updatedInput);
  };

  // Validates the user's guess
  const checkGuess = () => {
    const userGuess = input.join("");
    if (userGuess === answer) {
      setFeedback("Correct! 🎉");
    } else {
      setFeedback("Try Again! ❌");
    }
  };

  // Handle navigation to /finish
  const handleMoveOn = () => {
    navigate("/finish");
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", py: 0, px: 0 }}>
      <Typography variant="h4" gutterBottom>
        Minute Cryptic
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Clue:</strong> {clue}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 0,
          mb: 2,
        }}
      >
        {input.map((letter, index) => (
          <TextField
            key={index}
            value={letter}
            onChange={(e) => handleInputChange(index, e.target.value)}

            sx={{
                padding: 0,
              width: { xs: "30px", sm: "40px", md: "70px" }, // Responsive widths
              minWidth: "40px", // Minimum width to prevent squeezing
              "& .MuiInputBase-input": {
                textTransform: "uppercase",
              },
            }}
            variant="outlined"
            size="small"
          />
        ))}
      </Box>
      <Button
        onClick={checkGuess}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Check Guess
      </Button>
      {feedback && (
        <Box mt={2}>
          <Alert severity={feedback === "Correct! 🎉" ? "success" : "error"}>
            {feedback}
          </Alert>
          {feedback === "Correct! 🎉" && (
            <Button
              onClick={handleMoveOn}
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
            >
              Move On
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default MinuteCryptic;
