"use client";
import { useState, useEffect } from "react";

const messages = [
  "🔥 Launch Sale: Up to 50% Off on Aiva Italy Products",
  "🚚 Free Shipping Across PAN India",
  "🛠️ Aiva Italy Technical Support | 📘 100% Machine Guide Available",
];


export default function FlashTopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black text-white text-[11px]  md:text-sm py-1 md:py-2 text-center font-medium overflow-hidden">
      <div key={index} className="animate-fadeIn transition-all duration-500">
        {messages[index]}
      </div>
    </div>
  );
}
