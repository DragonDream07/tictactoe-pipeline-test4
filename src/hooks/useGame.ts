import { useState, useCallback } from 'react';

export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function computeWinner(board: Board): Player | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

function computeCurrentPlayer(board: Board): Player {
  const xCount = board.filter((cell) => cell === 'X').length;
  const oCount = board.filter((cell) => cell === 'O').length;
  return xCount <= oCount ? 'X' : 'O';
}

const INITIAL_BOARD: Board = Array(9).fill(null);

export interface UseGameResult {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  playMove: (index: number) => void;
  reset: () => void;
}

function useGame(): UseGameResult {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);

  const winner = computeWinner(board);
  const currentPlayer = computeCurrentPlayer(board);
  const isDraw = winner === null && board.every((cell) => cell !== null);

  const playMove = useCallback(
    (index: number): void => {
      setBoard((prevBoard) => {
        const currentWinner = computeWinner(prevBoard);
        if (currentWinner !== null) return prevBoard;
        if (prevBoard[index] !== null) return prevBoard;
        if (prevBoard.every((cell) => cell !== null)) return prevBoard;

        const nextBoard = [...prevBoard] as Board;
        nextBoard[index] = computeCurrentPlayer(prevBoard);
        return nextBoard;
      });
    },
    [],
  );

  const reset = useCallback((): void => {
    setBoard([...INITIAL_BOARD]);
  }, []);

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    playMove,
    reset,
  };
}

export default useGame;
