import React from 'react';

export default function ChessLoadingOverlay() {
  return (
    <div className="chess-loader-page" role="status" aria-live="polite" aria-label="Loading">
      <div className="chess-loader-stage">
        <div className="chess-loader-board" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, index) => (
            // True checker pattern: color is based on row + column parity.
            <span
              key={index}
              className={`chess-loader-cell ${(Math.floor(index / 3) + (index % 3)) % 2 === 0 ? 'light' : 'dark'}`}
            />
          ))}
          <span className="chess-loader-rook" aria-hidden="true">♜</span>
        </div>
      </div>
    </div>
  );
}