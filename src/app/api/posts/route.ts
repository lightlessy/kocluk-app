import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export const runtime = 'nodejs';

// Firebase config (güvenlik için .env'ye taşıyabilirsiniz)
const firebaseConfig = {
  apiKey: 'AIzaSyBJQsiVTSHqJ5VQYnQF56N1E9hjdlw_Cq4',
  authDomain: 'kocluk-app-f3e63.firebaseapp.com',
  projectId: 'kocluk-app-f3e63',
  storageBucket: 'kocluk-app-f3e63.appspot.com',
  messagingSenderId: '675406832543',
  appId: '1:675406832543:web:c814a921fdce6f212493aa',
  measurementId: 'G-8TBPM0NKNP',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function GET() {
  try {
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);
    const posts: any[] = [];
    snapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id });
    });
    // Tarihe göre sırala (en yeni başta)
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));
    return NextResponse.json({ posts });
  } catch (e) {
    console.error('API Hatası:', e);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}

