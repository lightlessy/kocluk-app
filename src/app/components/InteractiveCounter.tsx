// Bu bir istemci bileşeni olduğu için en üste bu direktifi ekliyoruz.
'use client'; 

import React, { useState, useEffect } from 'react';
import styles from './InteractiveCounter.module.css';

// TypeScript: Bileşenin state'inde tutulacak zaman objesinin yapısını tanımlıyoruz.
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// TypeScript: Bileşenin dışarıdan alacağı props'ların tipini tanımlıyoruz.
type InteractiveCounterProps = {
  targetDate: string;
};

const InteractiveCounter: React.FC<InteractiveCounterProps> = ({ targetDate }) => {
  
  // TypeScript: Fonksiyonun ne tür bir değer döndüreceğini belirtiyoruz (TimeLeft veya null).
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +new Date(targetDate) - +new Date();
    
    if (difference <= 0) {
      return null; // Zaman dolduysa null döndür.
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  // TypeScript: useState hook'una generic tip olarak <TimeLeft | null> veriyoruz.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft) {
        const totalDuration = 7 * 24 * 60 * 60 * 1000;
        const remainingTime = +new Date(targetDate) - +new Date();
        setProgress((remainingTime / totalDuration) * 100);
      } else {
        setProgress(0);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num: number): string => num.toString().padStart(2, '0');
  
  // Zaman dolduysa (timeLeft null ise) bu mesajı göster.
  if (!timeLeft) {
    return (
        <div className={styles.sayacContainer}>
            <h3>Savaş Bitti! Zaferini İlan Et!</h3>
        </div>
    );
  }

  return (
    <div className={styles.sayacContainer}>
      <h3>Savaşın Bitmesine Kalan Süre:</h3>
      <br />  
      <div className={styles.progressBarDis}>
        <div
          className={`${styles.progressBarIc} ${timeLeft.days < 1 ? styles.tehlike : ''}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={styles.rakamlar}>
        <div>
          <span>{formatNumber(timeLeft.days)}</span>
          <small>Gün</small>
        </div>
        <div>
          <span>{formatNumber(timeLeft.hours)}</span>
          <small>Saat</small>
        </div>
        <div>
          <span>{formatNumber(timeLeft.minutes)}</span>
          <small>Dakika</small>
        </div>
        <div>
          <span>{formatNumber(timeLeft.seconds)}</span>
          <small>Saniye</small>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCounter;