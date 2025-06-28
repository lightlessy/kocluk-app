import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // E-posta gönderen hesap bilgileri (Ortam Değişkenlerinden alınmalı)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // veya başka bir e-posta sağlayıcısı
      auth: {
        user: process.env.EMAIL_USER, // .env.local dosyasında tanımlanmalı
        pass: process.env.EMAIL_PASS, // .env.local dosyasında tanımlanmalı
      },
    });

    // E-posta içeriği
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER, // Alıcı e-posta adresi
      subject: `Yeni İletişim Formu Mesajı - ${name}`,
      html: `
        <h2>Yeni Bir Mesaj Aldınız</h2>
        <p><strong>Gönderen:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <h3>Mesaj:</h3>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Mesaj başarıyla gönderildi!' }, { status: 200 });

  } catch (error) {
    console.error('E-posta gönderim hatası:', error);
    return NextResponse.json({ message: 'Mesaj gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}
