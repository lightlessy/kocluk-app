'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './whatsapp-cta.css'; // Ayrı bir CSS dosyası kullanacağız

export default function WhatsAppCTA() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false); // Görünmez olduğunda genişlemeyi sıfırla
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${ 
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      }`}
    >
      <a
        href="https://chat.whatsapp.com/BVSXAtpzsIfLFRqdmeleOK"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Bildirim Noktası */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>

        <FaWhatsapp size={28} className="icon-transition" />
        <span
          className={`ml-2 font-bold tracking-wide transition-all duration-300 ease-in-out overflow-hidden ${ 
            isExpanded ? 'max-w-xs' : 'max-w-0'
          }`}
          style={{ whiteSpace: 'nowrap' }}
        >
          Topluluğa Katıl
        </span>
      </a>
    </div>
  );
}
