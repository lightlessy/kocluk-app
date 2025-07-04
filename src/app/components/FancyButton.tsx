'use client';

import React from 'react';

interface FancyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function FancyButton({ children, onClick, type = 'button', className = '' }: FancyButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative inline-block px-8 py-3 font-bold text-lg rounded-full
        bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500
        text-white shadow-xl transition-all duration-300
        hover:from-blue-500 hover:to-teal-400 hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-cyan-400/50
        before:absolute before:inset-0 before:rounded-full before:bg-white/10 before:opacity-0
        hover:before:opacity-100
        overflow-hidden
        ${className}
      `}
      style={{ zIndex: 1 }}
    >
      <span className="relative z-10 drop-shadow-lg">{children}</span>
      {/* Parlayan animasyon efekti */}
      <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
        <span className="block w-full h-full animate-[pulse_2s_infinite] bg-white/10 rounded-full"></span>
      </span>
    </button>
  );
}
