import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "Koçluk Sitesi",
  description: "Site Açıklaması",
  openGraph: {
    images: ['/public/verlel.svg'],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow mx-auto w-full px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}


    