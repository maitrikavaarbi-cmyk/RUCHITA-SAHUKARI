import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  id?: string;
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  id = 'global-theme-toggle',
  showLabel = true,
  className = ''
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      id={id}
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode (1 Click)' : 'Switch to Dark Mode (1 Click)'}
      className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 select-none ${
        isDark
          ? 'bg-[#222030] hover:bg-[#2b283c] text-amber-300 border border-pink-500/30 hover:border-amber-400/50 shadow-black/40'
          : 'bg-white hover:bg-pink-50 text-zinc-700 hover:text-pink-700 border border-pink-200 hover:border-pink-300 shadow-pink-500/5'
      } ${className}`}
    >
      <span className="relative flex items-center justify-center w-4 h-4">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform duration-300 fill-amber-300/20" />
        ) : (
          <Moon className="w-4 h-4 text-pink-600 group-hover:-rotate-12 transition-transform duration-300 fill-pink-500/20" />
        )}
      </span>

      {showLabel && (
        <span className="text-[11px] uppercase tracking-wider font-bold">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}

      {/* Subtle indicator dot */}
      <span 
        className={`w-1.5 h-1.5 rounded-full ${
          isDark ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-pink-500 shadow-[0_0_6px_#ec4899]'
        }`} 
      />
    </button>
  );
};
