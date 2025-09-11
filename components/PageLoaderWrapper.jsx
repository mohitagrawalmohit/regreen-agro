"use client";

import { useState, useEffect } from "react";
import FuturisticImageLoader from "@/components/FuturisticImageLoader";

export default function PageLoaderWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);

    // If page already loaded (e.g., cached reload)
    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (loading) {
    return <FuturisticImageLoader />;
  }

  return <>{children}</>;
}
