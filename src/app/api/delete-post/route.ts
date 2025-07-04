
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);
    fs.unlinkSync(filePath);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
