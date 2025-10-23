// lib/useMetaPixel.ts
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 👇 Tell TypeScript about fbq
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function useMetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);
}
