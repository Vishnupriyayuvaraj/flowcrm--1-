import React from 'react';

interface ZenzLogoProps {
  className?: string;
  size?: number;
}

export default function ZenzLogo({ className = "", size = 32 }: ZenzLogoProps) {
  // Beautiful custom SVG representing Zenz asterisk/flower logo
  return (
    <div style={{ width: size, height: size }} className={`relative flex items-center justify-center select-none ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full animate-spin-slow text-violet-600"
        fill="currentColor"
      >
        {/* Central hub */}
        <circle cx="50" cy="50" r="14" className="text-violet-600" />
        
        {/* Rotated petals/segments matching the Zenz brand style */}
        <rect x="43" y="10" width="14" height="28" rx="7" className="text-violet-600" />
        <rect x="43" y="62" width="14" height="28" rx="7" className="text-violet-600" />
        
        <g transform="rotate(60 50 50)">
          <rect x="43" y="10" width="14" height="28" rx="7" className="text-violet-600/90" />
          <rect x="43" y="62" width="14" height="28" rx="7" className="text-violet-600/90" />
        </g>
        
        <g transform="rotate(120 50 50)">
          <rect x="43" y="10" width="14" height="28" rx="7" className="text-violet-500" />
          <rect x="43" y="62" width="14" height="28" rx="7" className="text-violet-500" />
        </g>
      </svg>
    </div>
  );
}
