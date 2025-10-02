"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    machinery:"",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <main className="min-h-screen ">
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[url('/Contactform-bg.png')] from-emerald-900 via-emerald-800 to-emerald-900">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 md:px-12">
        
        {/* Left Half - Background Overlay / Placeholder */}
        <div className="hidden md:block"></div>

        {/* Right Half - Form */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 backdrop-blur-6xl p-6 md:ml-32 rounded-2xl shadow-lg w-full max-w-[450px] text-white">
          <div className="text-3xl md:ml-7  font-bold mb-6 text-emerald-300"><span className="text-white">Get the Right</span>
      <span className="text-[#2cd882]"> Farming</span><span className="text-white"> Machine for Your Land</span></div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white/100 text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
             
              className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white/100 text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (Whatsapp Preferred)"
              required
              className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white/100 text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            {/* State Dropdown */}
            <div className="relative">
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white/100 text-black appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Select State / Location</option>
                {indianStates.map((state, index) => (
                  <option key={index} value={state} className="text-black">
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute md:mr-10 right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={5} />
            </div>

            <div className="relative">
              <select
                name="machinery"
                value={formData.machinery}
                onChange={handleChange}
                required
                className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white/100 text-black placeholder-black/30 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option className= "text-black/30 "value="">Type of Machinery Needed</option>
            <option value="mini-tiller">Mini Tiller</option>
<option value="rotary-weeder">Rotary Weeder</option>
<option value="ploughs-cultivators">Ploughs & Cultivators</option>
<option value="depth-controller">Depth Controller</option>
<option value="leveler">Leveler</option>
<option value="ridgers">Ridgers</option>
<option value="rotary-tiller-blades">Rotary Tiller Blades</option>
<option value="earth-auger">Earth Auger</option>
<option value="earth-auger-attachments">Earth Auger Attachments</option>
<option value="water-pump">Water Pump</option>
<option value="hose-pipe">Hose Pipe</option>
<option value="sprayer">Sprayer</option>
<option value="garden-sprayer">Garden Sprayer</option>
<option value="ulv-sprayer">ULV Sprayer</option>
<option value="mist-sprayer">Mist Sprayer</option>
<option value="thermal-fogging-machine">Thermal Fogging Machine</option>
<option value="power-reaper">Power Reaper</option>
<option value="brush-cutter">Brush Cutter</option>
<option value="power-pruner">Power Pruner</option>
<option value="tea-pruner">Tea Pruner</option>
<option value="tea-harvester">Tea Harvester</option>
<option value="chainsaw">Chainsaw</option>
<option value="wood-cutter">Wood Cutter</option>
<option value="flour-mill">Flour Mill</option>
<option value="rice-mill">Rice Mill</option>
<option value="thresher">Thresher</option>
<option value="chaff-cutter">Chaff Cutter</option>
<option value="lawn-mower">Lawn Mower</option>
<option value="garden-sprayer-hand-held">Garden Sprayer (Hand-held)</option>
<option value="seeder">Seeder</option>
<option value="planter">Planter</option>
<option value="wood-chipper">Wood Chipper</option>
<option value="sheep-wool-clipper">Sheep Wool Clipper</option>
<option value="car-washer">Car Washer</option>
<option value="snow-thrower">Snow Thrower</option>
<option value="disc-harrow">Disc Harrow</option>
<option value="petrol-engine">Petrol Engine</option>
<option value="diesel-engine">Diesel Engine</option>


          
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
              className="w-full md:max-w-[350px] md:ml-7 p-3 rounded-lg border border-white/20 bg-white/100 text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
