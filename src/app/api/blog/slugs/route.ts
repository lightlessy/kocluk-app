import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  const postsDir = path.join(process.cwd(), 'posts');
  if (!fs.existsSync(postsDir)) {
    return NextResponse.json([]);
  }
  const fileNames = fs.readdirSync(postsDir);
  // ["slug1.md", "slug2.md"] -> ["slug1", "slug2"]
  const slugs = fileNames
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
  return NextResponse.json(slugs);
}

// Bu dosya güvenli, değişiklik gerekmez.
