import React, { useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Marker = 'X' | 'O';
type CellValue = Marker | null;
type Board = [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue];
type GameStatus = 'playing' | 'winner' | 'draw';

interface GameState {
  board: Board;
  status: GameStatus;
  winner: Marker | null;
  winningLine: number[] | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WINNING_COMBINATIONS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];

// ─── Pure Helpers ─────────────────────────────────────────────────────────────

function detectWinner(board: Board): { winner: Marker; line: number[] } | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Marker, line: combo };
    }
  }
  return null;
}

function detectDraw(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

function getCurrentPlayer(board: Board): Marker {
  const filled = board.filter((cell) => cell !== null).length;
  return filled % 2 === 0 ? 'X' : 'O';
}

// ─── useGame Hook ─────────────────────────────────────────────────────────────

function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    board: [...EMPTY_BOARD] as Board,
    status: 'playing',
    winner: null,
    winningLine: null,
  });

  const currentPlayer = getCurrentPlayer(gameState.board);

  const playMove = useCallback((index: number) => {
    setGameState((prev) => {
      // VR-05, VR-06: reject if game is over
      if (prev.status !== 'playing') return prev;
      // VR-01: reject if cell is occupied
      if (prev.board[index] !== null) return prev;

      const newBoard = prev.board.slice() as Board;
      const player = getCurrentPlayer(prev.board);
      // VR-02, VR-04: place current player marker
      newBoard[index] = player;

      // VR-08: check for winner
      const winResult = detectWinner(newBoard);
      if (winResult) {
        return {
          board: newBoard,
          status: 'winner',
          winner: winResult.winner,
          winningLine: winResult.line,
        };
      }

      // VR-09: check for draw
      if (detectDraw(newBoard)) {
        return {
          board: newBoard,
          status: 'draw',
          winner: null,
          winningLine: null,
        };
      }

      // VR-04: switch turn
      return {
        board: newBoard,
        status: 'playing',
        winner: null,
        winningLine: null,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setGameState({
      board: [...EMPTY_BOARD] as Board,
      status: 'playing',
      winner: null,
      winningLine: null,
    });
  }, []);

  return {
    board: gameState.board,
    status: gameState.status,
    currentPlayer,
    winner: gameState.winner,
    winningLine: gameState.winningLine,
    isDraw: gameState.status === 'draw',
    playMove,
    reset,
  };
}

// ─── Cell Component ───────────────────────────────────────────────────────────

interface CellProps {
  value: CellValue;
  index: number;
  isWinningCell: boolean;
  isDisabled: boolean;
  onCellClick: (index: number) => void;
}

function Cell({ value, index, isWinningCell, isDisabled, onCellClick }: CellProps) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const valueLabel = value ?? 'empty';
  const ariaLabel = `Row ${row}, Column ${col}, ${valueLabel}`;

  const handleClick = () => {
    onCellClick(index);
  };

  let className = 'board__cell';
  if (value) className += ` board__cell--filled board__cell--${value.toLowerCase()}`;
  if (isWinningCell) className += ' board__cell--winning';
  if (isDisabled || value !== null) className += ' board__cell--disabled';

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
      disabled={isDisabled || value !== null}
    >
      {value}
    </button>
  );
}

// ─── Board Component ──────────────────────────────────────────────────────────

interface BoardProps {
  board: Board;
  winningLine: number[] | null;
  isDisabled: boolean;
  onCellClick: (index: number) => void;
}

function Board({ board, winningLine, isDisabled, onCellClick }: BoardProps) {
  return (
    <section
      className="board"
      role="grid"
      aria-label="Tic-Tac-Toe board"
    >
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          index={index}
          isWinningCell={winningLine ? winningLine.includes(index) : false}
          isDisabled={isDisabled}
          onCellClick={onCellClick}
        />
      ))}
    </section>
  );
}

// ─── Status Component ─────────────────────────────────────────────────────────

interface StatusProps {
  status: GameStatus;
  currentPlayer: Marker;
  winner: Marker | null;
}

function Status({ status, currentPlayer, winner }: StatusProps) {
  let message = '';
  let className = 'status';

  if (status === 'playing') {
    message = `${currentPlayer}'s turn`;
  } else if (status === 'winner' && winner) {
    message = `${winner} wins!`;
    className += ' status--win';
  } else if (status === 'draw') {
    message = "It's a draw!";
    className += ' status--draw';
  }

  return (
    <p
      className={className}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </p>
  );
}

// ─── ResetButton Component ────────────────────────────────────────────────────

interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      type="button"
      className="reset-button"
      onClick={onReset}
    >
      Reset
    </button>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const styles = `
  :root {
    --color-marker-x: #38bdf8;
    --color-marker-o: #fb7185;
    --color-accent-primary: #6366f1;
    --color-accent-primary-hover: #4f46e5;
    --color-accent-focus-ring: #818cf8;
    --color-bg-app: #0f172a;
    --color-bg-board: #111827;
    --color-bg-cell: #1f2937;
    --color-bg-cell-hover: #374151;
    --color-bg-surface: #1e293b;
    --color-border-default: #334155;
    --color-border-strong: #475569;
    --color-text-primary: #f8fafc;
    --color-text-secondary: #94a3b8;
    --color-text-muted: #64748b;
    --color-text-on-accent: #ffffff;
    --color-state-win: #22c55e;
    --color-state-draw: #eab308;
    --color-state-win-background: #14532d;
    --border-radius-board: 1rem;
    --border-radius-cell: 0.5rem;
    --border-radius-button: 0.5rem;
    --shadow-board: 0 12px 32px rgba(0, 0, 0, 0.45);
    --shadow-focus: 0 0 0 3px rgba(129, 140, 248, 0.6);
    --font-family-base: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    --font-size-title: 2.5rem;
    --font-size-xl: 1.5rem;
    --font-size-lg: 1.25rem;
    --font-size-base: 1rem;
    --font-size-sm: 0.875rem;
    --font-size-xs: 0.75rem;
    --font-size-marker: 3rem;
    --font-weight-bold: 700;
    --font-weight-semibold: 600;
    --font-weight-medium: 500;
    --font-weight-regular: 400;
    --letter-spacing-tight: -0.02em;
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --transition-base: 180ms ease-out;
    --transition-fast: 120ms ease-out;
    --transition-cell: background-color 120ms ease-out, transform 120ms ease-out;
    --transition-button: background-color 180ms ease-out, box-shadow 180ms ease-out;
    --board-size: min(90vw, 420px);
    --cell-size: min(28vw, 128px);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-family-base);
    background: var(--color-bg-app);
    color: var(--color-text-primary);
    min-height: 100vh;
  }

  .game-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: var(--spacing-lg);
    background: var(--color-bg-app);
    color: var(--color-text-primary);
    font-family: var(--font-family-base);
  }

  .game-page__header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }

  .game-page__title {
    font-size: var(--font-size-title);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-tight);
    color: var(--color-text-primary);
  }

  .game-page__subtitle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
  }

  .game-page__main {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .status {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    min-height: 1.75rem;
    text-align: center;
    color: var(--color-text-primary);
    transition: color var(--transition-base);
  }

  .status--win {
    color: var(--color-state-win);
  }

  .status--draw {
    color: var(--color-state-draw);
  }

  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
    width: var(--board-size);
    aspect-ratio: 1 / 1;
    background: var(--color-bg-board);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-board);
    box-shadow: var(--shadow-board);
  }

  .board__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-cell);
    border: 1px solid var(--color-border-default);
    border-radius: var(--border-radius-cell);
    font-size: var(--font-size-marker);
    font-weight: var(--font-weight-bold);
    font-family: var(--font-family-base);
    aspect-ratio: 1 / 1;
    cursor: pointer;
    color: var(--color-text-primary);
    transition: var(--transition-cell);
    outline: none;
  }

  .board__cell:hover:not(.board__cell--disabled) {
    background: var(--color-bg-cell-hover);
    transform: scale(1.02);
  }

  .board__cell:focus-visible {
    box-shadow: var(--shadow-focus);
    outline: none;
  }

  .board__cell--x {
    color: var(--color-marker-x);
  }

  .board__cell--o {
    color: var(--color-marker-o);
  }

  .board__cell--winning {
    background: var(--color-state-win-background);
    border-color: var(--color-state-win);
  }

  .board__cell--disabled {
    cursor: default;
  }

  .board__cell--filled {
    cursor: default;
  }

  .board__cell:disabled {
    cursor: default;
    opacity: 1;
  }

  .reset-button {
    background: var(--color-accent-primary);
    color: var(--color-text-on-accent);
    border: none;
    border-radius: var(--border-radius-button);
    padding: 0.75rem 1.5rem;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    font-family: var(--font-family-base);
    cursor: pointer;
    transition: var(--transition-button);
    outline: none;
  }

  .reset-button:hover {
    background: var(--color-accent-primary-hover);
  }

  .reset-button:focus-visible {
    box-shadow: var(--shadow-focus);
    outline: none;
  }

  .game-page__footer {
    margin-top: var(--spacing-xl);
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
    text-align: center;
  }

  @media (max-width: 480px) {
    .game-page__title {
      font-size: 2rem;
    }

    .board__cell {
      font-size: 2.25rem;
    }
  }
`;

// ─── StyleInjector ────────────────────────────────────────────────────────────

function useStyles(css: string) {
  const id = 'game-page-styles';
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// ─── GamePage ─────────────────────────────────────────────────────────────────

export default function GamePage() {
  useStyles(styles);

  const { board, status, currentPlayer, winner, winningLine, playMove, reset } = useGame();

  const isBoardDisabled = status !== 'playing';

  const handleCellClick = (index: number) => {
    playMove(index);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="game-page">
      <header className="game-page__header">
        <h1 className="game-page__title">Tic-Tac-Toe</h1>
        <p className="game-page__subtitle">Two-player · pass and play</p>
      </header>

      <main className="game-page__main">
        <Status
          status={status}
          currentPlayer={currentPlayer}
          winner={winner}
        />

        <Board
          board={board}
          winningLine={winningLine}
          isDisabled={isBoardDisabled}
          onCellClick={handleCellClick}
        />

        <ResetButton onReset={handleReset} />
      </main>

      <footer className="game-page__footer">
        <p>Tic-Tac-Toe — Two players</p>
      </footer>
    </div>
  );
}
