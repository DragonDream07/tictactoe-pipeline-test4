import React from 'react';
import { CellValue } from './Board';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  isDisabled: boolean;
  row: number;
  col: number;
}

function Cell({ value, onClick, isDisabled, row, col }: CellProps): React.ReactElement {
  const contentLabel = value !== null ? value : 'empty';
  const ariaLabel = `Row ${row}, Column ${col}, ${contentLabel}`;

  const classNames = [
    'board__cell',
    value !== null ? 'board__cell--filled' : '',
    value === 'X' ? 'board__cell--x' : '',
    value === 'O' ? 'board__cell--o' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
    >
      {value}
    </button>
  );
}

export default Cell;
