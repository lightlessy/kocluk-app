'use client';

import { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FiUsers, FiCheckSquare } from 'react-icons/fi';
import './Footer.css';

const academicSymbols = 'Σ∫π√αβθλ∞ωμψABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function Footer() {
  const [activeStudents, setActiveStudents] = useState(187);
  const [questionsSolved, setQuestionsSolved] = useState(8753);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [keySequence, setKeySequence] = useState('');
  
  const [studentUpdated, setStudentUpdated] = useState(false);
  const [questionsUpdated, setQuestionsUpdated] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mobil için çoklu dokunma mantığı
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simüle edilmiş canlı verileri güncelle
  useEffect(() => {
    const studentInterval = setInterval(() => {
      setActiveStudents(prev => prev + Math.floor(Math.random() * 3) - 1);
      setStudentUpdated(true);
      setTimeout(() => setStudentUpdated(false), 500);
    }, 4000);

    const questionInterval = setInterval(() => {
        setQuestionsSolved(prev => prev + Math.floor(Math.random() * 10) + 1);
        setQuestionsUpdated(true);
        setTimeout(() => setQuestionsUpdated(false), 500);
    }, 2500);

    return () => {
      clearInterval(studentInterval);
      clearInterval(questionInterval);
    };
  }, []);

  // --- Easter Egg Logic ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = (keySequence + e.key.toLowerCase()).slice(-4);
      setKeySequence(newSequence);
      if (newSequence === 'mola') {
        setShowEasterEgg(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence]);

  // Mobil için çoklu dokunma tetikleyicisi
  const handleTap = () => {
    tapCount.current += 1;

    // Zamanlayıcı varsa temizle
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }

    // 5 dokunmaya ulaşıldıysa easter egg'i göster
    if (tapCount.current >= 5) {
      setShowEasterEgg(true);
      tapCount.current = 0;
    } else {
      // Belirli bir süre içinde dokunulmazsa sayacı sıfırla
      tapTimer.current = setTimeout(() => {
        tapCount.current = 0;
      }, 1500); // 1.5 saniye içinde 5 kez dokunulmalı
    }
  };

  // Dijital Yağmur Efekti
  useEffect(() => {
    if (!showEasterEgg || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    function draw() {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#60a5fa';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = academicSymbols[Math.floor(Math.random() * academicSymbols.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    const intervalId = setInterval(draw, 40);
    return () => clearInterval(intervalId);
  }, [showEasterEgg]);

  return (
    <>
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-stats">
            <div className="stat-item">
              <FiUsers className="stat-icon" />
              <div>
                <p className={`stat-value ${studentUpdated ? 'updated' : ''}`}>{activeStudents}</p>
                <p className="stat-label">Aktif Öğrenci</p>
              </div>
            </div>
            <div className="stat-item">
              <FiCheckSquare className="stat-icon" />
              <div>
                <p className={`stat-value ${questionsUpdated ? 'updated' : ''}`}>{questionsSolved}</p>
                <p className="stat-label">Anlık Çözülen Soru</p>
              </div>
            </div>
          </div>
          <div className="footer-socials">
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaYoutube /></a>
          </div>
        </div>
        <div 
          className="footer-copyright"
          onClick={handleTap} // onClick olayı hem masaüstü hem mobil için çalışır
          onContextMenu={(e) => e.preventDefault()}
        >
          <p>&copy; {new Date().getFullYear()} YKS Koçluk. Tüm hakları saklıdır.</p>
          <p className="easter-egg-hint">PC'de 'mola' yaz veya mobilde bu yazıya 5 kez dokun.</p>
        </div>
      </footer>

      {showEasterEgg && (
        <div className="easter-egg-overlay" onClick={() => setShowEasterEgg(false)}>
          <canvas ref={canvasRef}></canvas>
          <div className="easter-egg-message">
            <h1>Kısa bir mola...</h1>
            <p>Zihnin en keskin kılıçtır. Çıkmak için tıkla.</p>
          </div>
        </div>
      )}
    </>
  );
}