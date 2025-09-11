// components/Footer.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-gradient-to-br from-green-900 to-gray-900 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About / Branding */}
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Regreen Agro"
              width={150}
              height={50}
              priority
            />
          </Link>
          <p className="mt-4 text-sm">
            High quality agricultural machinery, tools & support you can trust.
          </p>
          <div className="flex space-x-4 mt-4">
            <Link href="#"><Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} /></Link>
            <Link href="#"><Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} /></Link>
            <Link href="#"><Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <button
            className="flex justify-between items-center w-full md:block"
            onClick={() => toggleSection('links')}
          >
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <span className="md:hidden">
              {openSection === 'links' ? <ChevronUp /> : <ChevronDown />}
            </span>
          </button>
          <div
            className={`mt-2 space-y-2 text-sm ${
              openSection === 'links' || typeof window === 'undefined'
                ? 'block'
                : 'hidden md:block'
            }`}
          >
            <Link href="/aboutus" className="block hover:underline">About Us</Link>
           
            <Link href="/contact" className="block hover:underline">Contact</Link>
            <Link href="/category/Power%20Weeder%20&%20Tiller" className="block hover:underline">Categories</Link>
            <Link href="/privacy" className="block hover:underline">Privacy Policy</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <button
            className="flex justify-between items-center w-full md:block"
            onClick={() => toggleSection('support')}
          >
            <h4 className="font-semibold text-lg">Support</h4>
            <span className="md:hidden">
              {openSection === 'support' ? <ChevronUp /> : <ChevronDown />}
            </span>
          </button>
          <div
            className={`mt-2 space-y-2 text-sm ${
              openSection === 'support' || typeof window === 'undefined'
                ? 'block'
                : 'hidden md:block'
            }`}
          >
            <p>📞 +91-9027799171</p>
            <p>✉️ support@regreenagro.in</p>
            <p>🏠 1234 Agro Street, Your City, State</p>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-lg">Subscribe</h4>
          <p className="text-sm mt-2">
            Get updates on new products, offers & more.
          </p>
          <form className="mt-3 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded bg-white text-green-900 focus:outline-none flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#F29728] hover:bg-[#D97C1E] rounded text-white font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 bg-gradient-to-br from-green-900 to-gray-900 pt-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between text-sm text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Regreen Agro. All rights reserved.</p>
          <div className="flex justify-center md:justify-end space-x-4 mt-2 md:mt-0">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
