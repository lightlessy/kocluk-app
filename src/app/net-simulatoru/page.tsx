'use client';

import { useState, useMemo, useEffect } from 'react';
import { FiBarChart2, FiTarget, FiZap } from 'react-icons/fi';

interface Ders {
  name: string;
  questions: number;
}

interface AlanDersleri {
  TYT: Ders[];
  AYT_SAY: Ders[];
  AYT_EA: Ders[];
  AYT_SOZ: Ders[];
}

interface FinalScoreWeights {
  [dersName: string]: number;
}

interface BasePoints {
  TYT: number;
  SAY: number;
  EA: number;
  SOZ: number;
}

interface YearData {
  basePoints: BasePoints;
  weights: {
    TYT: FinalScoreWeights;
    SAY: FinalScoreWeights;
    EA: FinalScoreWeights;
    SOZ: FinalScoreWeights;
  };
  dersler: AlanDersleri;
}

interface CalculationData {
  [year: number]: YearData;
}

const calculationData: CalculationData = {
  2024: {
    basePoints: { TYT: 144.95, SAY: 133.28, EA: 132.28, SOZ: 130.36 },
    weights: {
      TYT: { 'Türkçe': 2.91, 'Sosyal Bilimler': 2.94, 'Temel Matematik': 2.93, 'Fen Bilimleri': 3.15 },
      SAY: { 'Türkçe': 1.11, 'Sosyal Bilimler': 1.12, 'Temel Matematik': 1.11, 'Fen Bilimleri': 1.20, 'Matematik': 3.19, 'Fizik': 2.43, 'Kimya': 3.07, 'Biyoloji': 2.51 },
      EA: { 'Türkçe': 1.14, 'Sosyal Bilimler': 1.15, 'Temel Matematik': 1.15, 'Fen Bilimleri': 1.23, 'Matematik': 3.28, 'Türk Dili ve Edebiyatı': 2.83, 'Tarih-1': 2.38, 'Coğrafya-1': 2.54 },
      SOZ: { 'Türkçe': 1.23, 'Sosyal Bilimler': 1.24, 'Temel Matematik': 1.24, 'Fen Bilimleri': 1.33, 'Türk Dili ve Edebiyatı': 3.06, 'Tarih-1': 2.57, 'Coğrafya-1': 2.74, 'Tarih-2': 3.16, 'Coğrafya-2': 2.82, 'Felsefe Grubu': 3.85, 'Din Kültürü': 3.13 },
    },
    dersler: {
      TYT: [ { name: 'Türkçe', questions: 40 }, { name: 'Sosyal Bilimler', questions: 20 }, { name: 'Temel Matematik', questions: 40 }, { name: 'Fen Bilimleri', questions: 20 } ],
      AYT_SAY: [ { name: 'Matematik', questions: 40 }, { name: 'Fizik', questions: 14 }, { name: 'Kimya', questions: 13 }, { name: 'Biyoloji', questions: 13 } ],
      AYT_EA: [ { name: 'Matematik', questions: 40 }, { name: 'Türk Dili ve Edebiyatı', questions: 24 }, { name: 'Tarih-1', questions: 10 }, { name: 'Coğrafya-1', questions: 6 } ],
      AYT_SOZ: [ { name: 'Türk Dili ve Edebiyatı', questions: 24 }, { name: 'Tarih-1', questions: 10 }, { name: 'Coğrafya-1', questions: 6 }, { name: 'Tarih-2', questions: 11 }, { name: 'Coğrafya-2', questions: 11 }, { name: 'Felsefe Grubu', questions: 12 }, { name: 'Din Kültürü', questions: 6 } ],
    }
  },
  2023: {
    basePoints: { TYT: 141.9, SAY: 128.23, EA: 128.96, SOZ: 128.44 },
    weights: {
      TYT: { 'Türkçe': 2.89, 'Sosyal Bilimler': 3.02, 'Temel Matematik': 3.02, 'Fen Bilimleri': 3.06 },
      SAY: { 'Türkçe': 1.19, 'Sosyal Bilimler': 1.24, 'Temel Matematik': 1.24, 'Fen Bilimleri': 1.26, 'Matematik': 2.82, 'Fizik': 2.48, 'Kimya': 2.94, 'Biyoloji': 3.1 },
      EA: { 'Türkçe': 1.17, 'Sosyal Bilimler': 1.22, 'Temel Matematik': 1.22, 'Fen Bilimleri': 1.23, 'Matematik': 2.78, 'Türk Dili ve Edebiyatı': 3.14, 'Tarih-1': 3.27, 'Coğrafya-1': 3.06 },
      SOZ: { 'Türkçe': 1.13, 'Sosyal Bilimler': 1.18, 'Temel Matematik': 1.18, 'Fen Bilimleri': 1.19, 'Türk Dili ve Edebiyatı': 3.03, 'Tarih-1': 3.16, 'Coğrafya-1': 2.96, 'Tarih-2': 3.07, 'Coğrafya-2': 2.99, 'Felsefe Grubu': 3.67, 'Din Kültürü': 2.81 },
    },
    dersler: {
      TYT: [ { name: 'Türkçe', questions: 40 }, { name: 'Sosyal Bilimler', questions: 20 }, { name: 'Temel Matematik', questions: 40 }, { name: 'Fen Bilimleri', questions: 20 } ],
      AYT_SAY: [ { name: 'Matematik', questions: 40 }, { name: 'Fizik', questions: 14 }, { name: 'Kimya', questions: 13 }, { name: 'Biyoloji', questions: 13 } ],
      AYT_EA: [ { name: 'Matematik', questions: 40 }, { name: 'Türk Dili ve Edebiyatı', questions: 24 }, { name: 'Tarih-1', questions: 10 }, { name: 'Coğrafya-1', questions: 6 } ],
      AYT_SOZ: [ { name: 'Türk Dili ve Edebiyatı', questions: 24 }, { name: 'Tarih-1', questions: 10 }, { name: 'Coğrafya-1', questions: 6 }, { name: 'Tarih-2', questions: 11 }, { name: 'Coğrafya-2', questions: 11 }, { name: 'Felsefe Grubu', questions: 12 }, { name: 'Din Kültürü', questions: 6 } ],
    }
  },
  2022: {
    basePoints: { TYT: 145.89, SAY: 125.41, EA: 127.4, SOZ: 127.68 },
    weights: {
      TYT: { 'Türkçe': 2.84, 'Sosyal Bilimler': 3.14, 'Temel Matematik': 2.87, 'Fen Bilimleri': 3.13 },
      SAY: { 'Türkçe': 1.19, 'Sosyal Bilimler': 1.32, 'Temel Matematik': 1.21, 'Fen Bilimleri': 1.32, 'Matematik': 2.59, 'Fizik': 3.19, 'Kimya': 2.95, 'Biyoloji': 3.11 },
      EA: { 'Türkçe': 1.22, 'Sosyal Bilimler': 1.35, 'Temel Matematik': 1.23, 'Fen Bilimleri': 1.34, 'Matematik': 2.65, 'Türk Dili ve Edebiyatı': 3.21, 'Tarih-1': 3.33, 'Coğrafya-1': 2.28 },
      SOZ: { 'Türkçe': 1.15, 'Sosyal Bilimler': 1.27, 'Temel Matematik': 1.16, 'Fen Bilimleri': 1.27, 'Türk Dili ve Edebiyatı': 3.03, 'Tarih-1': 3.15, 'Coğrafya-1': 2.15, 'Tarih-2': 3.51, 'Coğrafya-2': 2.22, 'Felsefe Grubu': 3.89, 'Din Kültürü': 2.93 },
    },
    dersler: {
      TYT: [ { name: 'Türkçe', questions: 40 }, { name: 'Sosyal Bilimler', questions: 20 }, { name: 'Temel Matematik', questions: 40 }, { name: 'Fen Bilimleri', questions: 20 } ],
      AYT_SAY: [ { name: 'Matematik', questions: 40 }, { name: 'Fizik', questions: 14 }, { name: 'Kimya', questions: 13 }, { name: 'Biyoloji', questions: 13 } ],
      AYT_EA: [ { name: 'Matematik', questions: 40 }, { name: 'Türk Dili ve Edebiyatı', questions: 24 }, { name: 'Tarih-1', questions: 10 }, { name: 'Coğrafya-1', questions: 6 } ],
      AYT_SOZ: [ { name: 'Türk Dili ve Edebiyatı', questions: 24 }, { name: 'Tarih-1', questions: 10 }, { name: 'Coğrafya-1', questions: 6 }, { name: 'Tarih-2', questions: 11 }, { name: 'Coğrafya-2', questions: 11 }, { name: 'Felsefe Grubu', questions: 12 }, { name: 'Din Kültürü', questions: 6 } ],
    }
  },
  2021: {
    basePoints: { TYT: 97.34, SAY: 98.19, EA: 92.49, SOZ: 92.9 },
    weights: {
      TYT: { 'Türkçe': 2.92, 'Sosyal Bilimler': 2.98, 'Temel Matematik': 4.53, 'Fen Bilimleri': 3.18 },
      SAY: { 'Türkçe': 1.13, 'Sosyal Bilimler': 1.16, 'Temel Matematik': 1.76, 'Fen Bilimleri': 1.24, 'Matematik': 3.4, 'Fizik': 3.48, 'Kimya': 2.46, 'Biyoloji': 2.21 },
      EA: { 'Türkçe': 1.2, 'Sosyal Bilimler': 1.22, 'Temel Matematik': 1.86, 'Fen Bilimleri': 1.31, 'Matematik': 3.6, 'Türk Dili ve Edebiyatı': 3.03, 'Tarih-1': 3.35, 'Coğrafya-1': 2.37
       },
      SOZ: { 'Türkçe': 1.19, 'Sosyal Bilimler': 1.22, 'Temel Matematik': 1.85, 'Fen Bilimleri': 1.3, 'Türk Dili ve Edebiyatı': 3.01, 'Tarih-1': .33, 'Coğrafya-1': 2.35, 'Tarih-2': 4.98, 'Coğrafya-2': 2.61, 'Felsefe Grubu': 3.65, 'Din Kültürü': 2.74 },
    },
    dersler: {
      TYT: [ { name: 'Türkçe', questions: 40 }, { name: 'Sosyal Bilimler', questions: 20 }, { name: 'Temel Matematik', questions: 40 }, { name: 'Fen Bilimleri', questions: 20 } ],
      AYT_SAY: [ { name: 'Matematik', questions: 40 }, { name: 'Fizik', questions: 14 }, { name: 'Kimya', questions: 13 }, { name: 'Biyoloji', questions: 13 } ],
      AYT_EA: [ { name: 'Matematik', questions: 40 }, { name: 'Türk Dili ve Edebiyatı', questions: 24 }, { name: 'Tarih-1', questions: 10 }, { name: 'Coğrafya-1', questions: 6 } ],
      AYT_SOZ: [ { name: 'Türk Dili ve Edebiyatı', questions: 24 }, { name: 'Tarih-1', questions: 10 }, { name: 'Coğrafya-1', questions: 6 }, { name: 'Tarih-2', questions: 11 }, { name: 'Coğrafya-2', questions: 11 }, { name: 'Felsefe Grubu', questions: 12 }, { name: 'Din Kültürü', questions: 6 } ],
    }
  },
  };

