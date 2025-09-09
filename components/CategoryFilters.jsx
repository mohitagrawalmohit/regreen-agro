// CategoryFilters.jsx
import React from "react";

const categories = ["Power Weeder", "Power Tiller", "Brush Cutter", "Sprayer"];

export default function CategoryFilters({ selectedCategory, onSelect }) {
  return (
    <div className="flex gap-4 flex-wrap justify-center md:justify-start px-4 py-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-6 py-2 rounded-full border text-white text-sm md:text-base transition-all duration-200 
            ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-green-900"
                : "border-yellow-400 hover:bg-yellow-400/20"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
