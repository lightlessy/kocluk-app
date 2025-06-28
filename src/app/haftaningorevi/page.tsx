'use client';
import { useState } from 'react';
import InteractiveCounter from '../components/InteractiveCounter';
import WhatsAppCTA from '../components/WhatsAppCTA';
import { FiTarget, FiCheckCircle, FiCpu, FiPenTool, FiMic, FiBookOpen } from 'react-icons/fi';
import './haftaningorevi.css';
import { JSX } from 'react/jsx-runtime';

// --- Örnek Veri Setleri ---
// Her alan için ayrı görev listeleri
const weeklyTasksSAY = [
  { topic: 'Türevin Geometrik Yorumu', subject: 'Matematik', videoId: '8QjRPODpmBM' },
  { topic: 'Akışkanlar Fiziği', subject: 'Fizik', videoId: '8QjRPODpmBM' },
  { topic: 'Hücre Döngüsü', subject: 'Biyoloji', videoId: '8QjRPODpmBM' },
];
const weeklyTasksEA = [
  { topic: 'Paragrafta Anlam', subject: 'Türkçe', videoId: '8QjRPODpmBM' },
  { topic: 'Osmanlı Yükselme Dönemi', subject: 'Tarih', videoId: '8QjRPODpmBM' },
  { topic: 'Fonksiyonlar', subject: 'Matematik', videoId: '8QjRPODpmBM' },
];
const weeklyTasksSOZ = [
  { topic: 'Sözcükte Anlam', subject: 'Türkçe', videoId: '8QjRPODpmBM' },
  { topic: 'Coğrafi Konum', subject: 'Coğrafya', videoId: '8QjRPODpmBM' },
  { topic: 'İslamiyet Öncesi Türk Tarihi', subject: 'Tarih', videoId: '8QjRPODpmBM' },
];
const weeklyTasksTYT = [
  { topic: 'Temel Kavramlar', subject: 'Matematik', videoId: '8QjRPODpmBM' },
  { topic: 'Sözcük Grupları', subject: 'Türkçe', videoId: '8QjRPODpmBM' },
  { topic: 'Madde ve Özellikleri', subject: 'Fizik', videoId: '8QjRPODpmBM' },
];

// Alanlara göre görevleri birleştiren ana obje
const tasksByField = {
  'Sayısal': weeklyTasksSAY,
  'Eşit Ağırlık': weeklyTasksEA,
  'Sözel': weeklyTasksSOZ,
  'TYT': weeklyTasksTYT,
};

// Seçim butonları için konfigürasyon
type FieldType = "Sayısal" | "Eşit Ağırlık" | "Sözel" | "TYT";
const fieldOptions: { id: FieldType, label: string, icon: JSX.Element }[] = [
    { id: 'Sayısal', label: 'Sayısal', icon: <FiCpu size={20} /> },
    { id: 'Eşit Ağırlık', label: 'Eşit Ağırlık', icon: <FiPenTool size={20} /> },
    { id: 'Sözel', label: 'Sözel', icon: <FiMic size={20} /> },
    { id: 'TYT', label: 'TYT', icon: <FiBookOpen size={20} /> },
];

export default function HaftaninGorevi() {
  const [selectedField, setSelectedField] = useState<keyof typeof tasksByField>('Sayısal');
  const hedef = new Date();
  const bugun = hedef.getDay();
  const kacGunSonra = (4 - bugun + 7) % 7;
  hedef.setDate(hedef.getDate() + kacGunSonra);
  hedef.setHours(20, 0, 0, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Header Section */}
        <div className="relative text-center py-16 md:py-24 rounded-3xl overflow-hidden mb-12 header-container">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-blue-900 via-slate-900 to-purple-900 opacity-40 blur-3xl animate-pulse"></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
                <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-teal-200 mb-4 animate-gradient-x">
                    Haftanın Görevi
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                    Hedeflerine bir adım daha yaklaş! Bu haftanın görevlerini tamamla, zirveye oyna.
                </p>
                <div className="mt-8 w-full max-w-3xl">
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-sm">
                        <InteractiveCounter targetDate={hedef.toISOString()} />
                    </div>
                </div>
            </div>
        </div>
        
        {/* Alan Seçimi */}
        <div className="mb-12 flex justify-center">
            <div className="flex items-center justify-center p-1.5 bg-slate-800/60 border border-slate-700 rounded-full shadow-lg backdrop-blur-sm">
                {fieldOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setSelectedField(option.id)}
                        className={`selection-button ${selectedField === option.id ? 'active' : ''}`}
                    >
                        {option.icon}
                        <span className="ml-2 hidden sm:inline">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Görevler ve Videolar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasksByField[selectedField].map((task, index) => (
            <div key={index} className="task-card">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-300 flex items-center">
                  <FiTarget className="mr-3" /> {task.subject}
                </h3>
                <p className="text-slate-300 mt-2 text-lg">{task.topic}</p>
              </div>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${task.videoId}`}
                  title={`${task.topic} - YouTube Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 bg-slate-800/50">
                 <button className="w-full flex items-center justify-center text-lg font-semibold text-teal-300 hover:text-white transition-colors duration-300">
                    <FiCheckCircle className="mr-2" /> Tamamlandı olarak işaretle
                 </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Ekstra Kartlar ve CTA */}
        <div className="mt-16 text-center">
            <div className="p-8 bg-slate-800 rounded-lg shadow-xl inline-block">
                <h2 className="text-3xl font-bold text-teal-300 mb-4">Hazır mısın?</h2>
                <p className="text-slate-300 max-w-2xl mx-auto mb-6">
                    Bu haftanın görevlerini tamamlayarak hedeflerine bir adım daha yaklaş. Takıldığın yerlerde soru sormaktan çekinme!
                </p>
                <WhatsAppCTA />
            </div>
        </div>

      </div>
    </div>
  );
}
