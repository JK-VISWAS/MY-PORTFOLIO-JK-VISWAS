import React, { useState, useEffect, useCallback } from 'react';

const Snake = ({ accentColor }) => {
  const initialSnake = [[10, 10], [10, 11], [10, 12]];
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState([5, 5]);
  const [dir, setDir] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // RESET FUNCTION
  const resetGame = () => {
    setSnake(initialSnake);
    setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
    setDir([0, -1]);
    setGameOver(false);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    if (gameOver) return;
    const newSnake = [...snake];
    const head = [newSnake[0][0] + dir[0], newSnake[0][1] + dir[1]];

    // Wall & Self Collision
    if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20 || 
        newSnake.some(s => s[0] === head[0] && s[1] === head[1])) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);
    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(prev => prev + 1);
      setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [snake, dir, food, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (dir[1] !== 1) setDir([0, -1]); break;
        case 'ArrowDown': if (dir[1] !== -1) setDir([0, 1]); break;
        case 'ArrowLeft': if (dir[0] !== 1) setDir([-1, 0]); break;
        case 'ArrowRight': if (dir[0] !== -1) setDir([1, 0]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-sm opacity-60 uppercase tracking-widest">Score: {score}</div>
      
      <div className="relative w-64 h-64 bg-black/40 border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        {snake.map((p, i) => (
          <div key={i} className="absolute w-[5%] h-[5%] rounded-sm" 
               style={{ left: `${p[0]*5}%`, top: `${p[1]*5}%`, backgroundColor: i === 0 ? '#fff' : accentColor }} />
        ))}
        <div className="absolute w-[5%] h-[5%] bg-red-500 rounded-full animate-pulse" 
             style={{ left: `${food[0]*5}%`, top: `${food[1]*5}%` }} />
        
        {/* GAME OVER OVERLAY WITH RESET */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <h2 className="text-red-500 font-bold text-xl mb-4">GAME OVER</h2>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all text-sm font-bold"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* MOBILE CONTROLS */}
      <div className="grid grid-cols-3 gap-2 mt-6">
        <div /> 
        <button onClick={() => setDir([0, -1])} className="p-4 bg-white/5 border border-white/10 rounded-xl active:bg-white/20 transition-all">▲</button> 
        <div />
        <button onClick={() => setDir([-1, 0])} className="p-4 bg-white/5 border border-white/10 rounded-xl active:bg-white/20 transition-all">◀</button>
        <button onClick={() => setDir([0, 1])} className="p-4 bg-white/5 border border-white/10 rounded-xl active:bg-white/20 transition-all">▼</button>
        <button onClick={() => setDir([1, 0])} className="p-4 bg-white/5 border border-white/10 rounded-xl active:bg-white/20 transition-all">▶</button>
      </div>
    </div>
  );
};

export default Snake;