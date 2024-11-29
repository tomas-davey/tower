import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ConnectionsGame from './games/Connections/connectionsGame.js'
import SpellingBeeGame from './games/SpellingBee/spellingBeeGame.js';
import FinishPage from './pages/FinishPage.js';
import MiniCrossword from './games/Mini/miniGame.js';
import Strands from './games/Strands/strands.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/connections" 
               element={
                 <GamePage>
                    <ConnectionsGame />
                 </GamePage>
               } 
        />
          <Route path="/spelling-bee" 
               element={
                 <GamePage>
                   <SpellingBeeGame />
                 </GamePage>
               } 
        />
          <Route path="/mini" 
               element={
                 <GamePage>
                   <MiniCrossword />
                 </GamePage>
               } 
        />
         <Route path="/strands" 
               element={
                 <GamePage>
                   <Strands />
                 </GamePage>
               } 
        />
         <Route path="/finish" element={<FinishPage />} />
      </Routes>
    </Router>
  );
};

export default App;
