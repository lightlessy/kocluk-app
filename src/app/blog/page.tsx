import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import './blog.css';
// app/blog/[slug]/page.tsx gibi dinamik sayfalarda:


// Helper function to get posts
const getPosts = () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      ...(matterResult.data as { title: string; date: string; focus?: boolean; author?: string; imageUrl?: string }),
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
};


export default function Blog() {
  const posts = getPosts();
  const focusedPost = posts.find(post => post.focus);
  const otherPosts = posts.filter(post => !post.focus);

  return (
    <div className="blog-container">
      <h1 className="blog-header">Tüm Yazılar</h1>

      {focusedPost && (
        <div className="focused-post-section">
          <Link href={`/blog/${focusedPost.slug}`} className="focused-post-card">
            <img src={focusedPost.imageUrl || '/images/goc.jpg'} alt={focusedPost.title} className="card-image" />
            <div className="card-content">
              <h2 className="card-title">{focusedPost.title}</h2>
              <p className="card-date">
                {focusedPost.author && <span className="card-author">{focusedPost.author} - </span>}
                {new Date(focusedPost.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </Link>
        </div>
      )}

      <div className="blog-grid">
        {otherPosts.map(({ slug, title, date, author, imageUrl }) => (
          <Link href={`/blog/${slug}`} key={slug} className="blog-card">
            <img src={imageUrl || '/images/goc.jpg'} alt={title} className="card-image" />
            <div className="card-content">
              <h2 className="card-title">{title}</h2>
              <p className="card-date">
                {author && <span className="card-author">{author} - </span>}
                {new Date(date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}