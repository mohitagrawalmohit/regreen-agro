'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Power Weeder & Tiller', image: '/CategoryCardsImage/power weeder cat.png', slug: 'Power Weeder & Tiller' },
   { name: 'Earth Auger', image: '/CategoryCardsImage/earth auger cat.png', slug: 'Earth Auger' },
  { name: 'Pumps & Irrigation', image: '/CategoryCardsImage/pump & irrigation cat.png', slug: 'Pumps & Irrigation' },
  { name: 'Sprayers & Crop Protection', image: '/CategoryCardsImage/sprayar cat.png', slug: 'Sprayers & Crop Protection' },
    { name: 'Harvesting Machinery', image: '/CategoryCardsImage/harvesting machinary cat.png', slug: 'Harvesting Machinery' },
     { name: 'Post Harvesting', image: '/CategoryCardsImage/post harvesting cat.png', slug: 'Post Harvesting' }, 
      { name: 'Lawn Mower & Gardening Tools', image: '/CategoryCardsImage/lawn mower cat.png', slug: 'Lawn Mower & Gardening Tools' },
     { name: 'Power & Engines', image: '/CategoryCardsImage/power engines cat.png', slug: 'Power & Engines' },
  
  // Add more if needed
];

export default function CategorySection() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 250;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative w-full min-h-full md:min-h-[500px] bg-[url('/category-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/50 z-10" />

      <div className="relative z-20 px-4 md:px-24 py-10 text-white">
        <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-8 text-center md:text-left">
          Browse Categories
        </h2>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute z-30 left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white text-black rounded-full p-2 shadow-md hover:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute z-30 right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white text-black rounded-full p-2 shadow-md hover:bg-gray-200"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth hide-scrollbar w-full min-h-[280px] md:min-h-[400px] md:pt-8 pt-3"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="
                min-w-[220px] h-[260px]               /* mobile size */
                md:min-w-[400px] md:h-[320px]        /* desktop unchanged */
                bg-white/100 rounded-xl 
                p-4 md:p-6 flex-shrink-0 
                backdrop-blur-md text-white 
                transition-transform hover:scale-120 hover:shadow-2xl hover:z-50 active:scale-100
              "
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full max-w-55 max-w-55 md:max-w-60 md:max-w-60 h-45 md:h-60 object-contain mb-3 md:mb-1"
                />
                <h3 className="text-lg md:text-xl font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
