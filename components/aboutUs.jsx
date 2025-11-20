import Image from "next/image";
import ContactForm from "@/components/contactusForm";

export default function About() {
  return (
    <main className="min-h-screen ">
    <div className="w-full">
      {/* Hero Section */}
       <div
  className="relative w-full bg-cover bg-center bg-no-repeat text-white"
  style={{ backgroundImage: "url('/aboutusHero.png')" }}
>
  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center text-center py-40 sm:py-48 md:py-52">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
      About Us
    </h1>

    <p className="mt-4 max-w-2xl text-lg sm:text-xl md:text-2xl text-gray-100">
      Welcome to <span className="font-semibold text-green-400">AIVA ITALY</span>{" "}
      – Powered by <span className="font-semibold text-white">Regreen Agro</span>
    </p>
  </div>
</div>


      

      {/* Mission & Vision */}
      <div className="bg-gradient-to-br from-green-900 to-gray-900 text-white py-20 ">
        {/* Our Roots */}
      <div className="max-w-4xl mx-auto -mt-30 relative z-20 bg-white shadow-md rounded-lg p-10">
        <p className="text-gray-700 text-lg  items-centre text-centre">
          Founded by <strong>Vasu Arora</strong> and <strong>Aishita Kapoor</strong>, our goal is simple: to put world-class
          farming tools in the hands of every Indian farmer, no matter where they are.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          With <span className="text-green-500 font-semibold">AIVA ITALY</span>, we bring together trusted quality and modern innovation,
          making sure farmers have access to machinery that works as hard as they do, season after season.
        </p>
        <div className="flex justify-center my-6">
          <Image src="/aiva2.png" alt="Roots Icon" width={100} height={100} />
        </div>
        <h3 className="text-4xl font-semibold text-center text-black mb-2">Our Roots</h3>
        <p className="text-gray-700 text-center leading-relaxed">
          <span className="text-green-500 font-semibold">AIVA ITALY</span> carries forward the trusted name of RICO ITALY,
          known for quality farm machinery. What we offer is convenience and accessibility. Our products are built with
          precision, tested in Indian fields, and designed to handle the unique challenges of different Indian villages.
          This isn’t just about selling equipment; it’s about supporting farmers with tools that make their work easier,
          and more productive.
        </p>
      </div>
        <div className="max-w-6xl mx-auto flex flex-col gap-20 px-6 py-16">
  {/* Mission */}
  <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
    {/* Icon Box */}
    <div className="bg-green-500 w-40 h-40 flex items-center justify-center">
      <Image src="/mission-icon.png" alt="Mission Icon" width={80} height={80} />
    </div>
    {/* Text */}
    <div className="text-white flex-1">
      <h3 className="text-3xl font-semibold mb-4">
        Our <span className="text-green-400">Mission</span>
      </h3>
      <p className="font-semibold mb-3">
        To deliver reliable machinery that can withstand the toughest farming conditions. 
        Innovative solutions that save time and effort, and affordable tools, so quality is never out of reach.
      </p>
      <p className="mb-3">
        With <span className="text-green-400">AIVA ITALY</span>, farmers can access the right equipment anytime, anywhere. 
        From a petrol engine powering an irrigation pump in Rajasthan, to a brush cutter clearing tea gardens in Assam, 
        to a hand sprayer caring for vegetables in Gujarat.
      </p>
      <p>
        We believe the right tools don’t just increase productivity, they transform livelihoods, 
        strengthen communities, and secure the future of farming in India.
      </p>
    </div>
  </div>

  {/* Vision */}
  <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
    {/* Icon Box */}
    <div className="bg-green-500 w-40 h-40 flex items-center justify-center">
      <Image src="/vision-icon.png" alt="Vision Icon" width={80} height={80} />
    </div>
    {/* Text */}
    <div className="text-white flex-1">
      <h3 className="text-3xl font-semibold mb-4">
        Our <span className="text-green-400">Vision for Tomorrow</span>
      </h3>
      <p className="mb-3">
        We see a future where a wheat farmer in Haryana, a fruit grower in Maharashtra, and a tea harvester in Assam all 
        have equal access to the best tools for their land.
      </p>
      <p>
        At <span className="text-green-400">AIVA ITALY</span> and Regreen Agro, we’re here to make that future real with 
        quality you can trust, technology you can rely on, and service you can count on.
      </p>
    </div>
  </div>

        </div>
      </div>

      {/* Why Farmers Choose Us */}
<div className="relative bg-gray-50 py-14 md:py-20 overflow-hidden">
  
  {/* Farmer Image Absolute (touching bottom) */}
  <div className="hidden md:block absolute bottom--5 right-10 z-0">
    <Image
      src="/farmer.png"
      alt="Farmer"
      width={500}
      height={500}
      className="object-contain"
    />
  </div>

  {/* Content Grid (on top) */}
  <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">

    {/* LEFT — TEXT SECTION */}
    <div>
      <h3 className="text-2xl md:text-4xl font-bold mb-10 leading-snug">
        Why Farmers <span className="text-green-600">Choose Us</span>
      </h3>

      <div className="space-y-6">

        <div className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4">
          <span className="text-green-600 text-2xl">✔</span>
          <p className="text-gray-700">
            <strong>Designed for India</strong> – from rugged ploughs to gentle seed planters.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4">
          <span className="text-green-600 text-2xl">✔</span>
          <p className="text-gray-700">
            <strong>Convenience without compromise</strong> – quality machines delivered to your doorstep.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4">
          <span className="text-green-600 text-2xl">✔</span>
          <p className="text-gray-700">
            <strong>Farmer-first service</strong> – before, during, and after every purchase.
          </p>
        </div>

      </div>
    </div>

    {/* RIGHT — EMPTY ON PURPOSE (IMAGE IS ABSOLUTE) */}
    <div className="md:h-[400px]"></div>

  </div>
</div>


    </div>
    <section id="contact">
        <ContactForm />
        </section>
    </main>
  );
}
