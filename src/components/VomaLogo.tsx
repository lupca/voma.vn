import React from 'react';

interface VomaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDomain?: boolean;
}

export const VomaLogo: React.FC<VomaLogoProps> = ({
  className = '',
  size = 'md',
  showDomain = true,
}) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', dot: 'text-xs' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', dot: 'text-sm' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', dot: 'text-base' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <div className={`relative ${currentSize.icon} flex items-center justify-center`}>
        {/* Glowing background halo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Main Logo Container */}
        <div className="relative w-full h-full bg-slate-900 border border-emerald-500/40 rounded-xl flex items-center justify-center p-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Shield & Infinity Hybrid Path */}
            <path
              d="M20 30C20 20 35 15 50 15C65 15 80 20 80 30C80 48 68 70 50 85C32 70 20 48 20 30Z"
              fill="url(#voma-bg-grad)"
              stroke="url(#voma-stroke-grad)"
              strokeWidth="4"
            />
            {/* Dynamic Checkmark & Sync Arrows */}
            <path
              d="M36 48L46 58L68 34"
              stroke="#10B981"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Automatic Tax Star Glow */}
            <circle cx="70" cy="28" r="4" fill="#F59E0B" />

            <defs>
              <linearGradient id="voma-bg-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0F172A" />
                <stop offset="1" stopColor="#064E3B" />
              </linearGradient>
              <linearGradient id="voma-stroke-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399" />
                <stop offset="0.5" stopColor="#10B981" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex items-baseline tracking-tight font-extrabold font-['Plus_Jakarta_Sans',sans-serif]">
        <span className={`text-slate-100 ${currentSize.text} tracking-tight group-hover:text-emerald-400 transition-colors`}>
          voma
        </span>
        {showDomain && (
          <span className={`text-emerald-400 ${currentSize.dot} font-bold ml-0.5 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 text-amber-400`}>
            .vn
          </span>
        )}
      </div>
    </div>
  );
};
