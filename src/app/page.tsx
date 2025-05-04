"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import AmazonHeaderWithScanner from '../components/AmazonHeaderWithScanner';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "/mother.jpg",
      title: "Thoughtful Gifts",
      description: "Show your love this Mother's Day"
    },
    {
      image: "/beauty.jpg",
      title: "Beauty Essentials",
      description: "Pamper your loved ones"
    },
    {
      image: "/kithchen.jpg",
      title: "Kitchen Upgrades",
      description: "Modern tools for home chefs"
    },
    {
      image: "/shop.jpg",
      title: "Jewelry Collection",
      description: "Sparkling gifts she'll adore"
    },
    {
      image: "/new.jpg",
      title: "New Arrivals",
      description: "Fresh picks for this season"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[300px] w-full overflow-hidden">
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-transparent bg-opacity-30 flex items-center pl-12">
              <div className="text-black max-w-md">
                <h1 className="text-4xl font-bold mb-2">{slide.title}</h1>
                <p className="text-xl mb-4">{slide.description}</p>
                <button className="bg-[#907fce] hover:bg-[#11100a] text-black font-bold py-2 px-6 rounded">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-100'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  // Mock product data with real images
  const products = [
    {
      id: '1',
      title: 'Modern Minimalist Architecture Wall Art',
      price: 11.99,
      rating: 5,
      image: '/images/andrew-sharp-J90zM9OtBXY-unsplash.jpg',
      isPrime: true,
      textColor: 'black'
    },
    {
      id: '2',
      title: 'Minimalist Bedside Lamp with Fabric Shade – Warm Ambient Light for Reading, Bedroom, or Study Room',
      price: 239.00,
      rating: 4,
      image: '/images/javier-miranda-_qRw7eL5lNI-unsplash.jpg',
      isPrime: true,
    },
    {
      id: '3',
      title: "Antique-Style Decorative Hanging Bulbs",
      price: 999.99,
      rating: 3,
      image: '/images/jean-philippe-delberghe-Ry9WBo3qmoc-unsplash.jpg',
      isPrime: false,
    },
    {
      id: '4',
      title: 'Heavy-Duty E27 Bulb Holder',
      price: 99.99,
      rating: 5,
      image: '/images/jon-tyson-py9sH2rThWs-unsplash.jpg',
      isPrime: true,
    },
    {
      id: '5',
      title: '3-Seater Modern Fabric Sofa – Minimalist Design with Wooden Legs – Perfect for Living Room & Office',
      price: 799.99,
      rating: 4,
      image: '/images/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg',
      isPrime: true,
    },
    {
      id: '6',
      title: 'Modern Accent Comfort Chair – Upholstered Armchair with Wooden Legs – Elegant & Cozy Living Room Chair',
      price: 1299.99,
      rating: 5,
      image: '/images/suchit-poojari-ljRiZl00n18-unsplash.jpg',
      isPrime: true,
    },
  
  ];

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <AmazonHeaderWithScanner />
      
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Product Categories Grid */}
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 p-4 my-6 bg-white">
        {/* Kitchen Appliances Category */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-black font-bold mb-2">Top categories in Kitchen appliances</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg" alt="Cooker" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Cooker</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/jon-tyson-py9sH2rThWs-unsplash.jpg" alt="Coffee" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Coffee</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/jean-philippe-delberghe-Ry9WBo3qmoc-unsplash.jpg" alt="Pots and Pans" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Pots and Pans</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/andrew-sharp-J90zM9OtBXY-unsplash.jpg" alt="Kettles" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Kettles</span>
            </div>
          </div>
        </div>
        
        {/* Home Essentials Category */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-black font-bold mb-2">Shop for your home essentials</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/javier-miranda-_qRw7eL5lNI-unsplash.jpg" alt="Cleaning Tools" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Cleaning Tools</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg" alt="Home Storage" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Home Storage</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/suchit-poojari-ljRiZl00n18-unsplash.jpg" alt="Home Decor" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Home Decor</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/tiana-borcherding-1eVYwkNHqVU-unsplash.jpg" alt="Bedding" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Bedding</span>
            </div>
          </div>
        </div>
        
        {/* Gaming Accessories Category */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-black font-bold mb-2">Gaming accessories</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/jean-philippe-delberghe-Ry9WBo3qmoc-unsplash.jpg" alt="Headsets" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Headsets</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg" alt="Keyboards" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Keyboards</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/jon-tyson-py9sH2rThWs-unsplash.jpg" alt="Computer mice" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Computer mice</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/andrew-sharp-J90zM9OtBXY-unsplash.jpg" alt="Chairs" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Chairs</span>
            </div>
          </div>
        </div>
        
        {/* New Home Arrivals Category */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-black font-bold mb-2">New home arrivals under $50</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg" alt="Kitchen & Dining" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Kitchen & Dining</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/jean-philippe-delberghe-Ry9WBo3qmoc-unsplash.jpg" alt="Home Improvement" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Home Improvement</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/suchit-poojari-ljRiZl00n18-unsplash.jpg" alt="Decor" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Decor</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-100 mb-2 overflow-hidden">
                <Image src="/images/tiana-borcherding-1eVYwkNHqVU-unsplash.jpg" alt="Bedding & Bath" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-black">Bedding & Bath</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scanner Feature Highlight */}
      <div className="max-w-screen-2xl mx-auto my-6 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-[#232F3E]">How Amazon AI Room Scanner Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-md text-center hover:shadow-md transition-shadow">
            <div className="relative h-16 w-16 mx-auto mb-4">
              <Image 
                src="/window.svg" 
                alt="Scan icon" 
                fill 
                style={{objectFit: 'contain'}} 
              />
            </div>
            <h3 className="font-bold text-lg text-black mb-2">Scan Your Room</h3>
            <p className="text-gray-700">Use your device's camera to scan your room with our WebXR technology</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-md text-center hover:shadow-md transition-shadow">
            <div className="relative h-16 w-16 mx-auto mb-4">
              <Image 
                src="/globe.svg" 
                alt="AI icon" 
                fill 
                style={{objectFit: 'contain'}} 
              />
            </div>
            <h3 className="font-bold text-lg text-black mb-2">AI Style Analysis</h3>
            <p className="text-gray-700">Our CLIP-powered AI detects your room's style and dimensions</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-md text-center hover:shadow-md transition-shadow">
            <div className="relative h-16 w-16 mx-auto mb-4">
              <Image 
                src="/file.svg" 
                alt="Recommendations icon" 
                fill 
                style={{objectFit: 'contain'}} 
              />
            </div>
            <h3 className="font-bold text-lg text-black mb-2">Perfect Recommendations</h3>
            <p className="text-gray-700">Get personalized furniture recommendations that fit your space</p>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="max-w-screen-2xl mx-auto my-6">
        <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-5">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="flex flex-col bg-white text-black p-5 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="flex-grow space-y-2 mb-3">
                <p className="line-clamp-2 text-sm">{product.title}</p>
                <div className="flex">
                  {Array(product.rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-500">⭐</span>
                    ))}
                </div>
                <div className="mb-5">
                  <span className="text-xs align-top">$</span>
                  <span className="text-xl font-semibold">{product.price}</span>
                </div>
                {product.isPrime && (
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-blue-500 font-bold">Prime</div>
                    <div className="text-xs text-gray-500">FREE Next-day Delivery</div>
                  </div>
                )}
              </div>
              <div className="relative h-[150px] w-full mb-3">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  style={{objectFit: 'contain'}} 
                />
              </div>
              <button className="mt-auto button bg-[#f0c14b] border border-solid py-1 px-2 text-xs md:text-sm text-black border-[#a88734] rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 active:from-yellow-500">
                Add to Basket
              </button>
            </div>
          ))}

          {/* Large product */}
          <div className="md:col-span-full">
            <div className="flex flex-col md:flex-row bg-white text-black p-5 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="flex-grow space-y-2 mb-3 md:pr-8">
                <p className="text-xl font-semibold mb-2">{products[4].title}</p>
                <div className="flex">
                  {Array(products[4].rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-500">⭐</span>
                    ))}
                </div>
                <div className="mb-5">
                  <span className="text-sm text-black align-top">$</span>
                  <span className="text-2xl font-semibold">{products[4].price}</span>
                </div>
                <p className="text-sm text-gray-600">3-Seater Modern Fabric Sofa – Minimalist Design with Wooden Legs – Perfect for Living Room & Office.</p>
                {products[4].isPrime && (
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-blue-500 font-bold">Prime</div>
                    <div className="text-xs text-gray-500">FREE Next-day Delivery</div>
                  </div>
                )}
              </div>
              <div className="relative h-[200px] md:h-[250px] w-full md:w-[300px] flex-shrink-0">
                <Image 
                  src={products[4].image} 
                  alt={products[4].title} 
                  fill 
                  style={{objectFit: 'contain'}} 
                />
              </div>
              <div className="flex flex-col justify-end md:ml-4">
                <button className="button bg-[#f0c14b] border border-solid py-1 px-4 text-sm text-black border-[#a88734] rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 active:from-yellow-500 w-full md:w-auto">
                  Add to Basket
                </button>
              </div>
            </div>
          </div>

          {/* Remaining products */}
          {products.slice(5).map((product) => (
            <div key={product.id} className="flex flex-col bg-white text-black p-5 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="flex-grow space-y-2 mb-3">
                <p className="line-clamp-2 text-sm">{product.title}</p>
                <div className="flex">
                  {Array(product.rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-500">⭐</span>
                    ))}
                </div>
                <div className="mb-5">
                  <span className="text-xs align-top">$</span>
                  <span className="text-xl font-semibold">{product.price}</span>
                </div>
                {product.isPrime && (
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-blue-500 font-bold">Prime</div>
                    <div className="text-xs text-gray-500">FREE Next-day Delivery</div>
                  </div>
                )}
              </div>
              <div className="relative h-[150px] w-full mb-3">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  style={{objectFit: 'contain'}} 
                />
              </div>
              <button className="mt-auto button bg-[#f0c14b] border border-solid py-1 px-2 text-xs md:text-sm text-black border-[#a88734] rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 active:from-yellow-500">
                Add to Basket
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#131A22] text-white p-8 text-center mt-5">
        <div className="flex flex-wrap justify-evenly mb-5">
          <div className="flex flex-col text-left p-2">
            <h4 className="mb-2">Get to Know Us</h4>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Careers</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">About Amazon</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Investor Relations</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Amazon Devices</a>
          </div>
          <div className="flex flex-col text-left p-2">
            <h4 className="mb-2">Make Money with Us</h4>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Sell on Amazon</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Sell Under Amazon Accelerator</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Amazon Associates</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Advertise Your Products</a>
          </div>
          <div className="flex flex-col text-left p-2">
            <h4 className="mb-2">Amazon Payment Products</h4>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Amazon Business Card</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Shop with Points</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Reload Your Balance</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Amazon Currency Converter</a>
          </div>
          <div className="flex flex-col text-left p-2">
            <h4 className="mb-2">Let Us Help You</h4>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Amazon and COVID-19</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Your Account</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Your Orders</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Shipping Rates & Policies</a>
            <a href="#" className="text-[#DDD] no-underline mb-1 text-sm">Returns & Replacements</a>
          </div>
        </div>
        <p>&copy; 2025 Amazon Clone</p>
      </footer>
    </div>
  );
}