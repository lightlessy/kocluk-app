'use client';

export default function WhatsAppCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="https://chat.whatsapp.com/BVSXAtpzsIfLFRqdmeleOK"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-full shadow-xl hover:bg-orange-600 transition-all"
      >
        <span className="text-xl">📱</span>
        <span className="font-semibold">Topluluğa Katıl</span>
      </a>
    </div>
  );
}
