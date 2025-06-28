import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 text-white">
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Ana İçerik */}
      <div className="relative z-10 text-center p-4">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
          Zirveye Giden Yolda Rehberin
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
          YKS'de hedeflerine ulaşman için ihtiyacın olan strateji, motivasyon ve birebir ilgi burada. Potansiyelini ortaya çıkar, başarıyı yakala.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/haftaningorevi" className="px-8 py-3 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
            Hemen Başla
          </Link>
          <Link href="/hizmetler" className="px-8 py-3 font-bold text-slate-200 bg-slate-700/50 border border-slate-600 rounded-full hover:bg-slate-700 transition-transform transform hover:scale-105 shadow-lg">
            Daha Fazlası
          </Link>
        </div>
      </div>
    </main>
  );
}