const ALL_YEARS = [2025, 2024, 2023, 2022, 2021];
// For simplicity, we'll use 2024 data for future years like 2025 as a placeholder
calculationData[2025] = calculationData[2024];

const OBP_MULTIPLIER = 0.6;
const ALANLAR = ['AYT_SAY', 'AYT_EA', 'AYT_SOZ', 'TYT'];

type Alan = 'TYT' | 'AYT_SAY' | 'AYT_EA' | 'AYT_SOZ';
type Mode = 'puan_siralama' | 'siralama_puan';

export default function NetSimulatoruPage() {
  const [year, setYear] = useState(2024);
  const [alan, setAlan] = useState<Alan>('AYT_SAY');
  const [mode, setMode] = useState<Mode>('puan_siralama');

  const filteredYears = useMemo(() => {
    if (alan === 'TYT') {
      return [2025,2024, 2023];
    }
    return ALL_YEARS;
  }, [alan]);

  // Reset year if it becomes invalid for the selected alan
  useEffect(() => {
    if (alan === 'TYT' && ![2025,2024, 2023].includes(year)) {
      setYear(2025); // Default to 2024 if TYT is selected and current year is not 2024 or 2023
    }
  }, [alan, year]);
  
  type NetValue = {
    doğru: number;
    yanlış: number;
  };
  type NetValuesType = {
    [key: string]: NetValue;
  };
  const [netValues, setNetValues] = useState<NetValuesType>({});
  const [obp, setObp] = useState(80);
  const [obpInput, setObpInput] = useState('80');
  const [hedefSiralama, setHedefSiralama] = useState(10000);

  const [apiResult, setApiResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dersler = calculationData[year].dersler;

  const handleInputChange = (dersName: string, field: string, value: number) => {
    const allDersler = [...dersler.TYT, ...(dersler[alan] || [])];
    const currentDers = allDersler.find(d => d.name === dersName);
    if (!currentDers) return;

    const { doğru = 0, yanlış = 0 } = netValues[dersName] || {};
    let newDoğru = field === 'doğru' ? value : doğru;
    let newYanlış = field === 'yanlış' ? value : yanlış;
    if (newDoğru < 0) newDoğru = 0;
    if (newYanlış < 0) newYanlış = 0;

    if (newDoğru + newYanlış > currentDers.questions) {
        if (field === 'doğru') newDoğru = currentDers.questions - newYanlış;
        if (field === 'yanlış') newYanlış = currentDers.questions - newDoğru;
    }

    setNetValues((prev: NetValuesType) => ({
      ...prev,
      [dersName]: { doğru: newDoğru, yanlış: newYanlış },
    }));
  };

  const { totalNet, totalPuan } = useMemo(() => {
    const yearData = calculationData[year];
    const field = alan === 'TYT' ? 'TYT' : alan.replace('AYT_', '') as 'SAY' | 'EA' | 'SOZ';
    const alanWeights = yearData.weights[field];

    let tytNet = 0;
    let aytNet = 0;
    let weightedNetSum = 0;

    yearData.dersler.TYT.forEach(ders => {
      const { doğru = 0, yanlış = 0 } = netValues[ders.name] || {};
      const net = doğru - yanlış / 4;
      if (net > 0) {
        tytNet += net;
        if (alanWeights[ders.name]) {
          weightedNetSum += net * alanWeights[ders.name];
        }
      }
    });

    if (alan !== 'TYT' && yearData.dersler[alan]) {
      yearData.dersler[alan].forEach(ders => {
        const { doğru = 0, yanlış = 0 } = netValues[ders.name] || {};
        const net = doğru - yanlış / 4;
        if (net > 0) {
          aytNet += net;
          if (alanWeights[ders.name]) {
            weightedNetSum += net * alanWeights[ders.name];
          }
        }
      });
    }

    const hamPuan = yearData.basePoints[field] + weightedNetSum;
    const obpPuan = obp * OBP_MULTIPLIER;
    const yerlestirmePuani = hamPuan + obpPuan;

    return { totalNet: tytNet + aytNet, totalPuan: yerlestirmePuani };
  }, [netValues, alan, obp, year]);

  const handleApiCall = async () => {
    console.log("handleApiCall çalıştırılıyor...");
    /*if (process.env.NODE_ENV === 'development') {
      console.warn("API çağrısı geliştirme ortamında devre dışı bırakıldı. Lütfen `vercel dev` kullanarak test edin.");
      setApiResult(mode === 'puan_siralama' ? 99999 : 500); // Geçici bir değer göster
      return;
    }*/

    setIsLoading(true);
    setApiResult(null);
    
    const features = mode === 'puan_siralama' ? [totalPuan] : [hedefSiralama];
    console.log("Özellikler:", features);
    console.log("API çağrısı için parametreler:", { mode, alan, year, features });
    console.log("API Çağrısı için parametrelerin tipi:", features.map(f => typeof f));
    try {
      const response = await fetch('http://localhost:8000/api', { // <-- Bu kısmı güncelleyin
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, alan, year, features }),
      });
      console.log("API isteği gönderildi:", { mode, alan, year, features });
      const data = await response.json();
      if (data.prediction) {
        setApiResult(data.prediction[0]);
      } else {
        console.error("API Hatası:", data.error);
      }
    } catch (error) {
      console.error("API isteği sırasında hata:", error);
    }
    setIsLoading(false);
  };

  const renderNetInputs = () => {
    const tytDersleri = dersler.TYT;
    const aytDersleri = alan === 'TYT' ? [] : dersler[alan];

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-cyan-400 border-b border-slate-700 pb-2">TYT Netleri</h3>
        {tytDersleri.map(renderDersInput)}
        
        {alan !== 'TYT' && (
          <>
            <h3 className="text-2xl font-bold text-cyan-400 border-b border-slate-700 pb-2 mt-8">{alan.replace('_', ' ')} Netleri</h3>
            {aytDersleri.map(renderDersInput)}
          </>
        )}
      </div>
    );
  }

  const renderDersInput = (ders: Ders) => {
    const { doğru = 0, yanlış = 0 } = netValues[ders.name] || {};
    const boş = ders.questions - doğru - yanlış;
    const net = doğru - yanlış / 4;
    return (
      <div key={ders.name} className="p-4 rounded-lg bg-slate-800 border border-slate-600">
        <h4 className="text-xl font-bold mb-3">{ders.name} ({ders.questions} Soru)</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <label className="text-sm">Doğru</label>
            <input type="number" min={0} max={ders.questions} value={doğru} onChange={(e) => handleInputChange(ders.name, 'doğru', +e.target.value)} className="w-full p-2 bg-slate-900/50 border border-slate-700 rounded-md text-cyan-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 shadow-lg backdrop-blur-sm" />
          </div>
          <div>
            <label className="text-sm">Yanlış</label>
            <input type="number" min={0} max={ders.questions} value={yanlış} onChange={(e) => handleInputChange(ders.name, 'yanlış', +e.target.value)} className="w-full p-2 bg-slate-900/50 border border-slate-700 rounded-md text-cyan-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 shadow-lg backdrop-blur-sm" />
          </div>
          <div>
            <label className="text-sm">Boş</label>
            <input type="number" value={boş} disabled className="w-full p-2 bg-slate-900 rounded" />
          </div>
          <div className="text-center md:text-right">
            <p className="text-lg font-bold">Net</p>
            <p className="text-2xl font-mono">{net.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 mb-4">
            YKS Puan & Sıralama Simülatörü
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            YKS&apos;de bir adım öne geç.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="font-bold">Yıl:</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-slate-700 p-2 rounded-md">
              {filteredYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex bg-slate-700 p-1 rounded-full">
            <button onClick={() => setMode('puan_siralama')} className={`px-4 py-2 rounded-full font-bold transition-all ${mode === 'puan_siralama' ? 'bg-cyan-500' : ''}`}>Netten Sıralama</button>
            <button onClick={() => setMode('siralama_puan')} className={`px-4 py-2 rounded-full font-bold transition-all ${mode === 'siralama_puan' ? 'bg-cyan-500' : ''}`}>Sıralamadan Puan</button>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {ALANLAR.map(a => {
              return (
                <button
                  key={a}
                  onClick={() => setAlan(a as Alan)}
                  className={`px-4 py-2 text-sm rounded-full font-bold transition-all ${
                    alan === a
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}>
                  {a.replace('_', ' ')}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-6">
            {mode === 'puan_siralama' ? renderNetInputs() : (
              <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                <FiTarget size={50} className="mx-auto text-cyan-400 mb-4"/>
                <h3 className="text-2xl font-bold mb-4">Hedef Sıralama</h3>
                <input 
                  type="number" 
                  value={hedefSiralama}
                  onChange={(e) => setHedefSiralama(Number(e.target.value))}
                  className="w-full max-w-xs mx-auto p-3 text-center text-2xl font-mono bg-slate-700 rounded-lg"
                />
                <p className="text-slate-400 mt-2">Hedeflediğiniz sıralamayı girin.</p>
              </div>
            )}
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-slate-800/50 border border-cyan-400/50 flex flex-col justify-center items-center text-center sticky top-32 h-fit">
            <FiBarChart2 size={50} className="text-cyan-300 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Sonuçlar</h2>
            
            {mode === 'puan_siralama' && (
              <div className="w-full my-4 p-6 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col items-center">
                <label className="text-lg font-bold mb-2 text-cyan-300">OBP (60-100)</label>
                <input 
                  type="number" 
                  min={50} 
                  max={100} 
                  value={obpInput} 
                  onChange={(e) => setObpInput(e.target.value)} 
                  onBlur={() => {
                    let val = parseFloat(obpInput);
                    if (isNaN(val)) val = 80; // Geçersiz giriş durumunda varsayılan değer
                    if (val < 50) val = 50;
                    if (val > 100) val = 100;
                    setObp(val);
                    setObpInput(val.toString());
                  }}
                  className="w-full max-w-xs p-3 text-center text-2xl font-mono bg-slate-900/50 border border-slate-700 rounded-lg text-cyan-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                />
                <p className="font-mono text-lg mt-2 text-slate-400">Seçilen OBP: {obp}</p>
              </div>
            )}

            <div className="bg-slate-900/50 p-6 rounded-lg w-full space-y-4">
              {mode === 'puan_siralama' && (
                <>
                  <div>
                    <p className="text-lg font-bold text-slate-300">Toplam Net</p>
                    <p className="text-4xl font-bold font-mono text-cyan-300">{totalNet.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-300">Yerleştirme Puanı</p>
                    <p className="text-4xl font-bold font-mono text-cyan-300">{totalPuan.toFixed(3)}</p>
                  </div>
                </>
              )}
              
              <div className="pt-4 border-t border-slate-700">
                 <button onClick={handleApiCall} disabled={isLoading} className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <FiZap/>
                  {isLoading ? 'Hesaplanıyor...' : (mode === 'puan_siralama' ? 'Sıralama Tahmini Yap' : 'Puan Hesapla')}
                </button>
                {apiResult && (
                   <div className="mt-4">
                      <p className="text-lg font-bold text-slate-300">{mode === 'puan_siralama' ? 'Tahmini Sıralama' : 'Gereken Puan'}</p>
                      <p className="text-4xl font-bold font-mono text-teal-300">~{Math.round(apiResult)}</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}