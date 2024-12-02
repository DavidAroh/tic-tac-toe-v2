import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/Game.css';

const socket = io('https://tic-tac-toe-v2-zeta.vercel.app/'); // Adjust the URL if needed

function Game({ roomId, playerSymbol }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [leaderboard, setLeaderboard] = useState({ X: 0, O: 0 }); // Track scores

  useEffect(() => {
    socket.emit('join-room', { roomId, playerSymbol });

    socket.on('game-state', (state) => {
      setBoard(state.currentBoard);
      setCurrentPlayer(state.currentPlayer);
      setWinner(state.winner);
      setIsDraw(state.isDraw);
    });

    socket.on('leaderboard', (scores) => {
      setLeaderboard(scores); // Update leaderboard state
    });

    return () => {
      socket.off('game-state');
      socket.off('leaderboard');
    };
  }, [roomId, playerSymbol]);

  const handleClick = (index) => {
    if (board[index] || winner || currentPlayer !== playerSymbol) return;

    socket.emit('make-move', { roomId, index, symbol: playerSymbol });
  };

  const handleRematch = () => {
    socket.emit('rematch', { roomId });
  };

  return (
    <div className="game">
      <h2>Room: {roomId}</h2>
      <h3>Current Turn: Player {currentPlayer}</h3>

      <div className="leaderboard">
        <h3>Leaderboard</h3>
        <p>Player X: {leaderboard.X}</p>
        <p>Player O: {leaderboard.O}</p>
      </div>

      <div className="board">
        {board.map((value, index) => (
          <button key={index} className="square" onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>

      {winner && <h2>Player {winner} wins!</h2>}
      {isDraw && !winner && <h2>It's a draw!</h2>}
      {(winner || isDraw) && (
        <button className="rematch-button" onClick={handleRematch}>
          Rematch
        </button>
      )}
    </div>
  );
}

export default Game;
