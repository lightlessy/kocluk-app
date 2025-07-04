// app/posts/[slug]/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { notFound } from 'next/navigation';

// 1. getStaticPaths: Hangi 'slug' değerleri için sayfa oluşturulacağını Next.js'e bildirir.
// Bu fonksiyon derleme (build) sırasında çalışır.
export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDir);

  const slugs = filenames.map((filename) => ({
    slug: filename.replace('.md', ''),
  }));

  return slugs;
}

// Helper fonksiyonu: Tek bir post verisini getirmek için
function getPostData(slug: string) {
  const postsDir = path.join(process.cwd(), 'posts');
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null; // Eğer dosya yoksa null döndür
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || 'Başlık Yok',
    date: data.date || new Date().toISOString(),
    ...data,
    content,
    readingTime: Math.ceil(stats.minutes),
  };
}

// 2. Sayfa Bileşeni ve getStaticProps mantığı (App Router'da doğrudan sayfada)
// Bu kısım da derleme sırasında her bir slug için çalışır.
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostData(params.slug);

  // Eğer post bulunamazsa 404 sayfasına yönlendir.
  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>Yayın Tarihi: {new Date(post.date).toLocaleDateString('tr-TR')} | Okuma Süresi: {post.readingTime} dakika</p>
      <hr />
      {/* Markdown içeriğini HTML'e dönüştürüp burada göstermeniz gerekir */}
      {/* Bunun için 'marked' veya 'react-markdown' gibi bir kütüphane kullanabilirsiniz. */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} /> {/* Örnek - Güvenlik riski olabilir! */}
    </article>
  );
}