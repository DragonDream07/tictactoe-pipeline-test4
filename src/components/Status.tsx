import React from 'react';

interface StatusProps {
  message: string;
}

function Status({ message }: StatusProps): React.ReactElement {
  return (
    <div
      className="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}

export default Status;
