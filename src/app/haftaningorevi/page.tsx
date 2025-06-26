import InteractiveCounter from '../components/InteractiveCounter';
import "./haftaningorevi.css";
import WhatsAppCTA from '../components/WhatsAppCTA';


export default function Hakkimizda() {
    const hedef = new Date();
    const bugun = hedef.getDay();
    const kacGunSonra = (11 - bugun) % 7 || 7; // Eğer bugün Perşembe ise 7 gün sonra döner
    hedef.setDate(hedef.getDate() + kacGunSonra);
    hedef.setHours(20, 0, 0, 0); // Saati 20:00 yap
  
  return (
<div style={{ backgroundColor: "#1E293B"}}>
  <h1 className="text-6xl font-bold text-center mt-16 mb-8">Haftanın Görevi</h1>
  <br />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-4 bg-gray-900 rounded-lg shadow-md flex flex-col justify-center">
            <InteractiveCounter targetDate={hedef.toISOString()} />
        </div>
         <div className="p-4 bg-gray-900 rounded-lg shadow-md">
                  
                  <h2 className="text-xl font-bold mt-4">HAFTANIN KONULARI</h2>
                    <ul className="konu-listesi mt-4">
                      <li className="text-center mt-4 ">Beyzamı Seviyorum</li> 
                      <li className="text-center mt-4 ">Türevin Geometrik Yorumu</li>
                      <li className="text-center mt-4 ">Doğruda Denklemler</li>
                      <li className="text-center mt-4 ">Akışkanlar Fiziği</li>
                      <li className="text-center mt-4 ">Doğruda Denklemler</li>

                    </ul>
                  
        </div>
         <div className="p-4 bg-gray-900 rounded-lg shadow-md">
                  
                  <h2 className="text-xl font-bold mt-4">Beyzamı Seviyorum</h2>
                  <p className="mt-2">
                    Lorem ipsum dolor Beyzamı seviyorum sit amet, consectetur elit.
                  </p>
        </div>
         <div className="p-4 bg-gray-900 rounded-lg shadow-md">
            <div className="mt-4 aspect-video">
                <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/8QjRPODpmBM" // ← Buraya kendi video linkini göm
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg shadow-md">
            <div className="mt-4 aspect-video">
                <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" // ← Buraya kendi video linkini göm
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg shadow-md">
            <div className="mt-4 aspect-video">
                <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" // ← Buraya kendi video linkini göm
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        </div>
          <WhatsAppCTA />
    </div>
  </div>

  )
}
