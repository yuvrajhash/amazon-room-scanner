'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { initScanner, calculateStyleMatch, pinterestTrendStyles, getRoomDimensions } from '../lib/roomScanner';
import { initRoomScanner, stopScan, getRoomDimensions as getXRRoomDimensions, checkDeviceCapabilities, getARFallbackUrl } from '../lib/scanner';

interface RoomScannerUIProps {
  onScanComplete?: (styleData: any, dimensions: any) => void;
}

interface DeviceCapabilities {
  webXR: boolean;
  arKit: boolean;
  arCore: boolean;
  quickLook: boolean;
  sceneViewer: boolean;
  deviceInfo: {
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    screenWidth: number;
    screenHeight: number;
    pixelRatio: number;
  };
}

const RoomScannerUI: React.FC<RoomScannerUIProps> = ({ onScanComplete }) => {
  const [scanningState, setScanningState] = useState<'idle' | 'initializing' | 'scanning' | 'processing' | 'complete' | 'unsupported'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [detectedStyle, setDetectedStyle] = useState<any>(null);
  const [roomDimensions, setRoomDimensions] = useState<any>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const scannerUIRef = useRef<HTMLDivElement>(null);
  const pointCloudRef = useRef<any[]>([]);
  
  // Check device capabilities on component mount
  useEffect(() => {
    const checkCapabilities = async () => {
      const capabilities = await checkDeviceCapabilities();
      setDeviceCapabilities(capabilities);
      
      // Set fallback URL for sample furniture model
      if (!capabilities.webXR) {
        const sampleModelUrl = 'https://example.com/models/sample-furniture.glb';
        const url = getARFallbackUrl(sampleModelUrl, { title: 'View Sample Furniture' });
        setFallbackUrl(url);
      }
    };
    
    checkCapabilities();
  }, []);

  // Start the scanning process
  const startScan = async () => {
    if (!scannerUIRef.current) return;
    
    setScanningState('initializing');
    setError(null);
    setProgress(0);
    
    try {
      // Check if WebXR is supported on this device
      if (deviceCapabilities && !deviceCapabilities.webXR) {
        // Device doesn't support WebXR, show fallback options
        setScanningState('unsupported');
        return;
      }
      
      // Initialize WebXR scanner using the enhanced scanner.js implementation
      const scannerResult = await initRoomScanner(scannerUIRef.current);
      
      if (!scannerResult.supported) {
        setError(scannerResult.error || 'Your device does not support AR scanning');
        
        // Check if fallback is available
        if (scannerResult.fallbackAvailable && 
            (scannerResult.fallbackAvailable.quickLook || scannerResult.fallbackAvailable.sceneViewer)) {
          setScanningState('unsupported');
        } else {
          setScanningState('idle');
        }
        return;
      }
      
      // Start scanning process
      setScanningState('scanning');
      
      // Listen for scan progress updates
      const handleScanProgress = (event: CustomEvent) => {
        if (event.detail) {
          // Update progress based on point cloud density
          setProgress(event.detail.progress || 0);
          
          // Store device info if available
          if (event.detail.deviceInfo && !deviceCapabilities) {
            setDeviceCapabilities({
              webXR: true,
              arKit: false,
              arCore: false,
              quickLook: false,
              sceneViewer: false,
              deviceInfo: event.detail.deviceInfo
            });
          }
          
          if (event.detail.progress >= 100) {
            completeScan();
          }
        }
      };
      
      window.addEventListener('scanProgress', handleScanProgress as EventListener);
      
      // Auto-complete scan after timeout - adjust based on device performance
      const timeoutDuration = deviceCapabilities?.deviceInfo.isMobile ? 20000 : 15000;
      const timeoutId = setTimeout(() => {
        if (scanningState === 'scanning') {
          completeScan();
        }
      }, timeoutDuration);
      
      return () => {
        window.removeEventListener('scanProgress', handleScanProgress as EventListener);
        clearTimeout(timeoutId);
        stopScan(); // Ensure we clean up the XR session
      };
    } catch (err) {
      console.error('Error starting scan:', err);
      setError('Failed to start AR scanning. Please try again.');
      setScanningState('idle');
    }
  };
  
  // Launch fallback AR experience
  const launchARFallback = () => {
    if (fallbackUrl) {
      window.location.href = fallbackUrl;
    }
  };

  // Complete the scanning process
  const completeScan = async () => {
    setScanningState('processing');
    setProgress(100);
    
    try {
      // Get room dimensions from the enhanced scanner.js implementation
      const dimensions = getXRRoomDimensions();
      setRoomDimensions(dimensions);
      
      // Analyze style using CLIP
      const matchedStyle = await calculateStyleMatch(
        [], // In a real app, this would be images from the scan
        pinterestTrendStyles
      );
      
      setDetectedStyle(matchedStyle);
      setScanningState('complete');
      
      // Clean up XR session
      stopScan();
      
      // Notify parent component
      if (onScanComplete) {
        onScanComplete(matchedStyle, dimensions);
      }
    } catch (err) {
      console.error('Error processing scan:', err);
      setError('Failed to analyze your room. Please try again.');
      setScanningState('idle');
      stopScan(); // Ensure we clean up the XR session even on error
    }
  };

  return (
    <div className="room-scanner-ui" ref={scannerUIRef}>
      {/* Scanner UI overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {scanningState === 'idle' && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-auto px-4 sm:px-0">
            <button 
              onClick={startScan}
              className="bg-amazon-yellow text-black font-bold py-3 px-6 rounded-full shadow-lg flex items-center text-sm sm:text-base"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Start Room Scan
            </button>
          </div>
        )}
        
        {scanningState === 'unsupported' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold">AR Not Supported</h3>
                <button 
                  onClick={() => setScanningState('idle')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="mb-4 text-sm sm:text-base">Your device doesn't support WebXR for room scanning. You can:</p>
              
              <div className="space-y-3">
                {fallbackUrl && (
                  <button 
                    onClick={launchARFallback}
                    className="w-full bg-amazon-yellow text-black font-bold py-2 px-4 rounded flex items-center justify-center text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    View Sample in AR
                  </button>
                )}
                
                <button 
                  onClick={() => setScanningState('idle')}
                  className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded flex items-center justify-center text-sm sm:text-base"
                >
                  Continue Without AR
                </button>
              </div>
            </div>
          </div>
        )}
        
        {(scanningState === 'initializing' || scanningState === 'scanning') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-0">
            <div className="bg-black bg-opacity-70 p-4 sm:p-6 rounded-lg max-w-sm text-center">
              <div className="animate-pulse mb-4">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                {scanningState === 'initializing' ? 'Initializing Scanner...' : 'Scanning Your Room...'}
              </h3>
              <p className="mb-4 text-sm sm:text-base">Please move your device slowly around the room</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-amazon-yellow h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs sm:text-sm">{progress}% complete</p>
              
              {deviceCapabilities?.deviceInfo.isMobile && (
                <div className="mt-4 text-xs bg-white bg-opacity-10 p-2 rounded">
                  <p>For best results, move your {deviceCapabilities.deviceInfo.isIOS ? 'iPhone/iPad' : 'device'} slowly in a sweeping motion</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {scanningState === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center text-white px-4 sm:px-0">
            <div className="bg-black bg-opacity-70 p-4 sm:p-6 rounded-lg max-w-sm text-center">
              <div className="animate-spin mb-4">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Analyzing Your Space</h3>
              <p className="text-sm sm:text-base">Identifying your style preferences and room dimensions...</p>
            </div>
          </div>
        )}
        
        {scanningState === 'complete' && detectedStyle && (
          <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-0">
            <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Scan Complete!</h3>
                <button 
                  onClick={() => setScanningState('idle')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-bold text-base sm:text-lg mb-1">Your Style: {detectedStyle.name}</h4>
                <p className="text-gray-600 text-sm sm:text-base">{detectedStyle.description}</p>
              </div>
              
              {roomDimensions && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <h4 className="font-bold mb-1 text-sm sm:text-base">Room Dimensions</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Width</p>
                      <p className="font-bold text-sm sm:text-base">
                        {roomDimensions.width.toFixed(2)}{roomDimensions.units === 'feet' ? 'ft' : 'm'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Height</p>
                      <p className="font-bold text-sm sm:text-base">
                        {roomDimensions.height.toFixed(2)}{roomDimensions.units === 'feet' ? 'ft' : 'm'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {roomDimensions.depth ? 'Depth' : 'Length'}
                      </p>
                      <p className="font-bold text-sm sm:text-base">
                        {(roomDimensions.depth || roomDimensions.length).toFixed(2)}{roomDimensions.units === 'feet' ? 'ft' : 'm'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="font-bold mb-2">Popular Items For Your Style:</h4>
                <ul className="list-disc pl-5">
                  {detectedStyle.popularItems.map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <Link 
                href="/"
                className="block w-full bg-amazon-yellow text-center text-black font-bold py-2 rounded mt-4"
              >
                View Recommended Products
              </Link>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomScannerUI;