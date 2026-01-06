import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TicTacToe = ({ accentColor }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);

  // AI Move logic
  useEffect(() => {
    if (!isXNext && !winner && board.includes(null)) {
      const timer = setTimeout(() => {
        const cpuMove = getBestMove(board);
        handleMove(cpuMove);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner]);

  const handleMove = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-lg font-bold">
        {winner ? `Winner: ${winner}` : `Next: ${isXNext ? 'You (X)' : 'CPU (O)'}`}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-white/5 p-2 rounded-xl">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMove(i)}
            className="w-20 h-20 bg-white/10 rounded-lg text-2xl font-bold flex items-center justify-center border border-white/5"
            style={{ color: cell === 'X' ? accentColor : '#FF9FFC' }}
          >
            {cell}
          </motion.button>
        ))}
      </div>
      <button
        onClick={() => setBoard(Array(9).fill(null))}
        className="mt-6 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-all"
      >
        Reset Game
      </button>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}

function getBestMove(squares) {
  const empty = squares.map((v, i) => v === null ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

export default TicTacToe;