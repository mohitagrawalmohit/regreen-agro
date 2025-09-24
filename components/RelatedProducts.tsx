'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";

type RelatedProduct = {
  id: number | string;
  cc: string;
  title: string;
  rating: number | string;
  discountpercent: number;
  amountsaved: number;
  price: number;
  mrp: number;
  media1?: string;
  media2?: string;
  media3?: string;
  media4?: string;
  media5?: string;
  name?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RelatedProducts({
  relatedProducts = [],
  mobileCols = 2,
}: {
  relatedProducts: RelatedProduct[];
  mobileCols?: number;
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8; // 80% of visible width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full px-4 md:px-4 py-8">
      <h2 className="text-2xl text-white/100 font-bold mb-4">Explore More Related Products</h2>

      {/* Left Button */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:shadow-lg"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Products Row */}
      <div
        ref={scrollRef}
        className="flex space-x-4 px-6 md:px-8 overflow-x-hidden scroll-smooth"
      >
        {relatedProducts.map((product) => {
          const productImage =
            product.media1 || product.media2 || product.media3 || product.media4 || product.media5;

          return (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="flex-shrink-0 w-[75%] sm:w-[45%] md:w-[30%] lg:w-[25%] bg-white rounded-[20px] shadow-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer"
            >
              {/* Product Info */}
              <div className="bg-white p-3 md:p-4 flex flex-col justify-center items-start">
                <h3
                  className={`font-semibold mb-1 ${
                    mobileCols === 1
                      ? 'text-lg md:text-lg'
                      : 'text-sm md:text-sm'
                  }`}
                >
                  {product.cc} | {product.title}
                </h3>

                <div
                  className={`flex items-center mb-1 ${
                    mobileCols === 1
                      ? 'text-sm md:text-base'
                      : 'text-xs md:text-sm'
                  }`}
                >
                  <Image
                    src="/staricon.png"
                    alt="star"
                    width={16}
                    height={16}
                    className="w-4 h-4 mr-1"
                  />
                  <span>Rated {product.rating}</span>
                </div>

                <h3
                  className={`mb-1 text-[#30BB7E] ${
                    mobileCols === 1
                      ? 'text-sm md:text-base'
                      : 'text-xs md:text-sm'
                  }`}
                >
                  {product.discountpercent}% OFF - You Save Rs.{product.amountsaved}
                </h3>

                <div className="text-left mb-1">
                  <span
                    className={`${
                      mobileCols === 1
                        ? 'text-lg md:text-xl'
                        : 'text-base md:text-lg'
                    } font-bold text-black`}
                  >
                    Rs.{product.price}
                  </span>{' '}
                  <span
                    className={`${
                      mobileCols === 1
                        ? 'text-sm md:text-base'
                        : 'text-xs md:text-sm'
                    } line-through text-gray-500`}
                  >
                    Rs.{product.mrp}
                  </span>
                </div>
              </div>

              {/* ✅ Fixed Product Image */}
           <div className="bg-white border-t-4 border-gray-200 flex justify-center items-center p-2 md:p-0 h-40 md:h-58">
  {productImage ? (
    <Image
      src={`${productImage}`}
      alt={product.title || "Product image"}
      width={300} 
      height={300}
      className="w-full h-full object-contain"
    />
  ) : (
    <div className="text-gray-400 text-sm">No Image</div>
  )}
</div>
{/* ✅ Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-2 p-3">
    {/* WhatsApp Button */}
    <a
      href={`https://wa.me/917830060444?text=Hello,%20I%20want%20to%20order%20${encodeURIComponent(product.title)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full s sm:w-1/2 h-[20px] sm:h-[30px] px-4 sm:py-1 py-1 bg-[#1DA946] text-[8px] sm:text-[10px] font-[sans-serif] text-white font-bold rounded-md hover:bg-[#1DA946] flex items-center justify-center"
    >
      <img src="/whatsapp icon.png"
        alt="whatsapp icon"
        className="w-6 h-6 md:w-8 md:h-8 object-contain" />
      WhatsApp
    </a>

    {/* Call Button */}
    <a
      href="#contact"
      className="w-full sm:w-1/2 h-[20px] sm:h-[30px] px-4  sm:py-1 py-1 bg-transparent border border-[#F29728] text-[8px] sm:text-[10px] font-[sans-serif] text-[#F29728] font-bold rounded-md hover:bg-[#F29728] hover:text-white flex items-center justify-center"
    >
      Enquire Us
    </a>
  </div>
            </div>
          );
        })}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:shadow-lg"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>
    </div>
  );
}
