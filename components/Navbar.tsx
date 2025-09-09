'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import CategorySection from './CategoryMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
    const [showMobileCategories, setShowMobileCategories] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', dash: '0 2 8 73.3 8 10.7' },
    { href: '/category/tractors', label: 'Categories', dash: '0 12.6 9.5 49.3 9.5 31.6' },
    { href: '/aboutus', label: 'About Us', dash: '0 24.5 8.5 27.5 8.5 55.5' },
    { href: '/faq', label: 'FAQ', dash: '0 34.7 6.9 10.2 6.9 76' },
  ];

  const [dashArray, setDashArray] = useState('0 0 10 40 10 40');

  return (
    <header className="bg-white text-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Regreen Agro Logo"
            width={160}
            height={60}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block relative w-[400px] h-[60px]">
          <div className="absolute inset-0 flex justify-around items-center rounded-full px-4">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => {
                  setDashArray(link.dash);
                  if (link.label === 'Categories') setShowCategories(true);
                }}
                onMouseLeave={() => {
                  setDashArray('0 0 10 40 10 40');
                  if (link.label === 'Categories') setShowCategories(false);
                }}
              >
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 text-black cursor-pointer transition-all duration-150 ${
                    pathname === link.href ? 'font-bold text-[#2cd882]' : ''
                  } group`}
                >
                  <span className="absolute inset-0 rounded-md bg-[#2cd882] opacity-0 group-hover:opacity-100 transition"></span>
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Animated SVG outline */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 60"
            height={60}
            width={400}
            overflow="visible"
            className="absolute inset-0 pointer-events-none"
          >
            <rect
              strokeWidth={5}
              fill="transparent"
              height={60}
              width={400}
              pathLength={100}
              className="stroke-[#2cd882] transition-all duration-500"
              style={{
                strokeDasharray: dashArray,
                strokeDashoffset: 0,
              }}
            />
          </svg>
        </div>

        {/* Mobile Menu Button */}
         <button
          className="md:hidden flex items-center"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setShowMobileCategories(false);
          }}
        >
          {menuOpen ? (
            <XMarkIcon className="h-8 w-8 text-gray-800" />
          ) : (
            <Bars3Icon className="h-8 w-8 text-gray-800" />
          )}
        </button>
      </div>

      {/* 🔥 Full-width Category Dropdown below navbar */}
      {showCategories && (
        <div
          className="absolute left-0 w-[1500px] z-40  md:-mt-6 md:pl-40 md:pr-14 shadow-md"
          onMouseEnter={() => setShowCategories(true)}
          onMouseLeave={() => setShowCategories(false)}
        >
          {/* invisible buffer to bridge gap */}
    
          <CategorySection />
        </div>
      )}
{/* Mobile Dropdown Layer */}
{menuOpen && (
  <div className="md:hidden fixed inset-0 z-50 flex justify-end bg-none">
    {/* Category Panel (left side of nav) */}
    {showMobileCategories && (
      <div className="w-[60%] bg-white shadow-md p-4 overflow-y-auto">
        <CategorySection mobile />
      </div>
    )}

    {/* Nav Menu (right side, 40%) */}
    <div className="w-[40%] bg-white shadow-md border-l p-4 flex flex-col">
      <nav className="flex flex-col space-y-4">
        {navLinks.map((link) =>
          link.label === 'Categories' ? (
            <button
              key={link.href}
              onClick={() => setShowMobileCategories(!showMobileCategories)}
              className="text-gray-700 text-left font-medium"
            >
              Categories
            </button>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`transition-colors duration-200 hover:text-black ${
                pathname === link.href
                  ? 'text-black font-semibold'
                  : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          )
        )}
      </nav>
    </div>
  </div>
)}
    </header>
  );
}
