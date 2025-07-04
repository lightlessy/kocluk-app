"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './blog.css';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase config (güvenlik için .env'ye taşıyabilirsiniz)
const firebaseConfig = {
  apiKey: "AIzaSyBJQsiVTSHqJ5VQYnQF56N1E9hjdlw_Cq4",
  authDomain: "kocluk-app-f3e63.firebaseapp.com",
  projectId: "kocluk-app-f3e63",
  storageBucket: "kocluk-app-f3e63.appspot.com",
  messagingSenderId: "675406832543",
  appId: "1:675406832543:web:c814a921fdce6f212493aa",
  measurementId: "G-8TBPM0NKNP"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

type Post = {
  slug: string;
  title: string;
  date: string;
  focus?: boolean;
  author?: string;
  imageUrl?: string;
};

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsRef = collection(db, 'posts');
        const snapshot = await getDocs(postsRef);
        const postList: Post[] = [];
        snapshot.forEach(doc => {
          postList.push(doc.data() as Post);
        });
        postList.sort((a, b) => (a.date < b.date ? 1 : -1));
        setPosts(postList);
        setLoading(false);
      } catch {
        setError('Yazılar yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div className="blog-container">Yükleniyor...</div>;
  if (error) return <div className="blog-container text-red-500">{error}</div>;

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