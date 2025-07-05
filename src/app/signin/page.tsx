'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import './signin.css'; // Yeni CSS dosyasını import ediyoruz

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace('/');
      }
    };
    checkUser();
  }, [router]);

  // Giriş yapma fonksiyonu
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      // Hata mesajlarını daha kullanıcı dostu hale getiriyoruz
      if (signInError.message.includes('Invalid login credentials')) {
        setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
      } else {
        setError(signInError.message);
      }
      return;
    }

    // Başarılı giriş sonrası yönlendirme
    router.push('/');
    router.refresh(); // Sayfayı yenileyerek session bilgisini günceller
  };

  return (
    <div className="signin-container">
      <div className="signin-form-container">
        <h1 className="form-title">Tekrar Hoş Geldin!</h1>
        <p className="form-subtitle">Hesabına giriş yaparak devam et.</p>

        <form onSubmit={handleSignin} noValidate>
          {/* E-posta Input Alanı */}
          <div className="input-group">
            <input
              id="email"
              type="email"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            <FiMail className="input-icon" />
          </div>

          {/* Şifre Input Alanı */}
          <div className="input-group">
            <input
              id="password"
              type="password"
              placeholder="Şifreniz"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <FiLock className="input-icon" />
          </div>

          {/* Gönder Butonu */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <span className="loader"></span>
            ) : (
              <>
                <FiLogIn />
                <span>Giriş Yap</span>
              </>
            )}
          </button>

          {/* Hata Mesajı Alanı */}
          {error && <div className="error-message">{error}</div>}
        </form>

        {/* Kayıt Olma Linki */}
        <p className="alternative-link">
          Hesabın yok mu?{' '}
          <a href="/signup">Hemen Kayıt Ol</a>
        </p>
      </div>
    </div>
  );
}
