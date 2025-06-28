import { FiPenTool } from 'react-icons/fi';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-block bg-slate-800/50 border border-slate-700 rounded-full p-4 mb-6">
            <FiPenTool size={40} className="text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
          Blog Yakında Sizlerle
        </h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
          YKS stratejileri, motivasyon yazıları, ders notları ve daha fazlasını içeren blog yazılarımız için hazırlıklarımız devam ediyor. Bizi takipte kalın!
        </p>
      </div>
    </div>
  );
}
