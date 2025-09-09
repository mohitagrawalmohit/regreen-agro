"use client";

import { useState, useEffect } from "react";
import FuturisticImageLoader from "@/components/FuturisticImageLoader";

export default function PageLoaderWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Loader shows for 2.5s, adjust as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <FuturisticImageLoader />;
  }

  return <>{children}</>;
}
