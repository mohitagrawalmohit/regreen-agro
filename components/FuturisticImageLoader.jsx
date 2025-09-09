"use client";

import { motion } from "framer-motion";

const images = [
  "/Category 2d Images/PoweWeeder Animated image.png",
  "/Category 2d Images/earth auger 2d image.png",
  "/Category 2d Images/waterpump.png",
  "/Category 2d Images/sprayers 2d image.png",
  "/Category 2d Images/crop reaper 2d image.png",
];

export default function FuturisticImageLoader() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-black overflow-hidden">
      {/* Loader strip (100px tall area in the center) */}
      <div className="relative w-[100px] h-[100px] md:w-[400px] md:h-[100px] overflow-hidden">
        <motion.div
          className="flex gap-8 absolute"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 5,
            ease: "linear",
          }}
        >
          {/* Duplicate list for seamless looping */}
          {[...images, ...images].map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt="Product Loader"
              className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(0,255,255,0.7)]"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
