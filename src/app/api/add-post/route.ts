import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper to create a URL-friendly slug
const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -

export async function POST(req: NextRequest) {
  try {
    const { title, content, imageUrl, secret } = await req.json();

    // 1. Validate Secret Key
    if (secret !== process.env.POST_SECRET) {
      return NextResponse.json({ message: 'Geçersiz gizli anahtar.' }, { status: 401 });
    }

    // 2. Validate Input
    if (!title || !content) {
      return NextResponse.json({ message: 'Başlık ve içerik alanları zorunludur.' }, { status: 400 });
    }

    // 3. Create Post File
    const slug = slugify(title);
    const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const fileContent = `---
title: "${title}"
date: "${date}"
${imageUrl ? `image: "${imageUrl}"\n` : ''}---

${content}`;


    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

    // Check if file already exists to prevent overwriting
    if (fs.existsSync(filePath)) {
        return NextResponse.json({ message: 'Bu başlığa sahip bir yazı zaten mevcut.' }, { status: 409 });
    }

    fs.writeFileSync(filePath, fileContent);

    return NextResponse.json({ message: 'Yazı başarıyla oluşturuldu.', slug }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
