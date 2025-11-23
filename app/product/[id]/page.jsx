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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${BASE_URL}api/products/${id}`);
        const data = await res.json();

        const specsRes = await fetch(`${BASE_URL}api/specifications/${id}`);
        const specs = await specsRes.json();

        const productWithSpecs = { ...data, specifications: specs };
        setProduct(productWithSpecs);

        const category = data?.category || data?.cc;

        if (category) {
          const relatedRes = await fetch(`${BASE_URL}api/products`);
          const related = await relatedRes.json();

          const filtered = related.filter(
            p =>
              p.id !== data.id &&
              (p.category?.toLowerCase() === category.toLowerCase() ||
                p.cc?.toLowerCase() === category.toLowerCase())
          );

          setRelatedProducts(filtered);
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

        {/* ---------------- MOBILE VIEW ---------------- */}
        <div className="flex flex-col gap-2 md:hidden text-center">

          <div className="text-[22px] sm:text-[32px] font-bold font-[sans-serif]">
            <span className="text-white">{product.cc}</span>
            <span className="text-[#30BB7E]"> India's Most Trusted</span>
          </div>

          <h1 className="text-[22px] sm:text-[24px] font-bold text-white font-[sans-serif]">
            {product.title}
          </h1>

          <div className="flex justify-center items-center gap-2 text-white text-[14px] sm:text-[16px]">
            <Image src="/staricon.png" alt="star" width={24} height={24} />
            <span>Rated 4.8</span>
          </div>

          <ProductImageGallery product={product} />

          {/* === MOBILE FEATURES (3x2 GRID) === */}
          <div className="grid grid-cols-3 gap-4 text-white text-[14px] sm:text-[16px] mt-2">

            <Feature icon="/free-delivery.png" text="Free Delivery" />
            <Feature icon="/longer-life.png" text="2× Longer Life" />
            <Feature icon="/after-sales.png" text="After-Sales" />
            <Feature icon="/quality.png" text="Quality Assured" />
            <Feature icon="/return-exchange.png"text="Return & Exchangeᵀᴺᶜ"/>
            <Feature icon="/buyer-protection.png" text="Buyer Protection" />

          </div>

          <PriceSection product={product} />
          {/* === Mobile CTA Buttons (RESTORED) === */}
<div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
  <a
    href="https://wa.me/917830060444?text=Hello%20I%20am%20interested%20in%20your%20products"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full sm:w-[280px] h-[40px] px-4 py-1 bg-[#F29728] text-white font-bold rounded-md hover:bg-[#1DA946] text-center flex items-center justify-center"
  >
    Order On Whatsapp
  </a>

  <a
    href="tel:+919027799171"
    className="w-full sm:w-[280px] h-[40px] px-4 py-1 bg-transparent border border-[#F29728] text-white font-bold rounded-md hover:bg-[#1DA946] text-center flex items-center justify-center"
  >
    Call Us To Order
  </a>
</div>


          {/* Specifications */}
          <div className="flex flex-col gap-3 bg-white rounded-2xl p-4 sm:p-8 shadow-md w-full h-auto max-h-[300px] overflow-y-auto mt-4">
            {product.specifications.map((spec, index) => (
              <SpecRow key={index} text={spec.description} />
            ))}
          </div>
        </div>

        {/* ---------------- DESKTOP VIEW ---------------- */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 items-start">
          <ProductImageGallery product={product} />

          <div className="flex flex-col gap-1 md:pl-10">
            <div className="text-[28px] sm:text-[32px] md:text-[35px] mb-1 pl-2">
              <span className="text-white font-bold">{product.cc}</span>
              <span className="text-[#30BB7E] font-bold"> India's Most Trusted </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 h-full gap-4 px-2">

              {/* Left column */}
              <div className="flex flex-col gap-1">
                <h1 className="text-[24px] font-bold text-white">{product.title}</h1>

                <div className="text-[20px] font-bold">
                  <span className="text-white">₹{product.price}</span>{" "}
                  <span className="line-through text-gray-400 text-lg">₹{product.mrp}</span>
                </div>

                <p className="text-[#30BB7E] text-xl">
                  {product.discountpercent}% OFF — You Save ₹{product.amountsaved}
                </p>

                <OrderButtons />
              </div>

              {/* Right column features */}
              <div className="grid grid-cols-2 gap-4 text-white text-[16px] pl-8">

                <FeatureDesktop icon="/free-delivery.png" text="Free Delivery" />
                <FeatureDesktop icon="/longer-life.png" text="2× Longer Life" />
                <FeatureDesktop icon="/after-sales.png" text="After-Sales Support" />
                <FeatureDesktop icon="/quality.png" text="Quality Assurance" />
                <FeatureDesktop icon="/return-exchange.png"text="Return & Exchangeᵀᴺᶜ"/>
                <FeatureDesktop icon="/buyer-protection.png" text="Buyer Protection" />

              </div>

            </div>

            {/* Specifications (Desktop) */}
            <div className="bg-white rounded-2xl p-8 shadow-md w-full md:w-[580px] max-h-[300px] overflow-y-auto mt-4">
              {product.specifications.map((spec, index) => (
                <SpecRow key={index} text={spec.description} />
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

      {/* Help Section */}
      <HelpSection />

      {relatedProducts.length > 0 && (
        <RelatedProducts relatedProducts={relatedProducts} />
      )}

      <section id="contact">
        <ContactForm />
      </section>
    </section>
  );
}

/* ---------------- Small Components ---------------- */

const Feature = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center text-center gap-1">
    <Image src={icon} alt={text} width={32} height={32} />
    <span>{text}</span>
  </div>
);

const FeatureDesktop = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <Image src={icon} alt={text} width={32} height={32} />
    <span>{text}</span>
  </div>
);

const SpecRow = ({ text }) => (
  <div className="flex items-start gap-2">
    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#30BB7E] flex-shrink-0">
      <CheckIcon className="w-3.5 h-3.5 text-white" />
    </div>
    <p className="text-gray-800 text-[14px] sm:text-base leading-snug">{text}</p>
  </div>
);

const PriceSection = ({ product }) => (
  <div className="flex justify-center gap-2 items-baseline text-[16px] sm:text-[18px] mt-2 flex-wrap">
    <span className="text-white font-bold">₹{product.price}</span>
    <span className="line-through text-gray-400">₹{product.mrp}</span>
    <span className="text-[#30BB7E]">{product.discountpercent}% OFF</span>
    <span className="text-[#30BB7E]">You Save ₹{product.amountsaved}</span>
  </div>
);

const OrderButtons = () => (
  <>
    <a
      href="https://wa.me/917830060444?text=Hello%20I%20am%20interested%20in%20your%20products"
      target="_blank"
      rel="noopener noreferrer"
      className="w-[280px] h-[40px] mt-2 bg-[#F29728] text-white font-bold rounded-md hover:bg-[#1DA946] flex items-center justify-center"
    >
      Order On Whatsapp
    </a>

    <a
      href="tel:+919027799171"
      className="w-[280px] h-[40px] mt-2 bg-transparent border border-[#F29728] text-white font-bold rounded-md hover:bg-[#1DA946] flex items-center justify-center"
    >
      Call Us To Order
    </a>
  </>
);

const HelpSection = () => (
  <div className="mt-10">
    <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-3 text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" strokeWidth={1.5}
             stroke="currentColor" className="w-8 h-8 text-green-600">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>

        <p className="text-lg">
          Need more help?{" "}
          <span className="text-green-600 font-semibold hover:underline cursor-pointer">
            Talk To Our Experts.
          </span>
        </p>
      </div>

      <a
        href="tel:+919027799171"
        className="mt-4 md:mt-0 bg-[#F29728] hover:bg-[#30BB7E] text-white font-semibold py-2 px-6 rounded-lg shadow"
      >
        📞 Call Us Now
      </a>
    </div>
  </div>
);
