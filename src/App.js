import React, { useState } from 'react';
import Game from './components/Game';
import { v4 as uuidv4 } from 'uuid'; 
import './App.css';

function App() {
  const [roomId, setRoomId] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isEnteringRoom, setIsEnteringRoom] = useState(false);

  const createRoom = () => {
    const newRoomId = uuidv4(); // Generate a unique room ID
    setRoomId(newRoomId);
    setIsCreatingRoom(true);
  };

  const enterRoom = () => {
    setIsEnteringRoom(true);
  };

  const startGame = (id, symbol) => {
    setRoomId(id);
    setPlayerSymbol(symbol);
  };

  return (
    <div className="App">
      {roomId && playerSymbol ? (
        <Game roomId={roomId} playerSymbol={playerSymbol} />
      ) : (
        <div className="start-screen">
          {!isCreatingRoom && !isEnteringRoom ? (
            <div>
              <h2>Welcome to Multiplayer Tic Tac Toe</h2>
              <button onClick={createRoom}>Create Room</button>
              <button onClick={enterRoom}>Enter Room</button>
            </div>
          ) : (
            <>
              {isCreatingRoom ? (
                <div>
                  <h3>Your Room ID: {roomId}</h3>
                  <div>
                    <button onClick={() => startGame(roomId, 'X')}>
                      Play as X
                    </button>
                    <button onClick={() => startGame(roomId, 'O')}>
                      Play as O
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                  <div>
                    <button onClick={() => startGame(roomId, 'X')}>
                      Play as X
                    </button>
                    <button onClick={() => startGame(roomId, 'O')}>
                      Play as O
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
