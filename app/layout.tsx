// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import { Toaster } from "sonner";
import Script from "next/script"; // ✅ Import Script

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Regreen Agro",
  description: "Buy the best agricultural machinery online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '767330916344478');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* NoScript fallback (for browsers without JS) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=767330916344478&ev=PageView&noscript=1"
          />
        </noscript>
      </head>

      <body className={inter.className + " bg-[#f9fff2] text-green-900"}>
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
