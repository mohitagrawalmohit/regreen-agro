import Image from "next/image";
import ContactForm from "@/components/contactusForm";

export default function About() {
  return (
    <main className="min-h-screen ">
    <div className="w-full">
      {/* Hero Section */}
        <div
  className="relative  w-full  bg-cover bg-center bg-no-repeat text-white mx-auto
             bg-[url('/aboutusHero.png')] ">
  
      <div className="text-center  pt-60 pb-30">
        <h1 className="text-3xl sm:text-4xl md:text-5xl  text-green-700 mb-4">
          About Us
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">
          Welcome to <span className="font-semibold text-green-400">AIVA ITALY</span> {"–"} Powered by{" "}
          <span className="font-semibold">Regreen Agro</span>
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
<div className="bg-gray-50 py-0">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-1 items-center">
    {/* Text Section */}
    <div>
      <h3 className="text-3xl font-bold mb-10">
        Why Farmers <span className="text-green-500">Choose Us</span>
      </h3>
      <div className="space-y-6">
        {/* Box 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 w-[90%]">
          <span className="text-green-500 text-2xl">✔</span>
          <p>
            <strong>Designed for India</strong> – from rugged ploughs to gentle seed planters.
          </p>
        </div>

        {/* Box 2 (shifted right) */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 w-[90%] ml-10">
          <span className="text-green-500 text-2xl">✔</span>
          <p>
            <strong>Convenience without compromise</strong> – quality machines delivered to your doorstep.
          </p>
        </div>

        {/* Box 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 w-[90%]">
          <span className="text-green-500 text-2xl">✔</span>
          <p>
            <strong>Farmer-first service</strong> – before, during, and after every purchase.
          </p>
        </div>
      </div>
    </div>

    {/* Farmer Image */}
    <div className="flex justify-center md:justify-end -mb-32 -mt-10">
      <Image
        src="/farmer.png"
        alt="Farmer"
        width={1000}
        height={1000}
        className="object-contain w-auto h-auto"
      />
    </div>
  </div>
</div>

    </div>
    <section id="contact">
        <ContactForm />
        </section>
    </main>
  );
}
