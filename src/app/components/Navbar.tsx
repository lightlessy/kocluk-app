'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const navLinks = [
  { href: '/hizmetler', label: 'Hizmetler' },
  { href: '/haftaningorevi', label: 'Haftanın Görevi' },
  { href: '/net-simulatoru', label: 'Net Simülatörü' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link href="/" className="logo">
          Beyzamı Seviyorum
        </Link>

        {/* Masaüstü Menü */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobil Menü Butonu */}
        <button
          className="md:hidden text-gray-200 z-50" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Mobil menüyü aç/kapat"
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Mobil Menü (Overlay) */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
            <div className="flex flex-col items-center justify-center h-full space-y-8">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`}
                        onClick={() => setIsOpen(false)} >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </nav>
  );
}