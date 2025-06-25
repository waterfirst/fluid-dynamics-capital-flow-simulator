
import React from 'react';

const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a3.375 3.375 0 01-3 0m3-1.18c.63.132 1.29.2 1.95.2 1.254 0 2.43-.324 3.375-.898m-11.25.898c-.945-.574-1.92-1.302-2.7-2.132M12 2.25A5.25 5.25 0 006.75 7.5v3.371c0 .241.02.48.06.711m5.19-4.582a5.251 5.251 0 014.238 4.582M12 2.25a5.25 5.25 0 015.25 5.25m0 0v3.371c0 .241-.02.48-.06.711M12 12.75a2.25 2.25 0 00-2.25 2.25H12v-.001c.621 0 1.125-.504 1.125-1.124a1.122 1.122 0 00-.25-2.226C12.42 12.984 12.22 12.75 12 12.75z" 
    />
  </svg>
);

export default LightBulbIcon;
