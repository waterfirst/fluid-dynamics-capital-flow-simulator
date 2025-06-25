
import React from 'react';

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M6 19V5l14 7-14 7z"></path>
  </svg>
);

export default PlayIcon;
