'use client';

import { useState } from 'react';
import { FiSend, FiMail, FiPhone, FiMapPin, FiLoader, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

export default function IletisimPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResponseMessage(data.message);

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      setResponseMessage('Bir ağ hatası oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-amber-500 mb-4">
            Bize Ulaşın
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya işbirliği talepleriniz mi var? Aşağıdaki formu doldurarak veya bilgilerimizi kullanarak bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {/* ... İletişim bilgileri aynı kalıyor ... */}
          </div>

          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-300">Adınız</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-amber-500 focus:border-amber-500" placeholder="Adınız Soyadınız" required />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-300">Email Adresiniz</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-amber-500 focus:border-amber-500" placeholder="ornek@email.com" required />
              </div>
              <div className="mb-5">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-slate-300">Mesajınız</label>
                <textarea id="message" rows={4} value={formData.message} onChange={handleChange} className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-amber-500 focus:border-amber-500" placeholder="Mesajınızı buraya yazın..." required></textarea>
              </div>
              
              <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-amber-600 rounded-full hover:bg-amber-700 transition-all transform hover:scale-105 shadow-lg disabled:bg-amber-800 disabled:scale-100">
                {status === 'loading' && <FiLoader className="animate-spin" />}
                {status !== 'loading' && <FiSend />}
                {status === 'loading' ? 'Gönderiliyor...' : 'Gönder'}
              </button>

              {status === 'success' && (
                <div className="mt-4 flex items-center gap-2 text-green-400"><FiCheckCircle /> {responseMessage}</div>
              )}
              {status === 'error' && (
                <div className="mt-4 flex items-center gap-2 text-red-400"><FiAlertTriangle /> {responseMessage}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}