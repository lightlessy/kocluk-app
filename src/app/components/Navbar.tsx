'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiUserPlus
} from 'react-icons/fi';
import './Navbar.css';

type Profile = {
  id: string;
  name: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // GÜNCELLENEN SCROLL DİNLEYİCİSİ
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const isBlogPage = pathname.startsWith('/blog');

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (isBlogPage) {
        // Yavaşça yukarı kayma için translateY ile state tut
        if (currentScrollY < lastScrollY || currentScrollY < 80) {
          setNavbarVisible(true);
        } else {
          setNavbarVisible(false);
        }
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    if (!isBlogPage) {
      setNavbarVisible(true);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]); // Sayfa değiştiğinde bu efekti yeniden çalıştır

  // Kullanıcı oturumunu anlık dinle
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('id', currentUser.id)
            .single();
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Dışarı tıklamayı dinleyerek profil menüsünü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/hizmetler', label: 'Hizmetler' },
    { href: '/haftaningorevi', label: 'Haftanın Görevi' },
    { href: '/blog', label: 'Blog' },
  ];
  
  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    // ...existing code...
    <nav
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${!isNavbarVisible ? 'navbar-hide-animate' : ''}`}
    >
      <div className="navbar-content">
        <Link href="/" className="logo-link" onClick={() => setMobileMenuOpen(false)}>
          BEYZAMI SEVİYORUM
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex nav-actions">
          {user && profile ? (
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button className="profile-button" onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}>
                <div className="profile-avatar">{getInitials(profile.name)}</div>
                <span className="profile-name">Merhaba, {profile.name.split(' ')[0]}!</span>
              </button>
              <div className={`profile-dropdown ${isProfileMenuOpen ? 'open' : ''}`}>
                <div className="dropdown-header">
                  <p className="name">{profile.name}</p>
                  <p className="email">{user.email}</p>
                </div>
                <div className="p-1">
                  <Link href="/profil" className="dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                    <FiUser /> Profilim
                  </Link>
                  <Link href="/ayarlar" className="dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                    <FiSettings /> Ayarlar
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="w-full dropdown-item logout-button">
                    <FiLogOut /> Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link href="/signin" className="nav-cta-login">
                Giriş Yap
              </Link>
              <Link href="/signup" className="nav-cta-signup flex items-center gap-2">
                <FiUserPlus /> Ücretsiz Başla
              </Link>
            </>
          )}
        </div>
        
        <button className="md:hidden mobile-menu-button" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="mobile-menu-actions">
            {user ? (
                <button onClick={handleLogout} className="nav-cta-login text-lg">Çıkış Yap</button>
            ) : (
                <>
                    <Link href="/signin" className="nav-cta-login text-lg" onClick={() => setMobileMenuOpen(false)}>Giriş Yap</Link>
                    <Link href="/signup" className="nav-cta-signup text-lg" onClick={() => setMobileMenuOpen(false)}>Ücretsiz Başla</Link>
                </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

