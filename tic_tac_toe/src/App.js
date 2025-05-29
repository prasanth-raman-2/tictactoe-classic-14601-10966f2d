import React, { useState } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Square component to represent a single cell in the TicTacToe grid.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        color: value ? (value === "X" ? "#222222" : "#4caf50") : "#222222",
        background: highlight ? "#ccefd2" : "var(--ttt-bg, #fff)",
        boxShadow: highlight
          ? "0 0 0 2px #4caf50"
          : "0 0 0 1px var(--ttt-border, #ddd)",
      }}
      aria-label={value ? `Cell: ${value}` : "Empty cell"}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main TicTacToe game container.
 */
function TicTacToeGame() {
  // 0-8 are board cell indices
  const [squares, setSquares] = useState(Array(9).fill(null));
  // true = X's turn, false = O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // null = ongoing, "X"/"O" = winner, "draw" = draw
  const [gameStatus, setGameStatus] = useState(null);
  // Win cells (array of indices), for highlighting
  const [winLine, setWinLine] = useState(null);

  // Winning lines: each an array of indices in the board array
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];

  // Check for winner or draw
  function checkWinner(board) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return { winner: board[a], line };
      }
    }
    if (board.every(Boolean)) {
      return { winner: "draw", line: null };
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    // Don't process if already finished or occupied cell
    if (gameStatus || squares[idx]) return;

    const nextBoard = squares.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    const result = checkWinner(nextBoard);

    setSquares(nextBoard);

    if (result) {
      setGameStatus(result.winner === "draw" ? "draw" : result.winner);
      setWinLine(result.line);
    } else {
      setXIsNext((prev) => !prev);
    }
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus(null);
    setWinLine(null);
  }

  // UI strings
  const nextPlayer = xIsNext ? "X" : "O";
  let statusText;
  if (gameStatus === "draw") statusText = "It's a draw!";
  else if (gameStatus === "X" || gameStatus === "O")
    statusText = `Player ${gameStatus} wins!`;
  else statusText = `Game in progress`;

  return (
    <div className="ttt-outer-container">
      <div className="ttt-game-box">
        <div className="ttt-turn-label">
          {gameStatus
            ? (statusText)
            : `Current turn: `}
          {!gameStatus && (
            <span
              style={{
                color: nextPlayer === "X" ? "#222222" : "#4caf50",
                fontWeight: 700,
              }}
            >
              Player {nextPlayer}
            </span>
          )}
        </div>

        <div className="ttt-board">
          {Array(3)
            .fill(0)
            .map((_, row) => (
              <div key={row} className="ttt-board-row">
                {Array(3)
                  .fill(0)
                  .map((_, col) => {
                    const idx = 3 * row + col;
                    const highlight =
                      winLine && winLine.includes(idx);
                    return (
                      <Square
                        key={idx}
                        value={squares[idx]}
                        onClick={() => handleSquareClick(idx)}
                        highlight={highlight}
                      />
                    );
                  })}
              </div>
            ))}
        </div>
        <div className="ttt-controls">
          <div
            className="ttt-status"
            style={{
              color:
                gameStatus === "draw"
                  ? "#888"
                  : gameStatus === "X"
                  ? "#222"
                  : gameStatus === "O"
                  ? "#4caf50"
                  : "#222",
              fontWeight: 500,
              fontSize: "1.08rem",
            }}
          >
            {statusText}
          </div>
          <button
            className="ttt-reset-btn"
            type="button"
            onClick={resetGame}
            aria-label="Reset game"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App root
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="container">
          <div className="ttt-main-wrapper">
            <h1 className="ttt-title">Tic Tac Toe Classic</h1>
            <TicTacToeGame />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;