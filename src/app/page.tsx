import Image from "next/image";

export default function Hizmetler() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Hizmetlerimiz</h1>
      <p className="mb-8">
        Yaşam koçluğu, kariyer planlama, stres yönetimi ve daha fazlası...
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-gray-900 rounded-lg shadow-md">
          <Image
            src="/images/goc.jpg"
            alt="Yaşam Koçluğu"
            width={500}
            height={300}
            className="rounded-lg object-cover"
          />
          <h2 className="text-xl font-bold mt-4">Yaşam Koçluğu</h2>
          <p className="mt-2">
            Bireylerin hedeflerine ulaşmalarına yardımcı olmak için kişisel
            gelişim ve motivasyon teknikleri.
          </p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg shadow-md">
          <Image
            src="/images/goc.jpg"
            alt="Kariyer Planlama"
            width={500}
            height={300}
            className="rounded-lg object-cover"
          />
          <h2 className="text-xl font-bold mt-4">Kariyer Planlama</h2>
          <p className="mt-2">
            Kariyer hedeflerinizi belirlemenize ve bu hedeflere ulaşmanıza
            yardımcı olacak stratejiler.
          </p>
        </div>

         <div className="p-4 bg-gray-900 rounded-lg shadow-md">
          <Image
            src="/images/goc.jpg"
            alt="Kariyer Planlama"
            width={500}
            height={300}
            className="rounded-lg object-cover"
          />
          <h2 className="text-xl font-bold mt-4">Kariyer Planlama</h2>
          <p className="mt-2">
            Kariyer hedeflerinizi belirlemenize ve bu hedeflere ulaşmanıza
            yardımcı olacak stratejiler.
          </p>
        </div>


      </div>
   
   
   
   
    </div>

    
  );
}

export const metadata = {
  title: 'Hizmetlerimiz - Koçluk Sitesi',
  description: 'Yaşam koçluğu, kariyer planlama ve daha fazlası...',
};
