'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Power Weeder & Tiller', image: '/Category 2d Images/PoweWeeder Animated image.png', slug: 'Power Weeder & Tiller' },
   { name: 'Earth Auger', image: '/Category 2d Images/earth auger 2d image.png', slug: 'Earth Auger' },
  { name: 'Pumps & Irrigation', image: '/Category 2d Images/waterpump.png', slug: 'Pumps & Irrigation' },
  { name: 'Sprayers & Crop Protection', image: '/Category 2d Images/sprayers 2d image.png', slug: 'Sprayers & Crop Protection' },
    { name: 'Harvesting Machinery', image: '/Category 2d Images/crop reaper 2d image.png', slug: 'Harvesting Machinery' },
     { name: 'Post Harvesting', image: '/Category 2d Images/Post harvesting 2d.png', slug: 'Post Harvesting' }, 
      { name: 'Lawn Mower & Gardening Tools', image: '/Category 2d Images/lawn mower 2d image.png', slug: 'Lawn Mower & Gardening Tools' },
     { name: 'Power & Engines', image: '/Category 2d Images/power weeder engine 2d image.png', slug: 'Power & Engines' },
  
  
  
 
 // Add more if needed
];

export default function CategorySection({ mobile = false }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 250;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // ✅ Mobile view → vertical list
  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="flex items-center gap-1 bg-gray-50 border rounded-lg p-1 hover:bg-gray-100 transition"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-10 h-10 object-contain"
            />
            <span className="text-gray-800 text-[10px]">{category.name}</span>
          </Link>
        ))}
      </div>
    );
  }

  // ✅ Desktop view → horizontal scroll
  return (
    <section className="relative w-full min-h-full bg-none bg-cover bg-center bg-no-repeat">
      <div className="relative z-20 px-4 md:px-25 md:pt-2 text-black">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute z-30 left-2 md:left-6 top-1/2 -translate-y-1/2 bg-[#2cd882] text-black rounded-full p-2 shadow-md hover:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute z-30 right-2 md:right-6 top-1/2 -translate-y-1/2 bg-[#2cd882] text-black rounded-full p-2 shadow-md hover:bg-gray-200"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-4 overflow-x-auto scroll-smooth hide-scrollbar w-full min-h-[190px] md:pt-6 pt-3"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="
                min-w-[120px] h-[160px]               /* mobile size */
                md:max-w-[150px] md:min-w-[150px] md:h-[100px]  /* desktop size */
                bg-white rounded-xl 
                p-4 md:p-1 flex-shrink-0 
                backdrop-blur-md 
                transition-transform hover:scale-105 hover:shadow-2xl hover:z-50 active:scale-100
              "
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-36 md:h-24 object-contain mb-3 md:mb-0"
                />
                <h3 className="text-lg md:text-sm text-white font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
