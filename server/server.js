const io = require('socket.io')(4000, {
  cors: {
    origin: '*',
  },
});

const games = {}; // Store game states
const scores = {}; // Track scores for leaderboard

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', ({ roomId, playerSymbol }) => {
    socket.join(roomId);

    if (!games[roomId]) {
      games[roomId] = {
        currentBoard: Array(9).fill(null),
        currentPlayer: 'X',
        winner: null,
        isDraw: false,
      };
    }

    // Initialize scores for the room if not already set
    if (!scores[roomId]) {
      scores[roomId] = { X: 0, O: 0 };
    }

    io.to(roomId).emit('game-state', games[roomId]);
    io.to(roomId).emit('leaderboard', scores[roomId]);
  });

  socket.on('make-move', ({ roomId, index, symbol }) => {
    const game = games[roomId];

    if (!game || game.winner || game.currentBoard[index]) return;

    if (game.currentPlayer === symbol) {
      game.currentBoard[index] = symbol;

      const winner = checkWinner(game.currentBoard);
      if (winner) {
        game.winner = winner;
        scores[roomId][winner] += 1; // Update score for the winner
      } else if (game.currentBoard.every((cell) => cell !== null)) {
        game.isDraw = true;
      } else {
        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
      }

      io.to(roomId).emit('game-state', game);
      io.to(roomId).emit('leaderboard', scores[roomId]);
    }
  });

  socket.on('rematch', ({ roomId }) => {
    if (games[roomId]) {
      games[roomId] = {
        currentBoard: Array(9).fill(null),
        currentPlayer: 'X',
        winner: null,
        isDraw: false,
      };

      io.to(roomId).emit('game-state', games[roomId]);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

function checkWinner(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}
