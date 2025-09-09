'use client';

import { useState } from 'react';

const tabs = ['Description', 'Specifications', 'Ideal For'];

export default function ProductTabs({
  description,
  specifications,
  idealFor,
}: {
  description: string;
  specifications: { specName: string; description: string }[];
  idealFor: string;
}) {
  const [activeTab, setActiveTab] = useState('Description');

  const getContent = () => {
    switch (activeTab) {
      case 'Description':
        return <p>{description}</p>;

      case 'Specifications':
        return (
          <div className="overflow-x-auto px-0 pr-0 md:px-8 md:px-20">
            <table className="w-full border border-white text-white text-left text-[10px] sm:text-sm mt-1 md:mt-1">
              <thead>
                <tr>
                  <th className="border border-white px-1 sm:px-2 py-1">Specification</th>
                  <th className="border border-white px-1 sm:px-2 py-1">Description</th>
                </tr>
              </thead>
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index}>
                    <td className="border border-white px-1 sm:px-2 py-1">{spec.specName}</td>
                    <td className="border border-white px-1 sm:px-2 py-1">{spec.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Ideal For':
        case 'Ideal For':
  case 'Ideal For':
  const parts = idealFor.split('#').filter((part) => part.trim() !== '');
  return (
    <ul className="list-disc list-inside text-left">
      {parts.map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ul>
  );




      default:
        return '';
    }
  };

  return (
    <div className="mt-4 sm:mt-10 px-0 sm:px-0">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:pl-20 sm:gap-20 mb-2 sm:mb-4 w-full sm:w-[1600px] mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-20 py-1 sm:py-2 rounded-full text-sm sm:text-xl font-medium transition 
              ${
                activeTab === tab
                  ? 'bg-white text-black shadow'
                  : 'border border-white text-white hover:bg-white hover:text-black'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-full sm:max-w-5xl mx-auto text-center text-white text-base sm:text-xl leading-relaxed">
        {getContent()}
      </div>
    </div>
  );
}
