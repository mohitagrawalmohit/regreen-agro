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
  "Power Reaper",
  "Accessories & Attachment",
  "Power & Engines"
];

export default function CategorySearchBar({ className }) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const dropdownRef = useRef(null);

  /* ---------- Fetch products once ---------- */
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    }
    fetchProducts();
  }, []);

  /* ---------- Filter ---------- */
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSelectCategory = (cat) => {
    router.push(`/category/${encodeURIComponent(cat)}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const onSelectProduct = (product) => {
    router.push(`/product/${product.id}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  /* ---------- Close dropdown if clicked outside ---------- */
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
        placeholder="Search Category or Product"
        className="w-full md:w-[1260px] h-[45px] md:h-[50px] pl-12 px-3 py-2 text-white rounded-[10px] border border-white focus:outline-none focus:ring-2 focus:ring-[#F29728]"
      />

      {showDropdown && (
        <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">

          {/* Categories Section */}
          {filteredCategories.length > 0 && (
            <>
              <li className="px-4 py-2 text-gray-500 text-sm font-semibold bg-gray-100">Categories</li>
              {filteredCategories.map(cat => (
                <li
                  key={cat}
                  className="px-4 py-2 hover:bg-green-200 cursor-pointer"
                  onClick={() => onSelectCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </>
          )}

          {/* Products Section */}
          {filteredProducts.length > 0 && (
            <>
              <li className="px-4 py-2 text-gray-500 text-sm font-semibold bg-gray-100">Products</li>
              {filteredProducts.map(product => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  {product.title}
                </li>
              ))}
            </>
          )}

          {/* No Results */}
          {filteredCategories.length === 0 && filteredProducts.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
