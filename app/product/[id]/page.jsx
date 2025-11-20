'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from "next/image";
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductTabs from '@/components/ProductTabs';
import RelatedProducts from '@/components/RelatedProducts';
import { CheckIcon } from "@heroicons/react/24/solid";
import CategorySearchBar from '@/components/CategorySearchBar';
import ContactForm from "@/components/contactusForm";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // fetch main product
        const res = await fetch(`${BASE_URL}api/products/${id}`);
        const data = await res.json();

        // fetch specifications
        const specsRes = await fetch(`${BASE_URL}api/specifications/${id}`);
        const specs = await specsRes.json();

        const productWithSpecs = { ...data, specifications: specs };
        setProduct(productWithSpecs);

        // fetch related products by category (using cc or category)
        const category = data?.category || data?.cc;
      if (category) {
        // 🔄 changed → fetch all products instead of ?category
        const relatedRes = await fetch(`${BASE_URL}api/products`); 
        const related = await relatedRes.json();

        // 🔄 changed → filter manually by category & exclude current product
        const relatedFiltered = related.filter(
          (p) =>
            p.id !== data.id &&
            (p.category?.toLowerCase() === category.toLowerCase() ||
             p.cc?.toLowerCase() === category.toLowerCase())
        );

        setRelatedProducts(relatedFiltered); // 🔄 changed
      }
    } catch (err) {
      console.error("Error fetching product or related:", err);
    }
  }

  if (id) fetchProduct();
}, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <section
      className="relative w-full h-full py-4 px-2 sm:px-8 md:px-40"
      style={{ background: "radial-gradient(circle, #1b7c4a 0%, #003018 100%)" }}
    >
      <div className="relative mb-4 md:mb-6 w-full px-4 md:px-0">
  <CategorySearchBar />
</div>
      <div className="max-w-[1400px] mx-auto">
        {/* ---------------- Mobile View ---------------- */}
        <div className="flex flex-col gap-2 md:hidden text-center">
          <div className="text-[22px] sm:text-[32px] font-bold font-[sans-serif]">
            <span className="text-white">{product.cc}</span>
            <span className="text-[#30BB7E]"> India's Most Trusted</span>
          </div>

          <h1 className="text-[22px] sm:text-[24px] font-bold text-white font-[sans-serif]">
            {product.title}
          </h1>

          <div className="flex justify-center items-center gap-2 text-white text-[14px] sm:text-[16px]">
            <Image // CHANGED HERE ✅
              src="/staricon.png"
              alt="star"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <span>Rated 4.8</span>
          </div>

          <ProductImageGallery product={product} />

          <div className="flex justify-center gap-6 text-white text-[14px] sm:text-[16px] mt-2 flex-wrap">
  
  {/* Free Express Delivery */}
  <div className="flex items-center gap-1">
    <Image src="/free-delivery.webp" alt="delivery" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
    <span>Free Express Delivery</span>
  </div>

  {/* Longer Machine Life */}
  <div className="flex items-center gap-1">
    <Image src="/longer-life.webp" alt="machine life" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
    <span>2× Longer Machine Life</span>
  </div>

  {/* After Sales Support */}
  <div className="flex items-center gap-1">
    <Image src="/after-sales.webp" alt="after sales" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
    <span>After-Sales Support</span>
  </div>

  {/* 100% Quality Assurance */}
  <div className="flex items-center gap-1">
    <Image src="/quality.webp" alt="quality" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
    <span>100% Quality Assurance</span>
  </div>

