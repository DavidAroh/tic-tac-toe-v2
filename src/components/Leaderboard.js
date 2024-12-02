import React from 'react';

const Leaderboard = ({ scores }) => {
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {Object.entries(scores).map(([player, score], index) => (
          <li key={index}>
            {player}: {score} wins
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
