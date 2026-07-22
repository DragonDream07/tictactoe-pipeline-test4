import React from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      className="reset-button"
      onClick={onReset}
    >
      New Game
    </button>
  );
}

export default ResetButton;
