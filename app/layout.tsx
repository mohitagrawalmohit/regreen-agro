// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Regreen Agro',
  description: 'Buy the best agricultural machinery online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-[#f9fff2] text-green-900'}>
        <PageLoaderWrapper>
        <Navbar />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <Footer />
        </PageLoaderWrapper>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
