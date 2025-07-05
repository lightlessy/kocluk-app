'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiTrendingUp, 
  FiUserPlus,
  FiCheckCircle
} from 'react-icons/fi';
import './signup.css'; // Yeni CSS dosyasını import ediyoruz

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'success'>('form');
  
  // Form verileri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [alan, setAlan] = useState('');
  const [sinif, setSinif] = useState('');
  const [hedefSiralama, setHedefSiralama] = useState('');
  
  // UI Durumları
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Kullanıcı zaten giriş yapmışsa yönlendir
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace('/');
      }
    };
    checkUser();
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Kullanıcıyı kaydet (Authentication)
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("Kullanıcı oluşturulamadı, lütfen tekrar deneyin.");
      setLoading(false);
      return;
    }

    // 2. Kullanıcı profilini oluştur (Database)
    const { error: profileError } = await supabase.from('profiles').insert([
      { 
        id: authData.user.id, 
        name, 
        email,
        alan,
        sinif,
        hedef_siralama: hedefSiralama
      }
    ]);

    if (profileError) {
      // Profil oluşturma başarısız olursa kullanıcıyı bilgilendir
      // Not: Bu durumda auth kullanıcısı oluşmuş ama profili oluşmamış olur.
      // İleri seviye bir senaryoda bu durumu ele almak gerekir.
      setError(`Hesap oluşturuldu ancak profil bilgileri kaydedilemedi: ${profileError.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep('success'); // Başarı ekranına geç

    // 3 saniye sonra ana sayfaya yönlendir
    setTimeout(() => {
      router.push('/');
      router.refresh();
    }, 3000);
  };
  
  // Formun gönderilip gönderilemeyeceğini kontrol et
  const isFormInvalid = !name || !email || !password || !alan || !sinif || !hedefSiralama;

  return (
    <div className="signup-container">
      {step === 'form' ? (
        <div className="signup-form-container">
          <h1 className="form-title">Aramıza Katıl</h1>
          <p className="form-subtitle">Hedeflerine ulaşmak için ilk adımı at.</p>

          <form onSubmit={handleSignup} noValidate>
            {/* Ad Soyad */}
            <div className="input-group">
              <label htmlFor="name" className="input-label">Adın ve Soyadın</label>
              <input id="name" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
              <FiUser className="input-icon" />
            </div>

            {/* E-posta */}
            <div className="input-group">
              <label htmlFor="email" className="input-label">E-posta Adresin</label>
              <input id="email" type="email" placeholder="ornek@eposta.com" value={email} onChange={e => setEmail(e.target.value)} className="input-field" required />
              <FiMail className="input-icon" />
            </div>

            {/* Şifre */}
            <div className="input-group">
              <label htmlFor="password" className="input-label">Şifren</label>
              <input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="input-field" required />
              <FiLock className="input-icon" />
            </div>

            {/* Alan Seçimi */}
            <div className="input-group">
              <label htmlFor="alan" className="input-label">Alan</label>
              <select id="alan" value={alan} onChange={e => setAlan(e.target.value)} className="select-field" required>
                <option value="" disabled>Alanını seç...</option>
                <option value="SAY">Sayısal (SAY)</option>
                <option value="EA">Eşit Ağırlık (EA)</option>
                <option value="SÖZEL">Sözel</option>
                <option value="TYT">Sadece TYT</option>
              </select>
            </div>

            {/* Sınıf Seçimi */}
            <div className="input-group">
              <label htmlFor="sinif" className="input-label">Sınıf</label>
              <select id="sinif" value={sinif} onChange={e => setSinif(e.target.value)} className="select-field" required>
                <option value="" disabled>Sınıfını seç...</option>
                <option value="9">9. Sınıf</option>
                <option value="10">10. Sınıf</option>
                <option value="11">11. Sınıf</option>
                <option value="12">12. Sınıf</option>
                <option value="mezun">Mezun</option>
              </select>
            </div>

            {/* Hedef Sıralama */}
            <div className="input-group">
              <label htmlFor="hedef" className="input-label">Hedef Sıralama</label>
              <input id="hedef" type="number" placeholder="Örn: 10000" value={hedefSiralama} onChange={e => setHedefSiralama(e.target.value)} className="input-field" required />
              <FiTrendingUp className="input-icon" />
            </div>

            <button type="submit" className="submit-button" disabled={loading || isFormInvalid}>
              {loading ? <span className="loader"></span> : <> <FiUserPlus /> <span>Hesap Oluştur</span> </>}
            </button>
            
            {error && <div className="error-message">{error}</div>}
          </form>

          <p className="alternative-link">
            Zaten bir hesabın var mı? <a href="/signin">Giriş Yap</a>
          </p>
        </div>
      ) : (
        <div className="success-container">
            <FiCheckCircle className="success-icon" />
            <h2 className="success-title">Kayıt Başarılı!</h2>
            <p className="success-text">Harika! Hesabın oluşturuldu. Şimdi seni ana sayfaya yönlendiriyoruz.</p>
        </div>
      )}
    </div>
  );
}
