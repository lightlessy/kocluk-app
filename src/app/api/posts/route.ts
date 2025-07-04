
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames.map(filename => ({
      slug: filename.replace(/\.md$/, ''),
      title: filename.replace(/\.md$/, '').replace(/-/g, ' '),
    }));
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
