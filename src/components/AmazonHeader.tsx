'use client'; // Required for client-side components in Next.js 13+

import { FC } from 'react';
import Link from 'next/link';
import NextImage from 'next/image'; // Renamed to avoid conflicts

interface HeaderProps {}

const AmazonHeader: FC<HeaderProps> = () => {
  return (
    <header>
      {/* Top header with logo, search, account and basket */}
      <div className="flex items-center bg-[#131921] px-4 py-2 sticky top-0 z-[100]">
        {/* Amazon Logo - Now using Next.js Image */}
        <div className="mr-4">
          <Link href="/" className="flex items-center">
            <div className="relative w-[100px] h-[40px]">
              <NextImage
                src="/amazon.png"
                alt="Amazon Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>
        
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
        
        {/* Account & Lists */}
        <div className="flex flex-col text-white mx-2 cursor-pointer">
          <span className="text-xs">Hello, Sign in</span>
          <span className="text-sm font-bold">Account & Lists</span>
        </div>
        
        {/* Returns & Orders */}
        <div className="flex flex-col text-white mx-2 cursor-pointer">
          <span className="text-xs">Returns</span>
          <span className="text-sm font-bold">& Orders</span>
        </div>
        
        {/* Basket */}
        <div className="flex items-center text-white mx-2 cursor-pointer">
          <div className="relative">
            <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.3 29C19.3 29.7732 18.6732 30.4 17.9 30.4C17.1268 30.4 16.5 29.7732 16.5 29C16.5 28.2268 17.1268 27.6 17.9 27.6C18.6732 27.6 19.3 28.2268 19.3 29Z" fill="white"/>
              <path d="M27.9 29C27.9 29.7732 27.2732 30.4 26.5 30.4C25.7268 30.4 25.1 29.7732 25.1 29C25.1 28.2268 25.7268 27.6 26.5 27.6C27.2732 27.6 27.9 28.2268 27.9 29Z" fill="white"/>
              <path d="M36.8 9.6H10.6L14.5 21.1H31.4L36.8 9.6Z" fill="white"/>
              <circle cx="31" cy="14" r="11" fill="#F7CA00"/>
              <text x="31" y="18" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="black" textAnchor="middle">0</text>
            </svg>
          </div>
          <span className="font-bold">Basket</span>
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
};

export default AmazonHeader;