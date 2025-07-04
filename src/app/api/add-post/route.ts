import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const runtime = 'nodejs';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBJQsiVTSHqJ5VQYnQF56N1E9hjdlw_Cq4',
  authDomain: 'kocluk-app-f3e63.firebaseapp.com',
  projectId: 'kocluk-app-f3e63',
  storageBucket: 'kocluk-app-f3e63.appspot.com',
  messagingSenderId: '675406832543',
  appId: '1:675406832543:web:c814a921fdce6f212493aa',
  measurementId: 'G-8TBPM0NKNP',
};

// Initialize Firebase app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.ADD_POST_API_KEY) {
      return NextResponse.json({ error: 'Geçersiz API anahtarı.' }, { status: 401 });
    }

    const { title, imageUrl, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Başlık ve içerik zorunludur.' }, { status: 400 });
    }

    // slug oluştur
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Aynı slug var mı kontrol et
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('slug', '==', slug));
    const existing = await getDocs(q);
    if (!existing.empty) {
      return NextResponse.json({ error: 'Bu başlığa sahip bir yazı zaten mevcut.' }, { status: 409 });
    }

    // Firestore'a ekle
    await addDoc(postsRef, {
      title,
      imageUrl: imageUrl || '',
      content,
      slug,
      date: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Yazı başarıyla oluşturuldu.', slug }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
