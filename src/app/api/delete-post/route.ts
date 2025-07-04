import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

export async function POST(request: Request) {
  const { slug } = await request.json();
  const apiKey = request.headers.get('x-api-key');

  if (apiKey !== process.env.DELETE_POST_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Silinecek dokümanları bul ve sil
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, 'posts', d.id));
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
