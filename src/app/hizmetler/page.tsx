import { FiTarget, FiClock, FiTrendingUp, FiAward } from 'react-icons/fi';

const services = [
  {
    icon: <FiTarget size={40} className="text-blue-400" />,
    title: 'Stratejik Sınav Planlaması',
    description: "Kişiye özel ders çalışma programları, konu analizleri ve hedef belirleme seansları ile YKS'de yol haritanızı çiziyoruz.",
  },
  {
    icon: <FiClock size={40} className="text-purple-400" />,
    title: 'Motivasyon ve Zaman Yönetimi',
    description: 'Sınav kaygısıyla başa çıkma, odaklanma teknikleri ve verimli zaman kullanımı stratejileri ile potansiyelinizi en üste taşıyın.',
  },
  {
    icon: <FiTrendingUp size={40} className="text-pink-400" />,
    title: 'Net Artırma Teknikleri',
    description: 'Deneme analizi, hata tespiti ve nokta atışı konu tekrarları ile netlerinizi istikrarlı bir şekilde artırmayı hedefliyoruz.',
  },
  {
    icon: <FiAward size={40} className="text-amber-400" />,
    title: 'Tercih Danışmanlığı',
    description: 'Sınav sonrası süreçte, puanınıza ve hedeflerinize en uygun üniversite ve bölümleri belirlemeniz için profesyonel destek sunuyoruz.',
  },
];

export default function HizmetlerPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Başlık Bölümü */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Sunduğumuz Hizmetler
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            YKS hazırlık sürecinde, başarının her adımında yanınızdayız. Profesyonel destekle hedeflerinize daha hızlı ve emin adımlarla ulaşın.
          </p>
        </div>

        {/* Hizmet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-8 rounded-2xl transition-all duration-300 bg-slate-800/50 border border-slate-700 hover:border-blue-400 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="mb-6">
                {service.icon}
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mb-3">{service.title}</h2>
              <p className="text-slate-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
