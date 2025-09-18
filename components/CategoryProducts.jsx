'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect,useRef } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ContactForm from "@/components/contactusForm";
import { Grid, List } from 'lucide-react';
import CategorySearchBar from '@/components/CategorySearchBar';




const categories = ["All","Power Weeder & Tiller","Earth Auger", "Pumps & Irrigation", "Sprayers & Crop Protection","Harvesting Machinery","Post Harvesting", "Lawn Mower & Gardening Tools","Miscellaneous", "Power & Engines"];


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';



export default function CategoryProducts() {
  const router = useRouter();
  const params = useParams();
  const category = decodeURIComponent(params.category || '');

  const [selectedCategory, setSelectedCategory] = useState(category);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileCols, setMobileCols] = useState(2); // default 2 per row on mobil
  const [products, setProducts] = useState([]);
  
  const dropdownRef = useRef(null);

   // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://regreen-agro.onrender.com/api/products"); // change to your API route
        
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);
  
  console.log("https://regreen-agro.onrender.com/${product.images}");



  const onSelect = (cat) => {
    setSelectedCategory(cat);
    setSearchTerm('');
    setShowDropdown(false);
    
  };

  

  const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );


  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <main className="min-h-screen">
      <section className="relative w-full h-full bg-[url('/categoryprod-bg.png')] bg-cover bg-center bg-no-repeat py-4 md:py-12 px-0">
        
<div className="relative mb-4 md:mb-6 w-full px-4 md:px-30">
  <CategorySearchBar />
</div>
      
{/* Section Title */}
<h2 className="py-2 md:py-4 px-4 md:px-30 text-xl md:text-3xl font-bold text-left text-white mb-2 font-['Open Sans']">
  Shop By Category
</h2>

{/* Category Pills */}
<div className="relative w-full flex items-center px-4 md:px-30">
  {/* Left Arrow */}
  <button
  
    onClick={() => {
      const container = document.getElementById("cat-scroll");
      if (container) {
        container.scrollBy({ left: -200, behavior: "smooth" });
      }
    }}
    className="absolute left-0 md:left-15 z-10 bg-none hover:bg-white/20 text-white p-2  rounded-full"
  >
    &#8592;
  </button>

  {/* Scrollable Pills */}
  <div
    id="cat-scroll"
    className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-10 scroll-smooth flex-nowrap"
  >
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`whitespace-nowrap px-2 py-1 md:px-4 md:py-2 rounded-full border text-[12px] md:text-base transition-all duration-200
          ${
            selectedCategory === cat
              ? "bg-[#F29728] text-green-900 border-[#F29728]"
              : "border-[#F29728] text-white hover:bg-[#F29728]"
          }`}
      >
        {cat}
      </button>
    ))}
  </div>

  {/* Right Arrow */}
  <button
    onClick={() => {
      const container = document.getElementById("cat-scroll");
      if (container) {
        container.scrollBy({ left: 200, behavior: "smooth" });
      }
    }}
    className="absolute right-0 md:right-15 z-10 bg-none hover:bg-white/30 text-white p-2 rounded-full"
  >
    &#8594;
  </button>
</div>



{/* Product Title */}
<h2 className="text-xl md:text-3xl font-bold mb-2 text-white capitalize px-4 md:px-30 pt-2 md:pt-3">
  {selectedCategory} Products
</h2>


        {/* Banner */}
        <section className="relative w-full h-auto md:h-[300px] bg-[url('/hardworkingman.png')] bg-cover bg-center bg-no-repeat overflow-hidden mb-4 md:mb-6">
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/70 z-10" />

  {/* Content Grid */}
  <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1fr] h-full px-4 md:px-30 items-center md:items-start gap-6 md:gap-0 py-3 md:py-10">
    
    {/* Left Column: Text and Logo */}
    <div className="flex flex-col items-center md:items-start gap-2">
      <img
        src="/aiva2.png"
        alt="Hero Graphic"
        className="w-16 h-16 md:w-20 md:h-20 object-contain"
      />
      <h1 className="text-sm md:text-[30px] font-bold leading-tight text-center md:text-left">
        <span className="text-[#2cd882]">AIVA ITALY:</span>{" "}
        <span className="text-white">
          High-Performance Weeders & Rotavators
        </span>
      </h1>
    </div>

    {/* Right Column: Hindi Title + Button */}
    <div className="flex flex-col items-center md:items-start gap-4 md:pl-50">
      <h1 className="text-sm md:text-[30px] font-bold leading-tight text-center md:text-left text-white">
        <span className="text-[#2cd882]">भारत का सर्वश्रेष्ठ 3 इन 1 वीडर</span>
      </h1>
