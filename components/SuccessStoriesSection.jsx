'use client';

export default function SuccessStoriesSection() {
  return (
    <main className="min-h-screen">

       

<section className="relative bg-gradient-to-br from-green-900 to-gray-900 py-16 px-4 md:px-20 overflow-hidden">
      <h2 className="text-white text-3xl md:text-4xl font-bold mb-12 text-center">
        Farmer <span className="text-green-400">Success</span> Stories
      </h2>

      {/* Background Icons */}
      <img
        src="/sample-leaf-icon.png"
        alt="leaf icon"
        className="hidden md:block absolute left-30 bottom-20 w-48 h-48 opacity-100"
      />
      <img
        src="/sample-trophy-icon.png"
        alt="trophy icon"
        className="hidden md:block absolute right-30 top-20 w-48 h-48 opacity-100"
      />

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row md:justify-center md:px-10 md:items-start relative space-y-8 md:space-y-0 md:space-x-0">

        {/* Rajesh Kumar Card */}
        <div className="relative z-10 bg-white rounded-md shadow-lg px-6 py-6 w-full md:w-[64%] md:h-[230px] w-[64%] h-[200px] md:w-1/2 md:mr-6 md:-mt-4 border-l-8 border-[#30BB7E]">
          <h3 className="text-m md:text-3xl font-bold text-gray-800 mb-2">
            Rajesh Kumar, Maharashtra
          </h3>
          <p className="text-gray-600 text-xs md:text-lg leading-relaxed md:pr-50 pr-8">
            Rajesh Kumar, a small farmer in Maharashtra, bought our power reaper system last season. 
            Previously harvesting 2 acres daily with five laborers, he now completes 8 acres with just 
            two workers, increasing efficiency while reducing costs. His ROI was achieved within a single 
            harvest season.
          </p>
          {/* Quote Icon Image */}
          <img
            src="/quote-icon.png"
            alt="quote icon"
            className="absolute top-4 right-4 w-12 h-10 md:w-24 md:h-19 md:mt-4 md:ml-4"
          />
        </div>

        {/* Manjeet Card */}
        <div className="relative z-0 bg-white rounded-md shadow-lg px-6 py-6 w-full  md:w-[64%] md:h-[230px] md:w-1/2 md:-ml-80 md:mt-62 border-l-8 border-[#30BB7E]">
          <h3 className="text-m md:text-3xl font-bold text-gray-800 mb-2">
            Manjeet, Rajasthan
          </h3>
          <p className="text-gray-600 text-xs md:text-lg leading-relaxed md:pr-50 pr-8">
            The Manjeet Singh family in Rajasthan used our HTP Sprayers, reducing water consumption by 40% 
            while increasing crop by 25%. In a region facing severe water scarcity, this technology provided 
            both environmental and economic benefits.
          </p>
          {/* Quote Icon Image */}
          <img
            src="/quote-icon.png"
            alt="quote icon"
            className="absolute top-4 right-4 w-12 h-10 md:w-24 md:h-19 md:mt-4  md:ml-4"
          />
        </div>
      </div>
    </section>

    <section className="relative w-full min-h-[150px] bg-[url('/grow&earn-bg.png')] bg-cover bg-center bg-no-repeat">
  <div
    className="
      relative z-20 
      px-6 md:pl-40 md:pr-24 
      pt-4 pb-4 md:pb-12 md:pt-8
      text-black 
      grid grid-cols-1 md:grid-cols-[4fr_1fr] 
      gap-6 md:gap-10 
      items-start
    "
  >
    {/* Left Column - Single Heading */}
    <div className="text-center md:text-left">
      <h2 className="text-1xl md:text-[30px] font-bold leading-snug">
        <span className="text-white">Grow and earn more with our </span>
        <span className="text-[#30BB7E]">Innovative farming machinery </span>
        <span className="text-white">designed to increase efficiency.</span>
      </h2>
    </div>

    {/* Right Column - Button */}
    <div className="flex justify-center md:justify-center items-center">
      <a href="#contact">
        <button
          className="
            w-[180px] md:w-[342px] 
            h-[35px] md:h-[50px] 
            text-[16px] md:text-[18px] 
            font-semibold 
            bg-[#F29728] hover:bg-[#30BB7E] 
            text-white rounded-[7px] 
            shadow transition 
             md:mt-10 md:ml-2
          "
        >
          Send Us A Query
        </button>
      </a>
    </div>
  </div>
</section>


       
    </main>
  );
}
