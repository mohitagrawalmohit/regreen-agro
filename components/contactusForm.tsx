"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

const machineryList = [
  "Mini Tiller", "Rotary Weeder", "Ploughs & Cultivators", "Depth Controller",
  "Leveler", "Ridgers", "Rotary Tiller Blades", "Earth Auger", "Earth Auger Attachments",
  "Water Pump", "Hose Pipe", "Sprayer", "Garden Sprayer", "ULV Sprayer", "Mist Sprayer",
  "Thermal Fogging Machine", "Power Reaper", "Brush Cutter", "Power Pruner", "Tea Pruner",
  "Tea Harvester", "Chainsaw", "Wood Cutter", "Flour Mill", "Rice Mill", "Thresher",
  "Chaff Cutter", "Lawn Mower", "Garden Sprayer (Hand-held)", "Seeder", "Planter",
  "Wood Chipper", "Sheep Wool Clipper", "Car Washer", "Snow Thrower", "Disc Harrow",
  "Petrol Engine", "Diesel Engine"
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    machinery: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const leadData = {
      ...formData,
      landingPageUrl: window.location.href, // capture current page URL
    };

    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Your details have been submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          state: "",
          machinery: "",
          message: "",
        });
      } else {
        console.error("Error:", data);
        toast.error("Failed to submit your details. Please try again.");
      }
    } catch (err) {
      console.error("Request failed:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <section className="relative w-full min-h-screen flex items-center justify-center bg-[url('/Contactform-bg.png')] from-emerald-900 via-emerald-800 to-emerald-900">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 md:px-12">
          {/* Left Half - Placeholder */}
          <div className="hidden md:block"></div>

          {/* Right Half - Form */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 backdrop-blur-6xl p-6 md:ml-32 rounded-2xl shadow-lg w-full max-w-[450px] text-white">
            <div className="text-3xl md:ml-7 font-bold mb-6 text-emerald-300">
              <span className="text-white">Get the Right</span>
              <span className="text-[#2cd882]"> Farming</span>
              <span className="text-white"> Machine for Your Land</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (WhatsApp Preferred)"
                required
                className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              {/* State Dropdown */}
              <div className="relative">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white text-black appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select State / Location</option>
                  {indianStates.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}
                </select>
                <ChevronDown className="absolute md:mr-10 right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
              </div>

              {/* Machinery Dropdown */}
              <div className="relative">
                <select
                  name="machinery"
                  value={formData.machinery}
                  onChange={handleChange}
                  required
                  className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white text-black appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Type of Machinery Needed</option>
                  {machineryList.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown className="absolute md:mr-10 right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more"
                rows={4}
                required
                className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <button
                type="submit"
                className="w-full md:max-w-[350px] md:ml-7 bg-[#F29728] hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition"
              >
                Get Expert Advice
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
