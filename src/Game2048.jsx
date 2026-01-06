import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const Game2048 = ({ accentColor }) => {
  const [grid, setGrid] = useState([[2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    localStorage.getItem('2048-highscore') || 0
  );

  // Call this whenever the score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('2048-highscore', score);
    }
  }, [score]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // Prevents the webpage from scrolling while playing
        shift(e.key.replace("Arrow", "").charAt(0)); // Maps ArrowUp to 'U', etc.
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid]);

  const shift = (direction) => {
    let currentGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const rotateGrid = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]).reverse());

    // Standardize movement by rotating the grid so we always "shift left"
    if (direction === 'U') currentGrid = rotateGrid(rotateGrid(rotateGrid(currentGrid)));
    if (direction === 'R') currentGrid = rotateGrid(rotateGrid(currentGrid));
    if (direction === 'D') currentGrid = rotateGrid(currentGrid);

    const newGrid = currentGrid.map(row => {
      let newRow = row.filter(val => val !== 0); // Remove empty spaces
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) { // If two tiles match, merge them
          newRow[i] *= 2;
          newScore += newRow[i];
          newRow.splice(i + 1, 1);
          moved = true;
        }
      }
      while (newRow.length < 4) newRow.push(0); // Fill remaining space with zeros
      if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
      return newRow;
    });

    // Rotate back to original orientation
    let finalGrid = newGrid;
    if (direction === 'U') finalGrid = rotateGrid(newGrid);
    if (direction === 'R') finalGrid = rotateGrid(rotateGrid(newGrid));
    if (direction === 'D') finalGrid = rotateGrid(rotateGrid(rotateGrid(newGrid)));

    if (moved) {
      // Add a random 2 or 4 to an empty spot
      const empties = [];
      finalGrid.forEach((row, r) => row.forEach((val, c) => { if (val === 0) empties.push([r, c]); }));
      if (empties.length > 0) {
        const [r, c] = empties[Math.floor(Math.random() * empties.length)];
        finalGrid[r][c] = Math.random() > 0.1 ? 2 : 4;
      }
      setGrid(finalGrid);
      setScore(newScore);
    }
  };

  const handleResetGame = () => {
    setGrid([[2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-8 mb-4 justify-center">
        <div className="text-center">
          <p className="text-[10px] uppercase opacity-40">Current</p>
          <p className="text-xl font-bold">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase opacity-40 text-cyan-400">Best</p>
          <p className="text-xl font-bold text-cyan-400">{highScore}</p>
        </div>
      </div>
      
      {/* RESET BUTTON */}
      <div className="flex justify-center mb-4">
        <button 
          onClick={handleResetGame}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-all text-sm font-medium"
        >
          <RotateCcw size={16} />
          Reset Game
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
        {grid.flat().map((val, i) => (
          <div key={i} className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold ${val ? 'bg-white/20' : 'bg-white/5 opacity-20'}`} style={{ color: val ? accentColor : 'transparent' }}>
            {val || ''}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        {['L', 'U', 'D', 'R'].map(d => (
          <button key={d} onClick={() => shift(d)} className="w-10 h-10 bg-white/10 rounded-full border border-white/10 hover:bg-white/20 transition-all">{d}</button>
        ))}
      </div>
    </div>
  );
};

export default Game2048;