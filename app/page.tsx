// app/page.tsx

"use client";
import Image from "next/image";
import CategorySection from "@/components/CategorySection"; // adjust path if needed
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import ContactForm from "@/components/contactusForm";
import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function HomePage() {
  const [showVideo, setShowVideo] = useState(false);

  const productIcons = {
    "Quality Tillers": "/heroicons/tiller.png",
    "Seeders": "/heroicons/seeder.png",
    "Sprayers": "/heroicons/sprayer.png",
    "Garden Tools": "/heroicons/lawn mower.png",
  };
  const productIcons2 = {
    "Harvesting Machines": "/heroicons/rice mill.png",
                  "Pumps": "/heroicons/water pump.png",
                  "Storage Solutions": "/heroicons/storage.png",
                  "Power Units": "/heroicons/power engine.png",
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startLoop = () => {
      setShowVideo(false);

      interval = setInterval(() => {
        setShowVideo((prev) => {
          if (prev) {
            setTimeout(() => setShowVideo(true), 5000);
            return false;
          } else {
            setTimeout(() => setShowVideo(false), 10000);
            return true;
          }
        });
        return;
      }, 15000);
    };

    startLoop();

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen ">
      {/* hero1 */}
      <section className="relative h-auto md:h-[75vh] w-full max-w-[1600px] text-white mx-auto overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
  {!showVideo ? (
    <div className="h-full w-full bg-cover bg-center bg-no-repeat bg-[url('/hero-bg-mobile-min.png')] md:bg-[url('/hero-bg-min.png')]" />
  ) : (
    <div className="relative h-full w-full">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://regreenagro.s3.ap-southeast-2.amazonaws.com/hero-video.webm" type="video/mp4" />
      </video>
      {/* Overlay only for video */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  )}
</div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-none z-5"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 h-full px-0 md:px-10 ml-[-180px] md:ml-auto mt-2 md:pl-40 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex-1 flex flex-col items-start justify-center text-left">
            <h1
              className={`font-bold font-inter leading-tight transition-all duration-[2000ms] ease-in-out
          ${showVideo ? "text-2xl md:text-6xl" : "text-2xl md:text-5xl"}`}
            >
              <span className="text-[#2cd882]">Regreen</span>{" "}
              <span className="text-white">Agro:</span>
            </h1>

            <div className="mt-3 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-0 md:gap-y-3 text-sm md:text-lg md:font-medium font-small">
              <ul className="space-y-0 md:space-y-2">
      {Object.entries(productIcons).map(([item, icon]) => (
        <li key={item} className="flex items-center gap-2">
          <Image
            src={icon}
            alt={item}
            width={30}
            height={30}
            className="object-contain grayscale brightness-300"
          />
          {item}
        </li>
      ))}
    </ul>
             
              <ul className="space-y-0 md:space-y-2">
      {Object.entries(productIcons2).map(([item, icon]) => (
        <li key={item} className="flex items-center gap-2">
          <Image
            src={icon}
            alt={item}
            width={30}
            height={30}
            className="object-contain grayscale brightness-300"
          />
          {item}
        </li>
      ))}
    </ul>
            </div>

            <a href="#contact" className="mt-6">
              <button className="w-[150px] h-[22px] md:h-[50px] md:w-[320px] text-[12px] md:text-[18px] font-semibold bg-[#F29728] hover:bg-[#30BB7E] text-white rounded-[3px] md:rounded-[7px] shadow transition-all duration-500">
                Send Us A Query
              </button>
            </a>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 relative flex items-center justify-center mt-20 md:mt-0">
            <div
              className="
  hidden md:flex
  absolute right-0 md:-right-18 
  w-[280px] h-[280px] md:w-[400px] md:h-[400px] 
  rounded-full border border-none 
  flex-col items-center justify-center text-left p-6
"
            >
              <h2 className="text-2xl md:text-4xl font-bold leading-[1.5]">
                <span className="text-[#2cd882]">10,000+ </span>
                <br />
                प्रगतिशील भारतीय किसानों
                <br /> की पहली पसंद
              </h2>
            </div>

            <div
              className="
  md:hidden
  absolute bottom-0 left-22
  text-left 
"
            >
              <h2 className="text-sm font-bold leading-tight whitespace-nowrap">
                <span className="text-[#2cd882]">10,000+ </span> प्रगतिशील
                भारतीय <br /> किसानों की पहली पसंद
              </h2>
            </div>
          </div>
        </div>
      </section>

      <CategorySection />

      {/* New Section */}
      <section
        className="relative h-full bg-cover bg-center bg-no-repeat text-center text-white mx-auto"
        style={{ backgroundImage: "url('/bottomback.png')" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-left sm:text-center md:text-left text-[#1C3127] mb-6 font-['Open Sans']">
            A Leading Provider of Affordable{" "}
            <span className="text-[#30BB7E]">Farm Equipment</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-left sm:text-center md:text-left text-[#838383] font-['Open Sans']">
            Regreen Agro has positioned itself at the critical intersection
            where agricultural tradition meets innovation. As an authorized
            distributor of premium{" "}
            <span className="text-[#30BB7E]">AIVA ITALY machinery</span>, we
            don&apos;t just supply equipment; we provide comprehensive farming
            solutions designed specifically for Indian agricultural conditions.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
          {/* Left Section */}
          <div className="flex-1 text-left md:pl-12">
            <h2 className="text-left text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C3127] mb-6 font-Open Sans">
              The{" "}
              <Image
                src="/AIVA Logo.png"
                alt="AIVA Logo"
                width={120}
                height={100}
                className="inline-block align-bottom max-w-[120px] h-auto"
              />{" "}
              Advantage
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex-1 text-left md:pl-2">
            <p className="text-left text-[15px] sm:text-[16px] text-[#838383] mb-6 font-Open Sans">
              While many suppliers focus solely on selling the latest equipment,
              Regreen Agro has pioneered a different approach, making advanced
              technology like <span className="text-[#30BB7E]">AIVA ITALY</span>{" "}
              accessible, understandable, and immediately beneficial to Indian
              farmers.
            </p>
            <a href="#contact">
              <button className="w-full sm:w-[302px] h-[40px] bg-[#F29728] font-Open Sans font-bold text-white text-base sm:text-lg rounded-[7px] hover:bg-[#30BB7E] transition">
                Send Us A Query
              </button>
            </a>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 mb-0 ">
          <h2 className="text-3xl font-semibold text-center text-green-900 mb-10">
            Our Advantage comes through:
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-[#F5F5F5] shadow-lg rounded-md p-6 min-h-[200px] md:min-h-[350px] flex flex-col justify-between">
              <div className="flex justify-center mb-1 md:mb-4">
                <div className="w-20 h-20 rounded-full bg-[#F29728] flex items-center justify-center">
                  <Image
                    src="/icons/technical support.png"
                    alt="Technical Support"
                    width={90}
                    height={90}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-semibold text-green-900 text-center mb-2 md:mb-6">
                Tech Support:
              </h3>
              <p className="text-gray-700 text-center text-[12px] md:text-[18px] flex-grow">
                Choose the right product with our expert advice and ongoing
                support.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F5F5F5] shadow-lg rounded-md p-6 min-h-[200px] md:min-h-[350px] flex flex-col justify-between">
              <div className="flex justify-center mb-1 md:mb-4">
                <div className="w-20 h-20 rounded-full bg-[#F29728] flex items-center justify-center">
                  <Image
                    src="/icons/panindia delivery.png"
                    alt="Pan India Delivery"
                   width={90}
                    height={90}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-semibold text-green-900 text-center mb-2 md:mb-6">
                Pan-India Delivery:
              </h3>
              <p className="text-gray-700 text-center text-[12px] md:text-[18px] flex-grow">
                No matter where you are in India, we ensure fast, safe, and
                reliable delivery.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F5F5F5] shadow-lg rounded-md p-6 min-h-[200px] md:min-h-[350px] flex flex-col justify-between">
              <div className="flex justify-center mb-1 md:mb-4">
                <div className="w-20 h-20 rounded-full bg-[#F29728] flex items-center justify-center">
                  <Image
                    src="/icons/onlineguide.png"
                    alt="Online Guide"
                   width={90}
                    height={90}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-semibold text-green-900 text-center mb-2 md:mb-6">
                Online Guides:
              </h3>
              <p className="text-gray-700 text-center text-[12px] md:text-[18px] flex-grow">
                Access simple tutorials online to operate and maintain equipment
                with ease.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#F5F5F5] shadow-lg rounded-md p-6 min-h-[200px] md:min-h-[350px] flex flex-col justify-between">
              <div className="flex justify-center mb-1 md:mb-4">
                <div className="w-20 h-20 rounded-full bg-[#F29728] flex items-center justify-center">
                  <Image
                    src="/icons/farmer trust.png"
                    alt="Farmer Trust"
                   width={90}
                    height={90}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-semibold text-green-900 text-center mb-2 md:mb-6">
                Trusted by 10,000+ Farmers:
              </h3>
              <p className="text-gray-700 text-center text-[12px] md:text-[18px] flex-grow">
                A community of farmers relies on us, backed by excellent
                verified reviews.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-[3fr_1fr] md:grid-cols-[5fr_1fr] h-full px-6 md:px-24 items-center
                gap-x-2 md:gap-x-4 gap-y-4 md:gap-y-2">
          {/* Left: Text */}
          <div className="col-span-1 flex flex-col items-start pr-2 md:pl-[40px] pt-[10px] gap-2">
            <h1 className="font-bold leading-tight text-lg md:text-[35px]">
              <span className="text-white">Our Product Range</span>
            </h1>
            <h1 className="leading-tight text-sm md:text-[28px] text-left">
              <span className="text-white">High-Quality and Budget-Friendly</span>
              <span className="text-[#2cd882]"> AIVA ITALY Machinery</span>
            </h1>
          </div>

          {/* Right: Image */}
          <div className="col-span-1 flex justify-end items-center pt-[10px]">
            <Image
              src="/aiva2.png"
              alt="Hero Graphic"
              width={155}
              height={155}
              className="w-[60px] md:w-[155px] object-contain"
            />
          </div>

          {/* Button */}
          <div className="col-span-2 md:col-span-1 md:col-start-1 md:row-start-2 flex justify-center md:justify-start pt-4 md:pl-10 mb-8">
            <a href="#contact">
              <button className="w-[220px] md:w-[342px] h-[42px] md:h-[40px] text-[15px] md:text-[18px] font-semibold bg-[#F29728] hover:bg-[#30BB7E] text-white rounded-[7px] shadow transition">
                Send Us A Query
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <SuccessStoriesSection />
      <section id="contact">
        <ContactForm />
      </section>
    </main>
  );
}
