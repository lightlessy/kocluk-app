import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    // ...yönlendirme veya mesaj...
  };

  return (
    <form onSubmit={handleSignin}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Giriş Yap</button>
      {error && <div>{error}</div>}
    </form>
  );
}