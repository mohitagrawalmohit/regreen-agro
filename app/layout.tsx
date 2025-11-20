  // app/layout.tsx

  import "./globals.css";
  import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import Navbar from "@/components/Navbar";
  import Footer from "@/components/Footer";
  import PageLoaderWrapper from "@/components/PageLoaderWrapper";
  import { Toaster } from "sonner";
  import Script from "next/script"; // ✅ Import Script
  import FlashTopBar from "@/components/FlashTopBar";


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
          {/* ✅ Google Analytics (GA4) */}
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-63F46B1LG5"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-63F46B1LG5');
            `}
          </Script>

          {/* ✅ Google Tag Manager (Head) */}
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5L5LV2J3');
            `}
          </Script>

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

          {/* NoScript fallback for Meta Pixel */}
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
          {/* ✅ Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-5L5LV2J3"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
 
          <PageLoaderWrapper>
            <FlashTopBar/>

            <Navbar />
            
            <a
    href="#contact"
    className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 bg-[#F29728] hover:bg-[#d9821f] text-white font-semibold px-3 py-1 md:px-4 md:py-3  shadow-lg rotate-90 origin-right transition"
  >
    Contact Us
  </a>

            <main className="min-h-[calc(100vh-160px)]">{children}</main>
            <Footer />
            {/* ✅ Floating WhatsApp Button (Right Bottom) */}
<a
  href="https://wa.me/917830060444?text=Hello%2C%20I%20want%20to%20know%20more%20about%20your%20products"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed right-5 bottom-6 z-50 w-14 h-14 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition"
>
  <img
    src="/whatsapp icon.png"
    alt="WhatsApp"
    className="w-12 h-12"
  />
</a>
          </PageLoaderWrapper>

          <Toaster richColors position="top-right" />
        </body>
      </html>
    );
  }
