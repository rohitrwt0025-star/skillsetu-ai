import React from 'react';

interface SetuLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SetuLogo: React.FC<SetuLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon: Setu Bridge with Connected Nodes & Upward Trajectory */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 p-1.5 shadow-sm shadow-blue-500/20 flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-white"
        >
          {/* Bridge arch */}
          <path d="M3 18C7 10 17 10 21 18" stroke="currentColor" strokeWidth="2.2" />
          {/* Deck */}
          <path d="M3 18H21" stroke="currentColor" strokeWidth="1.8" />
          {/* Vertical stay cables */}
          <path d="M8 13.5V18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 1" />
          <path d="M12 11.5V18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 1" />
          <path d="M16 13.5V18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 1" />
          {/* Upward future node / beacon */}
          <circle cx="12" cy="6" r="2.2" fill="white" stroke="none" />
          {/* Connecting ray to apex */}
          <path d="M12 8.2V11.5" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`font-bold tracking-tight text-slate-900 ${textSizes[size]}`}>
              SkillSetu<span className="text-blue-600 font-extrabold ml-0.5">AI</span>
            </span>
          </div>
          {size !== 'sm' && (
            <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase -mt-0.5 hidden sm:block">
              Skills · Opportunities · Future
            </span>
          )}
        </div>
      )}
    </div>
  );
};
