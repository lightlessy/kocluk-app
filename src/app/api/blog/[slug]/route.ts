import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import readingTime from 'reading-time';

export const runtime = 'nodejs';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return NextResponse.json({ error: 'Gönderi bulunamadı.' }, { status: 404 });
    }
    const doc = snapshot.docs[0];
    const data = doc.data();
    const stats = readingTime(data.content || '');

    return NextResponse.json({
      post: {
        slug,
        title: data.title || 'Başlık Yok',
        date: data.date || new Date().toISOString(),
        ...data,
        content: data.content || '',
        readingTime: Math.ceil(stats.minutes),
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
