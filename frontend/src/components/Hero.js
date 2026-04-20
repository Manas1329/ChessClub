import React from 'react';

export default function Hero() {
  return (
    <div className="imgbox">
      <img src="/media/Chess2.jpg" alt="Chess" />
      <div className="overlay">
        <h1>Welcome to ChessClub</h1>
        <h2>Where Strategy Meets Community</h2>
      </div>
      <div className="scroll-indicator">
        <span className="arrow">&#8595;</span>
      </div>
    </div>
  );
}
