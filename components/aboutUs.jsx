// src/pages/AboutUs.jsx

'use client'; 

import React from "react";

export default function AboutUs() {
  return (
    <section className="bg-white text-gray-900 px-0 sm:px-0 md:px-0 lg:px-0 py-02 md:py-5">
      {/* Header */}
      

      <section
  className="relative  w-full  bg-cover bg-center bg-no-repeat text-white mx-auto
              md:bg-[url('/aboutusHero.png')] mb-10">
  
      <div className="text-center  pt-60 pb-30">
        <h1 className="text-3xl sm:text-4xl md:text-5xl  text-green-700 mb-4">
          About Us
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">
          Welcome to <span className="font-semibold">AIVA ITALY</span> {"–"} Powered by{" "}
          <span className="font-semibold">Regreen Agro</span>
        </p>
      </div>
      </section>


      {/* Intro */}
      <div className="mb-10 md:mb-12 max-w-4xl mx-auto text-center">
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          AIVA ITALY carries forward the trusted name of RICO ITALY, known for
          quality farm machinery. What we offer is convenience and accessibility.
          Our products are built with precision, tested in Indian fields, and
          designed to handle the unique challenges of different Indian villages.
        </p>
        <p className="mt-6 text-gray-700 text-sm sm:text-base leading-relaxed">
          Founded by <span className="font-medium">Vasu Arora</span> and{" "}
          <span className="font-medium">Aishita Kapoor</span>, our goal is
          simple: to put world-class farming tools in the hands of every Indian
          farmer, no matter where they are.
        </p>
      </div>

      {/* Sections */}
      <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 text-center">
        {/* Our Roots */}
        <div className="p-6 shadow-md rounded-2xl bg-gray-50">
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-3">
            Our Roots
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            With AIVA ITALY, we bring together trusted quality and modern
            innovation, making sure farmers have access to machinery that works
            as hard as they do, season after season.
          </p>
        </div>

        {/* Mission */}
        <div className="p-6 shadow-md rounded-2xl bg-gray-50">
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-3">
            Our Mission
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            To deliver reliable machinery that can withstand the toughest farming
            conditions. Innovative solutions that save time and effort, and
            affordable tools, so quality is never out of reach.
          </p>
          <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed">
            From a petrol engine powering irrigation pumps in Rajasthan, to a
            brush cutter clearing tea gardens in Assam, to a hand sprayer caring
            for vegetables in Gujarat – we make farming accessible.
          </p>
        </div>

        {/* Vision */}
        <div className="p-6 shadow-md rounded-2xl bg-gray-50">
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-3">
            Our Vision for Tomorrow
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            We see a future where a wheat farmer in Haryana, a fruit grower in
            Maharashtra, and a tea harvester in Assam all have equal access to
            the best tools for their land.
          </p>
          <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed">
            At AIVA ITALY and Regreen Agro, we’re here to make that future real
            with quality you can trust, technology you can rely on, and service
            you can count on.
          </p>
        </div>
      </div>

      {/* Why Farmers Choose Us */}
      <div className="mt-14 md:mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 text-center mb-8">
          Why Farmers Choose Us
        </h2>
        <ul className="grid gap-6 sm:gap-8 md:grid-cols-3 text-center">
          <li className="p-6 shadow-md rounded-xl bg-gray-50">
            <p className="font-medium text-base sm:text-lg">Designed for India</p>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              From rugged ploughs to gentle seed planters.
            </p>
          </li>
          <li className="p-6 shadow-md rounded-xl bg-gray-50">
            <p className="font-medium text-base sm:text-lg">Farmer-first service</p>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Before, during, and after every purchase.
            </p>
          </li>
          <li className="p-6 shadow-md rounded-xl bg-gray-50">
            <p className="font-medium text-base sm:text-lg">
              Convenience without compromise
            </p>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Quality machines delivered to your doorstep.
            </p>
          </li>
        </ul>
      </div>

      {/* Footer Form */}
      <div className="mt-16 md:mt-20 text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4">
          Get the Right Machine for Your Land
        </h3>
        <form className="max-w-md sm:max-w-xl mx-auto space-y-4 text-left">
          <select className="w-full border rounded-lg p-3 text-sm sm:text-base">
            <option>State / Location</option>
          </select>
          <select className="w-full border rounded-lg p-3 text-sm sm:text-base">
            <option>Type of Machinery Needed</option>
          </select>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="terms" className="mt-1" />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-snug">
              I accept the Terms and Conditions
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition text-sm sm:text-base"
          >
            Get Expert Advice
          </button>
        </form>
        <p className="mt-8 text-gray-600 text-xs sm:text-sm text-center">
          Thank you for trusting us. Together, let’s cultivate progress and grow
          a brighter future for Indian farming.
        </p>
      </div>
    </section>
  );
}
