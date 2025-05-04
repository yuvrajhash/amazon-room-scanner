'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AmazonHeaderWithScanner() {
  return (
    <header className="bg-[#131921] text-white sticky top-0 z-50">
      <div className="flex items-center p-2 flex-grow">
        {/* Logo */}
<Link href="/" className="mt-2 flex items-center flex-grow sm:flex-grow-0 mr-4">
  <Image 
    src="/amazon.png" 
    alt="Amazon Logo" 
    width={95}  // Adjust based on your logo dimensions
    height={40} 
    className="object-contain" 
  />
</Link>

        {/* Search */}
        <div className="flex-1 flex items-center mx-2">
          <div className="w-full flex relative">
            <input 
              className="h-10 px-3 py-2 rounded-l bg-white border-white text-black focus:outline-none w-full"
              type="text" 
              placeholder="Search Amazon"
            />
            <button className="h-10 w-10 bg-[#febd69] hover:bg-[#f3a847] text-black flex items-center justify-center rounded-r">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div className="link">
            <p>Hello, Sign in</p>
            <p className="font-extrabold md:text-sm">Account & Lists</p>
          </div>

          <div className="link">
            <p>Returns</p>
            <p className="font-extrabold md:text-sm">& Orders</p>
          </div>

          <div className="relative link flex items-center">
            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
              0
            </span>
            <span className="text-2xl">🛒</span>
            <p className="hidden md:inline font-extrabold md:text-sm mt-2">Basket</p>
          </div>

          {/* Room Scanner Button */}
          <Link href="/scanner" className="flex items-center bg-[#232f3e] hover:bg-[#3a4553] px-3 py-2 rounded transition-colors">
            <span className="mr-1">📷</span>
            <span className="font-bold">Room Scanner</span>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-3 p-2 pl-6 bg-[#232f3e] text-white text-sm">
        <p className="link flex items-center">
          <span className="mr-1">☰</span> All
        </p>
        <p className="link">Today's Deals</p>
        <p className="link">Customer Service</p>
        <p className="link">Registry</p>
        <p className="link">Gift Cards</p>
        <p className="link">Sell</p>
        <p className="link hidden lg:inline-flex">Electronics</p>
        <p className="link hidden lg:inline-flex">Food & Grocery</p>
        <p className="link hidden lg:inline-flex">Prime</p>
        <p className="link hidden lg:inline-flex">Buy Again</p>
        <p className="link hidden lg:inline-flex">Shopper Toolkit</p>
        <p className="link hidden lg:inline-flex">Health & Personal Care</p>
      </div>

      <style jsx>{`
        .link {
          cursor: pointer;
        }
        .link:hover {
          text-decoration: underline;
        }
      `}</style>
    </header>
  );
}