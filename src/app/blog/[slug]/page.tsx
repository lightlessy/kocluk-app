import React from "react";
import { notFound } from 'next/navigation';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const plainContent = stripHtml(post.content);
  
  return {
    title: post.title,
    description: post.description || plainContent.slice(0, 150),
    openGraph: {
      title: post.title,
      description: post.description || plainContent.slice(0, 150),
      images: [post.imageUrl || '/images/goc.jpg'],
    },
  };
}

interface Post {
  title: string;
  content: string;
  date: string;
  readingTime: number;
  description?: string;
  imageUrl?: string;
}

function getApiBaseUrl() {
  return "http://localhost:3000";
}

async function getPost(slug: string): Promise<Post> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/blog/${slug}`);
  if (!res.ok) {
    notFound();
  }
  const data = await res.json();
  return data.post;
}

export async function generateStaticParams() {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/blog/slugs`);
    if (!res.ok) return [];

    const slugs: string[] = await res.json();
    if (!Array.isArray(slugs)) return [];

    return slugs
      .filter((slug) => typeof slug === "string" && slug.length > 0)
      .map((slug) => ({ slug }));
  } catch (error) {
    console.error('Slug oluşturulurken hata:', error);
    return [];
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const plainContent = stripHtml(post.content);

  function preserveEmptyLines(html: string) {
    return html.replace(/<p>(\s|&nbsp;)*<\/p>/g, '<p><br></p>');
  }

  const processedContent = preserveEmptyLines(post.content);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description || plainContent.slice(0, 150),
    "datePublished": post.date,
    "image": post.imageUrl,
    "author": {
      "@type": "Person",
      "name": "Faruk Şengül"
    }
  };

  function MetaBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200 mr-2 mb-2 transition hover:bg-blue-100">
        {icon}
        {label}
      </span>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="max-w-4xl mx-auto py-12 mt-8">
        <style>{/* ProseMirror CSS burada kalıyor, değişmedi */}</style>
        <h1 className="text-3xl md:text-4xl font-bold border-b-2 border-blue-200 py-2 mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center mb-6 gap-2">
          {post.date && (
            <MetaBadge
              icon={
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                  <rect x="3" y="5" width="12" height="10" rx="2" />
                  <path d="M16 7H2" />
                  <path d="M7 3v2" />
                  <path d="M11 3v2" />
                </svg>
              }
              label={new Date(post.date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          )}
          {post.readingTime && (
            <MetaBadge
              icon={
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
                  <circle cx="9" cy="9" r="7" />
                  <path d="M9 5v4l2 2" />
                </svg>
              }
              label={`${post.readingTime} dk okuma`}
            />
          )}
        </div>
        <div
          className="ProseMirror prose max-w-none p-6 rounded-lg shadow-.md"
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </article>
    </>
  );
}
