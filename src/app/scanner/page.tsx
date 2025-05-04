'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AmazonHeader from '../../components/AmazonHeader';
import RoomScannerUI from '../../components/RoomScannerUI';
import MockRoomScanner from '../../components/MockRoomScanner';
import * as THREE from 'three';
import { pinterestTrendStyles } from '../../lib/roomScanner';
import { initRoomScanner, stopScan, getRoomDimensions, analyzeRoomStyle, getRecommendedProducts } from '../../lib/scanner';

export default function ScannerPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const [detectedStyle, setDetectedStyle] = useState<any>(null);
  const [roomDimensions, setRoomDimensions] = useState<any>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Generate recommended products based on detected style
    if (detectedStyle) {
      // Simulate loading with progress
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      // In a real app, this would fetch from an API based on style
      setTimeout(() => {
        const styleBasedProducts = getRecommendedProductsByStyle(detectedStyle.id);
        setRecommendedProducts(styleBasedProducts);
      }, 2200);
      
      return () => clearInterval(interval);
    }
  }, [detectedStyle]);
  
  // Handle scan completion
  const handleScanComplete = (styleData: any, dimensions: any) => {
    setIsScanning(true);
    setScanProgress(0);
    
    setTimeout(() => {
      setDetectedStyle(styleData);
      setRoomDimensions(dimensions);
      setIsScanning(false);
      setScanComplete(true);
    }, 2500);
  };
  
  // Get recommended products based on style
  const getRecommendedProductsByStyle = (styleId: string) => {
    // This would be an API call in a real application
    // Mock products based on style with sustainability data
    const productsByStyle: {[key: string]: any[]} = {
      'modern': [
        {
          id: 'm1',
          title: 'Modern Minimalist Desk - White',
          price: 149.99,
          rating: 4.5,
          image: '/andrew-sharp-J90zM9OtBXY-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 120, height: 75, depth: 60 },
          material: 'Sustainable bamboo',
          ecoScore: 92,
          co2Savings: '18kg CO2 vs. average',
          sustainabilityFeatures: ['Renewable materials', 'Low-VOC finishes', 'Carbon-neutral shipping']
        },
        {
          id: 'm2',
          title: 'Contemporary Office Chair - Black Mesh',
          price: 189.99,
          rating: 4.2,
          image: '/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 60, height: 110, depth: 60 },
          material: 'Recycled polyester mesh',
          ecoScore: 88,
          co2Savings: '12kg CO2 vs. average',
          sustainabilityFeatures: ['Recycled materials', 'Modular design for repairs', 'Plastic-free packaging']
        },
      ],
      'scandinavian': [
        {
          id: 's1',
          title: 'Light Wood Desk with Storage',
          price: 199.99,
          rating: 4.7,
          image: '/jean-philippe-delberghe-Ry9WBo3qmoc-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 130, height: 75, depth: 65 },
          material: 'FSC-certified oak',
          ecoScore: 95,
          co2Savings: '22kg CO2 vs. average',
          sustainabilityFeatures: ['Sustainably harvested wood', 'Water-based finishes', 'Plastic-free packaging']
        },
        {
          id: 's2',
          title: 'White Ergonomic Chair with Wood Legs',
          price: 159.99,
          rating: 4.4,
          image: '/jon-tyson-py9sH2rThWs-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 55, height: 95, depth: 55 },
          material: 'Organic cotton and birch',
          ecoScore: 90,
          co2Savings: '15kg CO2 vs. average',
          sustainabilityFeatures: ['Organic textiles', 'Biodegradable components', 'Local manufacturing']
        },
      ],
      'industrial': [
        {
          id: 'i1',
          title: 'Metal and Wood Industrial Desk',
          price: 229.99,
          rating: 4.6,
          image: '/javier-miranda-_qRw7eL5lNI-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 140, height: 80, depth: 70 },
          material: 'Reclaimed wood and recycled steel',
          ecoScore: 87,
          co2Savings: '25kg CO2 vs. average',
          sustainabilityFeatures: ['Upcycled materials', 'Zero-waste manufacturing', 'Lifetime warranty']
        },
        {
          id: 'i2',
          title: 'Vintage-Style Leather Office Chair',
          price: 249.99,
          rating: 4.8,
          image: '/suchit-poojari-ljRiZl00n18-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 65, height: 105, depth: 65 },
          material: 'Plant-based leather alternative',
          ecoScore: 82,
          co2Savings: '16kg CO2 vs. average',
          sustainabilityFeatures: ['Vegan materials', 'Biodegradable components', 'Ethical manufacturing']
        },
      ],
      'mid-century': [
        {
          id: 'mc1',
          title: 'Mid-Century Modern Coffee Table',
          price: 179.99,
          rating: 4.9,
          image: '/tiana-borcherding-1eVYwkNHqVU-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 110, height: 45, depth: 60 },
          material: 'Sustainable walnut',
          ecoScore: 91,
          co2Savings: '20kg CO2 vs. average',
          sustainabilityFeatures: ['Responsibly sourced wood', 'Non-toxic finishes', 'Handcrafted locally']
        },
        {
          id: 'mc2',
          title: 'Retro Lounge Chair with Ottoman',
          price: 349.99,
          rating: 4.7,
          image: '/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 75, height: 85, depth: 80 },
          material: 'Recycled wool and sustainable wood',
          ecoScore: 89,
          co2Savings: '28kg CO2 vs. average',
          sustainabilityFeatures: ['Recycled textiles', 'Modular design for repairs', 'Carbon-offset shipping']
        },
      ],
      'default': [
        {
          id: 'd1',
          title: 'Modern Desk with Drawers - Perfect for Home Office',
          price: 129.99,
          rating: 4,
          image: '/andrew-sharp-J90zM9OtBXY-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 120, height: 75, depth: 60 },
          ecoScore: 80,
          co2Savings: '10kg CO2 vs. average',
          sustainabilityFeatures: ['Recycled materials', 'Energy-efficient production']
        },
        {
          id: 'd2',
          title: 'Ergonomic Office Chair with Lumbar Support',
          price: 199.99,
          rating: 5,
          image: '/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg',
          isPrime: true,
          dimensions: { width: 60, height: 110, depth: 60 },
          ecoScore: 75,
          co2Savings: '8kg CO2 vs. average',
          sustainabilityFeatures: ['Partially recycled materials', 'Designed for disassembly']
        },
      ]
    };
    
    return productsByStyle[styleId] || productsByStyle['default'];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AmazonHeader />
      
      <div className="max-w-screen-xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors duration-200">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              AI Room Scanner
            </span>
          </h1>
          
          {!scanComplete ? (
            <div className="text-center">
              <p className="mb-6 text-lg md:text-xl font-semibold text-gray-800">
                Scan your room to find furniture that fits your space and style
              </p>
              
              <div ref={containerRef} className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-8 overflow-hidden shadow-xl">
                {/* WebXR Room Scanner with Mock Fallback */}
                <div className="absolute inset-0 opacity-20 z-0">
                  <Image 
                    src="/pexels-karolina-grabowska-4041392.jpg" 
                    alt="Room background" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    priority
                  />
                </div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  {!isScanning ? (
                    <>
                      <MockRoomScanner onScanComplete={handleScanComplete} />
                      <div className="absolute bottom-6 left-0 right-0 px-6">
                        <button 
                          onClick={() => handleScanComplete(
                            pinterestTrendStyles[Math.floor(Math.random() * pinterestTrendStyles.length)], 
                            { width: 3.5 + Math.random() * 2, depth: 4 + Math.random() * 2, height: 2.4 + Math.random() * 0.6 }
                          )}
                          className="w-full max-w-md mx-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Start Room Scan
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 bg-white bg-opacity-90 rounded-xl shadow-sm max-w-md mx-auto">
                      <div className="inline-flex items-center justify-center mb-4">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Your Space</h3>
                      <p className="text-gray-600 mb-4">Our AI is processing your room dimensions and style preferences</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full transition-all duration-300 ease-out" 
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{scanProgress}% complete</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <h3 className="font-semibold text-xl mb-6 text-gray-800 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How it works
                </h3>
                <div className="space-y-6 text-left">
                  <div className="flex items-start group">
                    <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform duration-200">1</div>
                    <div className="pt-1">
                      <p className="font-semibold text-gray-900 text-lg">Click "Start Room Scan" to activate your camera</p>
                      <p className="text-gray-600 mt-1">Allow camera access when prompted to begin scanning</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-4.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-blue-100 ml-0.5"></div>
                    <div className="ml-12 pl-1">
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform duration-200">2</div>
                        <div className="pt-1">
                          <p className="font-semibold text-gray-900 text-lg">Move your device around to capture your room</p>
                          <p className="text-gray-600 mt-1">Our WebXR and LiDAR technology maps your space in 3D</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-4.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-blue-100 ml-0.5"></div>
                    <div className="ml-12 pl-1">
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform duration-200">3</div>
                        <div className="pt-1">
                          <p className="font-semibold text-gray-900 text-lg">AI analyzes your space and style preferences</p>
                          <p className="text-gray-600 mt-1">Our CLIP-powered AI identifies your design aesthetic</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-4.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-blue-100 ml-0.5"></div>
                    <div className="ml-12 pl-1">
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform duration-200">4</div>
                        <div className="pt-1">
                          <p className="font-semibold text-gray-900 text-lg">Get personalized furniture recommendations</p>
                          <p className="text-gray-600 mt-1">Products that fit perfectly and match your style</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                  <h4 className="font-semibold text-xl mb-4 text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Available Style Analysis
                  </h4>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {pinterestTrendStyles.map((style) => (
                      <span 
                        key={style.id} 
                        className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex items-center"
                      >
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: style.color }}
                        ></span>
                        {style.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-gray-700 bg-white bg-opacity-70 p-3 rounded-lg border border-gray-200">
                    Our AI analyzes your room dimensions and style to provide personalized furniture recommendations that fit perfectly in your space.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className="mb-8 p-8 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 z-0">
                  <Image 
                    src="/pexels-kaip-996329.jpg" 
                    alt="Style background" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                <div className="relative z-10 bg-white bg-opacity-90 p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Scan Complete!</h2>
                    <p className="mb-4 font-semibold text-gray-700">We've analyzed your room and detected your style:</p>
                    <div className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-full shadow-md mb-4">
                      {detectedStyle?.name}
                    </div>
                    <p className="text-gray-700 max-w-2xl">{detectedStyle?.description}</p>
                  </div>
                  
                  {roomDimensions && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Room Width</p>
                        <p className="font-bold text-2xl text-gray-900">
                          {roomDimensions.width ? roomDimensions.width.toFixed(2) : '0.00'}m
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4V20m0 0l-4-4m4 4l4-4" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Room Depth</p>
                        <p className="font-bold text-2xl text-gray-900">
                          {roomDimensions.depth ? roomDimensions.depth.toFixed(2) : '0.00'}m
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Ceiling Height</p>
                        <p className="font-bold text-2xl text-gray-900">
                          {roomDimensions.height ? roomDimensions.height.toFixed(2) : '0.00'}m
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-8">
                    <button 
                      onClick={() => {
                        setScanComplete(false);
                        setScanProgress(0);
                      }}
                      className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md border border-gray-300 flex items-center hover:shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Scan Again
                    </button>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 text-center">
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Recommended Products for Your Space
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {recommendedProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="border border-gray-200 rounded-xl p-6 flex flex-col shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-200 bg-white h-full transform hover:-translate-y-1"
                  >
                    <div className="relative h-60 mb-5 bg-white rounded-lg overflow-hidden border border-gray-100 group">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isPrime && (
                        <span className="absolute top-2 right-2 bg-[#232F3E] text-white text-xs px-2 py-1 rounded font-bold shadow-md">
                          Prime
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-3 text-gray-900 line-clamp-2 min-h-[3.5rem] hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">
                        {Array(Math.floor(product.rating))
                          .fill(0)
                          .map((_, i) => (
                            <svg 
                              key={i}
                              className="h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        {product.rating % 1 > 0 && (
                          <svg 
                            className="h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10 1l1.753 5.396h5.671l-4.588 3.333 1.753 5.396L10 11.796l-4.588 3.333 1.753-5.396L2.576 6.396h5.671L10 1z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-600">({product.rating})</span>
                    </div>
                    
                    <p className="text-2xl font-bold mb-5 text-gray-900">
                      <span className="text-base align-top">$</span>
                      {Math.floor(product.price)}
                      <span className="text-lg">{(product.price % 1).toFixed(2).substring(1)}</span>
                    </p>
                    
                    {product.dimensions && (
                      <div className="text-sm text-gray-700 mb-5 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-2">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                          <span className="font-semibold">Dimensions:</span> {product.dimensions.width}cm × {product.dimensions.height}cm × {product.dimensions.depth}cm
                        </div>
                        {roomDimensions && (
                          <div className="flex items-center text-green-600 font-medium">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Fits perfectly in your space
                          </div>
                        )}
                      </div>
                    )}
                    
                    {product.ecoScore && (
                      <div className="mb-5 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="font-semibold">Eco Score:</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-green-200 rounded-full mr-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600" 
                                style={{ width: `${product.ecoScore}%` }}
                              ></div>
                            </div>
                            <span className="font-bold">{product.ecoScore}/100</span>
                          </div>
                        </div>
                        {product.co2Savings && (
                          <div className="mb-3 text-sm font-medium">{product.co2Savings}</div>
                        )}
                        {product.sustainabilityFeatures && (
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {product.sustainabilityFeatures.slice(0, 2).map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-block mr-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-auto flex space-x-3">
                      <button className="flex-1 py-3 bg-gradient-to-b from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Try in AR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-px bg-gray-300 w-16"></div>
                  <div className="mx-4 text-gray-500 text-sm font-medium">Based on your room scan</div>
                  <div className="h-px bg-gray-300 w-16"></div>
                </div>
                <button className="px-6 py-3 bg-[#232F3E] text-white font-bold rounded-md hover:bg-[#19212b] transition-colors shadow-md flex items-center mx-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  View All Recommendations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}