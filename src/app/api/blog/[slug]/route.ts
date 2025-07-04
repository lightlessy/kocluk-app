import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest, // 1. PARAMETRE: Her zaman gelen istektir.
  context: { params: { slug: string } } // 2. PARAMETRE: Dinamik kısımları içerir.
) {
  const { slug } = context.params;
  const postsDir = path.join(process.cwd(), 'posts');
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Gönderi bulunamadı.' }, { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return NextResponse.json({
    post: {
      slug,
      title: data.title || 'Başlık Yok',
      date: data.date || new Date().toISOString(),
      ...data,
      content,
      readingTime: Math.ceil(stats.minutes),
    },
  });
}
