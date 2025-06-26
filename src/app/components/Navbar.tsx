'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname(); // en üste ekle
  const [open, setOpen] = useState(false);

  return (

    <nav  className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-400">
          Beyzamı Seviyorum
        </Link>

        {/* Masaüstü Menü */}

<div className="space-x-6 hidden md:flex">
  <Link
    href="/hizmetler"
    style={{
    color: pathname === "/hizmetler" ? "#F97316" : "#D1D5DB", // örnek renkler
    fontWeight: pathname === "/hizmetler" ? "bold" : "normal",
  }}
  className="transition hover:opacity-80"

  >
    Hizmetler
  </Link>

  <Link
    href="/haftaningorevi"
    style={{
    color: pathname === "/haftaningorevi" ? "#F97316" : "#D1D5DB", // örnek renkler
    fontWeight: pathname === "/haftaningorevi" ? "bold" : "normal",
  }}
  className="transition hover:opacity-80"
  >
    Haftanın Görevi
  </Link>

  <Link
    href="/blog"
    style={{
    color: pathname === "/blog" ? "#F97316" : "#D1D5DB", // örnek renkler
    fontWeight: pathname === "/blog" ? "bold" : "normal",
  }}
  className="transition hover:opacity-80"
  >
    Blog
  </Link>

  <Link
    href="/iletisim"
   style={{
    color: pathname === "/iletisim" ? "#F97316" : "#D1D5DB", // örnek renkler
    fontWeight: pathname === "/iletisim" ? "bold" : "normal",
  }}
  className="transition hover:opacity-80"
  >
    İletişim
  </Link>
</div>


        {/* Menü Butonu */}
        <button
          className="md:hidden text-gray-300"
          onClick={() => setOpen(!open)}
          aria-label="Mobil menüyü aç/kapat"
        >
          {/* Basit hamburger ikonu */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Bottom Sheet Menü */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-black bg-opacity-75 backdrop-blur-md p-6 rounded-t-3xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="flex flex-col space-y-6">
          {['/hizmetler', '/haftaningorevi', '/blog', '/iletisim'].map(href => (
            <Link
              key={href}
              href={href}
              className={`text-xl font-semibold px-5 py-3 rounded-lg shadow-lg transition ${
  pathname === href
    ? "bg-orange-500 text-black"
    : "text-orange-400 bg-black bg-opacity-40 backdrop-blur-sm hover:bg-opacity-60"
}`}
              onClick={() => setOpen(false)}
            >
              {href === '/hizmetler' && 'Hizmetler'}
              {href === '/haftaningorevi' && 'Haftanın Görevi'}
              {href === '/blog' && 'Blog'}
              {href === '/iletisim' && 'İletişim'}
            </Link>
          ))}

          <button
            onClick={() => setOpen(false)}
            className="mt-4 bg-orange-400 text-black py-3 rounded-full font-bold shadow-lg hover:bg-orange-500 transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </nav>
  );
}
