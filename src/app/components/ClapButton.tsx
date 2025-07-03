"use client";

import { useState } from 'react';
import { FaHandsClapping } from 'react-icons/fa6'; // Yeni ikon kütüphanesi
import './ClapButton.css';

export default function ClapButton() {
  const [claps, setClaps] = useState(0);
  const [isClapped, setIsClapped] = useState(false);

  const handleClap = () => {
    if (!isClapped) {
      setClaps((prev) => prev + 1);
      setIsClapped(true);
      // Görsel efekt için kısa bir gecikme
      setTimeout(() => setIsClapped(false), 300);
    }
  };

  return (
    <div className="clap-wrapper">
      <button
        onClick={handleClap}
        className={`clap-button ${isClapped ? 'clapped' : ''}`}
        aria-label="Alkışla"
      >
        <FaHandsClapping className="clap-icon" />
      </button>
      <span className="clap-count">{claps}</span>
    </div>
  );
}
