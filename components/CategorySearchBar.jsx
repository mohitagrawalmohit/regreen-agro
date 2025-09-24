'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const categories = [
  "Power Weeder & Tiller",
  "Earth Auger",
  "Pumps & Irrigation",
  "Sprayers & Crop Protection",
  "Harvesting Machinery",
  "Post Harvesting",
  "Lawn Mower & Gardening Tools",
  "Miscellaneous",
  "Power Reeper",
  "Accessories/Attachment",
  "Power & Engines"
];

export default function CategorySearchBar({ className }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSelectCategory = (cat) => {
    router.push(`/category/${encodeURIComponent(cat)}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <MagnifyingGlassIcon className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search Your Category"
        className="w-full md:w-[1260px] h-[45px] md:h-[50px] pl-12 md:pl-15 px-3 py-2 text-white rounded-[10px] border border-white focus:outline-none focus:ring-2 focus:ring-[#F29728]"
      />

      {showDropdown && (
        <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {filteredCategories.length ? (
            filteredCategories.map(cat => (
              <li
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="px-4 py-2 hover:bg-green-200 cursor-pointer"
              >
                {cat}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No categories found</li>
          )}
        </ul>
      )}
    </div>
  );
}
