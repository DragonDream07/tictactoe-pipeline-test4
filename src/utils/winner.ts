const WINNING_COMBINATIONS: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type Player = 'X' | 'O';
export type Cell = Player | null;

export interface WinnerResult {
  winner: Player;
  line: [number, number, number];
}

export function calculateWinner(board: Cell[]): WinnerResult | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: [a, b, c] };
    }
  }
  return null;
}
