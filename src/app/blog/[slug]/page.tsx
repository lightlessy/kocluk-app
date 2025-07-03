// /src/app/blog/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import './post.css';
import MarkdownClientWrapper from '../../components/MarkdownClientWrapper'; // wrapper client component


const postsDirectory = path.join(process.cwd(), 'posts');

async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    slug,
    content,
    readingTime,
    ...(data as { title: string; date: string }),
  };
}

export async function generateStaticParams() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ''),
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);

  return (
    <article className="post-container">
      <header className="post-header">
        <h1 className="post-title">{postData.title}</h1>
        <div className="post-date">
          {new Date(postData.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })} · {postData.readingTime} dk okuma
        </div>
      </header>
      <MarkdownClientWrapper content={postData.content} />
    </article>
  );
}