</div>


          <div className="flex justify-center gap-2 items-baseline text-[16px] sm:text-[18px] mt-2 flex-wrap">
            <span className="text-white font-bold">₹{product.price}</span>
            <span className="line-through text-gray-400">₹{product.mrp}</span>
            <span className="text-[#30BB7E]">{product.discountpercent}% OFF</span>
            <span className="text-[#30BB7E]">You Save ₹{product.amountsaved}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <a
  href="https://wa.me/917830060444?text=Hello%20I%20am%20interested%20in%20your%20products" 
  target="_blank"
  rel="noopener noreferrer" className="w-full sm:w-[280px] h-[40px] px-4 py-1 bg-[#F29728] text-white font-bold rounded-md hover:bg-[#1DA946]">
              Order On Whatsapp
            </a>
            <a
  href="tel:+919027799171" className="w-full sm:w-[280px] h-[40px] px-4 py-1 bg-transparent border border-[#F29728] text-white font-bold rounded-md hover:bg-[#1DA946]">
              Call Us To Order
            </a>
          </div>

          <div className="flex flex-col gap-3 bg-white rounded-2xl p-4 sm:p-8 shadow-md w-full h-auto max-h-[300px] overflow-y-auto mt-4">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#30BB7E] flex-shrink-0">
                  <CheckIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="flex-1 text-left text-gray-800 text-[14px] sm:text-base leading-snug">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Desktop View ---------------- */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 items-start">
          <ProductImageGallery product={product} />

          <div className="flex flex-col gap-1 md:pl-10">
            <div className="text-[28px] sm:text-[32px] md:text-[35px] mb-1 pl-2">
              <span className="text-white font-bold font-[sans-serif]">{product.cc}</span>
              <span className="text-[#30BB7E] font-bold"> India's Most Trusted </span>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 h-full px-0 sm:px-2 md:px-2 items-start w-full mb-4 gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-[22px] sm:text-[24px] md:text-[25px] font-bold text-white font-[sans-serif]">
                  {product.title}
                </h1>
                <div className="text-[18px] sm:text-[19px] md:text-[20px] font-bold">
                  <span className="text-white font-[sans-serif]">₹{product.price}</span>{' '}
                  <span className="line-through font-[sans-serif] text-gray-400 text-lg">₹{product.mrp}</span>
                </div>
                <p className="text-[#30BB7E] text-lg sm:text-xl md:text-xl">
                  {product.discountpercent}% OFF - You Save ₹{product.amountsaved}
                </p>
                <a
  href="https://wa.me/917830060444?text=Hello%20I%20am%20interested%20in%20your%20products" 
  target="_blank"
  rel="noopener noreferrer"
  className="w-full sm:w-[280px] h-[40px] mt-2 px-4 py-1 bg-[#F29728] text-[16px] sm:text-[18px] font-[sans-serif] text-white font-bold rounded-md hover:bg-[#1DA946] flex items-center justify-center"
>
  Order On Whatsapp
</a>
                <a
  href="tel:+919027799171"
  className="w-full sm:w-[280px] h-[40px] mt-2 px-4 py-1 bg-transparent border border-[#F29728] text-[16px] sm:text-[18px] font-[sans-serif] text-white font-bold rounded-md hover:bg-[#1DA946] flex items-center justify-center"
>
  Call Us To Order
</a>

              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center pl-0 sm:pl-8 text-[14px] sm:text-[16px] text-white mb-1">
                  <Image // CHANGED HERE ✅
              src="/staricon.png"
              alt="star"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
                  <span>Rated 4.8</span>
                </div>
                <div className="flex items-center pl-0 sm:pl-16 text-[14px] sm:text-[16px] text-white mb-1">
                 <Image // CHANGED HERE ✅
                src="/warrenty.png"
                alt="warranty"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
                </div>
                <div className="flex items-left pl-0 sm:pl-8 text-[14px] sm:text-[16px] text-white mb-1">
                  <span>6 Months Warranty</span>
                </div>
                <div className="flex items-center pl-0 sm:pl-16 text-[14px] sm:text-[16px] text-white mb-1">
                  <Image // CHANGED HERE ✅
                src="/return.png"
                alt="return"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
                </div>
                <div className="flex items-left pl-0 sm:pl-8 text-[14px] sm:text-[16px] text-white mb-1">
                  <span>Technical Support</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-white rounded-2xl p-4 sm:p-8 shadow-md w-full md:w-[580px] h-auto max-h-[300px] overflow-y-auto">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#30BB7E] flex-shrink-0">
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-gray-800 text-base leading-relaxed">{spec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProductTabs
        description={product.description}
        specifications={product.specifications}
        idealFor={product.idealfor}
      />
      {/* --- Help Section --- */}
<div className="mt-10">
  <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow p-6">
    {/* Left Side */}
    <div className="flex items-center space-x-3 text-gray-700">
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8 text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>

      <p className="text-lg">
        Need more help?{" "}
        <span className="text-green-600 font-semibold cursor-pointer hover:underline">
          Talk To Our Experts.
        </span>
      </p>
    </div>

    {/* Right Side - Call Button */}
    <a
      href="tel:+919027799171"
      className="mt-4 md:mt-0 bg-[#F29728] hover:bg-[#30BB7E] text-white font-semibold py-2 px-6 rounded-lg shadow"
    >
      📞 Call Us Now
    </a>
  </div>
</div>


      {relatedProducts.length > 0 && (
        <RelatedProducts relatedProducts={relatedProducts} />
      )}
      <section id="contact">
        <ContactForm />
        </section>
    </section>
  );
}