<a href="#contact" className=" md:px-15 px-12 md:py-2 py-2 w-full max-w-[200px] md:max-w-[280px] md:h-[40px] h-[30px] text-[12px] md:text-[18px] font-semibold bg-[#F29728] hover:bg-[#30BB7E] text-white rounded-[7px] shadow transition">
      
        Send Us A Query
      
      </a>
    </div>
  </div>
</section>


        

    {/* Toggle Button */}
<div className="flex justify-end px-4 md:px-10 mb-2">
  <button
    onClick={() => setMobileCols(mobileCols === 1 ? 2 : 1)}
    className="p-2 rounded-md bg-white/20 hover:bg-white/30 text-white transition md:hidden"
  >
    {mobileCols === 1 ? <Grid size={20} /> : <List size={20} />}
  </button>
</div>


     {/* Products Grid */}
        <div className={`grid ${mobileCols === 1 ? 'grid-cols-1' : 'grid-cols-2'} md:grid-cols-4 gap-4 px-4 md:px-10 pb-16`}>
          {filteredProducts.map((product) => {
            // ✅ Pick first available media
            const productImage =
              product.media1 || product.media2 || product.media3 || product.media4 || product.media5;

            return (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="bg-white w-full h-auto max-w-[250px] md:max-w-[280px] mx-auto md:mx-20 rounded-[20px] shadow-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer"
              >
                <div className="bg-white p-3 md:p-4 flex flex-col justify-center items-start h-40 md:h-48">
                  <h3 className={`font-semibold mb-1 ${mobileCols === 1 ? "text-medium md:text-xl" : "text-[10px] md:text-lg"}`}>
                    {product.cc}{" | "}{product.title}
                  </h3>
                  <div className={`flex items-center mb-1 ${mobileCols === 1 ? "text-medium md:text-base" : "text-[10px] md:text-sm"}`}>
                    <img src="/staricon.png" alt="star" className="w-4 h-4 mr-1" />
                    <span>Rated 4.9</span>
                  </div>
                  <h3 className={`mb-1 text-[#30BB7E] ${mobileCols === 1 ? "text-sm md:text-base" : "text-[8px] md:text-sm"}`}>
                    {product.discountpercent}% OFF - You Save Rs.{product.amountsaved}
                  </h3>
                  <div className="text-left mb-1">
                    <span className={`${mobileCols === 1 ? "text-lg md:text-xl" : "text-[11px] md:text-lg"} font-bold text-black`}>
                      Rs.{product.price}
                    </span>{" "}
                    <span className={`${mobileCols === 1 ? "text-sm md:text-base" : "text-[10px] md:text-sm"} line-through text-gray-500`}>
                      Rs.{product.mrp}
                    </span>
                  </div>
                </div>

                {/* ✅ Updated Product Image */}
           {/* ✅ Fixed Product Image Area */}
<div className="bg-white border-t-4 border-gray-200 flex justify-center items-center p-2 md:p-0 h-40 md:h-58">
  {productImage ? (
    <img
      src={`${productImage}`}
      alt={product.title}
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
      className="w-full s sm:w-1/2 h-[25px] sm:h-[40px] px-4 sm:py-1 py-1 bg-[#1DA946] text-[10px] sm:text-[12px] font-[sans-serif] text-white font-bold rounded-md hover:bg-[#1DA946] flex items-center justify-center"
    >
      <img src="/whatsapp icon.png"
        alt="whatsapp icon"
        className="w-6 h-6 md:w-8 md:h-8 object-contain" />
      WhatsApp
    </a>

    {/* Call Button */}
    <a
      href="tel:+919027799171"
      className="w-full sm:w-1/2 h-[25px] sm:h-[40px] px-4  sm:py-1 py-1 bg-transparent border border-[#F29728] text-[10px] sm:text-[12px] font-[sans-serif] text-[#F29728] font-bold rounded-md hover:bg-[#F29728] hover:text-white flex items-center justify-center"
    >
      Call Us
    </a>
  </div>
              </div>
            );
          })}
        </div>
        {/*future of farming */}
        <section className="relative w-full h-auto md:h-[200px] bg-[url('/futureofFarming-bg.png')] bg-cover bg-center bg-no-repeat overflow-hidden mb-10">
  
  {/* Heading */}
  <div className="text-2xl md:text-4xl font-bold px-4 md:px-20 pt-8 md:pt-10 font-['Open Sans'] text-center md:text-left">
    <span className="text-white">The Future of </span>
    <span className="text-[#49F8AB]">Farming </span>
    <span className="text-white">Is Here</span>
  </div>

  {/* Subheading */}
  <h3 className="text-base md:text-2xl text-white px-4 md:px-20 mt-3 md:mt-2 mb-4 font-['Open Sans'] text-center md:text-left">
    While traditional practices have sustained us for generations, today's
    challenges demand innovative solutions. At Regreen Agro, we're bridging
    this technology gap with world-class equipment designed specifically
    for Indian farming conditions.
  </h3>
</section>

       {/* Category Description */}
<h2 className="text-2xl md:text-[35px] font-bold mb-1 text-white capitalize px-4 md:px-30 pt-6 text-center md:text-left">
  Advanced Power Tillers & Rotavators
</h2>

<h2 className="text-lg md:text-[25px] mb-5 text-white capitalize px-4 md:px-30 text-center md:text-left">
  Improve Productivity & Reduce Farming Costs
</h2>

<h2 className="text-lg md:text-[25px] font-semibold mb-3 text-white capitalize px-4 md:px-30 text-center md:text-left">
  Mini Tiller / Rotary Weeder
</h2>

{/* Bullet Points */}
<div className="flex items-start gap-2 text-base md:text-[20px] mb-2 text-white capitalize px-4 md:px-30">
  <img src="/tickIcon.png" alt="tick" className="w-5 h-5 md:w-6 md:h-6 mt-1" />
  <span>
    Functionality: Breaks soil crust, removes weeds between crop rows, and improves
  </span>
</div>

<div className="flex items-start gap-2 text-base md:text-[20px] mb-2 text-white capitalize px-4 md:px-30">
  <img src="/tickIcon.png" alt="tick" className="w-5 h-5 md:w-6 md:h-6 mt-1" />
  <span>
    Design: Compact, lightweight, and Petrol (around 7 HP, 208 cc) or Diesel (around 7.5 HP).
  </span>
</div>

<div className="flex items-start gap-2 text-base md:text-[20px] mb-2 text-white capitalize px-4 md:px-30">
  <img src="/tickIcon.png" alt="tick" className="w-5 h-5 md:w-6 md:h-6 mt-1" />
  <span>
    Best for: Small to medium Indian farms requiring precision weeding and soil management.
  </span>
</div>

       
      
      </section> 

      <section>
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-center px-0 md:px-0 py-0 bg-white md:bg-gray-50">
      {/* Image Section */}
      <div className="w-full md:w-[60%] md:mt-20 md:h-[80%] flex justify-center md:justify-end mb-6 md:mb-20 md:pl-10">
        <img
          src="/farmerImage.png"
          alt="Happy Farmer"
          className=" w-full max-w-md object-cover md:relative md:-mr-10"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-[60%] md:h-full space-y-4 text-center md:text-left bg-gray md:bg-gray md:bg-[#F5F5F5] ">
        <h2 className="text-2xl md:text-3xl font-semibold md:mt-20 md:pl-15 ">
          Why <span className="text-green-600 font-bold">Farmers</span> Choose Us
        </h2>

        <div className="space-y-4 mt-8 md:mt-6 md:mb-25 md:pr-50 md:pl-15">
          <div className="bg-white shadow-md p-6 md:p-6 rounded-md ">
            <h3 className="font-semibold">Specialized for Indian Conditions:</h3>
            <p className="text-sm text-gray-700">Equipment designed specifically for local farming challenges.</p>
          </div>

          <div className="bg-white shadow-md p-6  md:p-6 rounded-md">
            <h3 className="font-semibold">Complete Farming Solutions:</h3>
            <p className="text-sm text-gray-700">Comprehensive tools that work together seamlessly.</p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-md">
            <h3 className="font-semibold">Expert Consultation:</h3>
            <p className="text-sm text-gray-700">Personalized advice from agricultural technology specialists.</p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-md">
            <h3 className="font-semibold">Ongoing Support:</h3>
            <p className="text-sm text-gray-700">Training, maintenance, and troubleshooting assistance.</p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-md">
            <h3 className="font-semibold">Financing Options:</h3>
            <p className="text-sm text-gray-700">Flexible payment plans to make modernization accessible.</p>
          </div>
        </div>
      </div>
    </div>
      </section>
       
<section id="contact">
        <ContactForm />
        </section>
    </main>
  );
}
