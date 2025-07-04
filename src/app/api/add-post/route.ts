import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // edge değil, çünkü fs kullanılacak

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    console.log('API Key gelen:', apiKey);
    console.log('process.env.ADD_POST_API_KEY:', process.env.ADD_POST_API_KEY);
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

    // Yazı içeriğini markdown veya html olarak oluştur
    const fileContent = `---
title: "${title}"
imageUrl: "${imageUrl || ''}"
date: "${new Date().toISOString()}"
slug: "${slug}"
---

${content}
`;

    // Yazı dosyasının yolu (örnek: /posts/slug.md)
      const postsDir = path.join(process.cwd(), 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir);
    }
    const filePath = path.join(postsDir, `${slug}.md`);

    // Eğer dosya zaten varsa hata döndür
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Bu başlığa sahip bir yazı zaten mevcut.' }, { status: 409 });
    }

    // Dosyayı yaz
    fs.writeFileSync(filePath, fileContent);

    return NextResponse.json({ success: true, message: 'Yazı başarıyla oluşturuldu.', slug }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
