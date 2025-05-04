'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Image from 'next/image';
import VoiceCommandButton from './VoiceCommandButton';

interface MockRoomScannerProps {
  onScanComplete: (styleData: any, dimensions: any) => void;
}

const MockRoomScanner: React.FC<MockRoomScannerProps> = ({ onScanComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'processing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [showTryItButton, setShowTryItButton] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const animationRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  
  // Status messages that will be displayed during scanning
  const statusMessages = [
    "Initializing room scan...",
    "Analyzing wall colors...",
    "Detecting furniture styles...",
    "Measuring room dimensions...",
    "Calculating optimal furniture placement...",
    "Identifying lighting conditions...",
    "Evaluating spatial relationships...",
    "Determining style preferences...",
    "Matching with trending designs...",
    "Finalizing personalized recommendations..."
  ];

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a simple room outline (cube)
    const roomGeometry = new THREE.BoxGeometry(4, 3, 4);
    const edges = new THREE.EdgesGeometry(roomGeometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x2196f3 })
    );
    scene.add(line);
    
    // Create empty point cloud for scanning effect
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x00ff00,
      size: 0.05,
      transparent: true,
      opacity: 0.7
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
    pointsRef.current = points;
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      line.rotation.y += 0.002;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update point cloud during scanning
  useEffect(() => {
    if (scanningState !== 'scanning' || !pointsRef.current || !sceneRef.current) return;
    
    const updatePointCloud = () => {
      // Generate random points within the room boundaries
      const numPoints = Math.floor(progress * 50); // More points as progress increases
      const positions = new Float32Array(numPoints * 3);
      
      for (let i = 0; i < numPoints; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 3.8; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2.8; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3.8; // z
      }
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      // Update the point cloud
      if (pointsRef.current) {
        pointsRef.current.geometry.dispose();
        pointsRef.current.geometry = geometry;
      }
    };
    
    updatePointCloud();
  }, [progress, scanningState]);
  
  // Handle scanning progress
  useEffect(() => {
    if (scanningState !== 'scanning') return;
    
    // Update progress and status message
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.01;
        
        // Update status message based on progress
        const messageIndex = Math.floor(newProgress * statusMessages.length);
        if (messageIndex < statusMessages.length) {
          setStatusMessage(statusMessages[messageIndex]);
        }
        
        // Complete scan when progress reaches 100%
        if (newProgress >= 1) {
          clearInterval(interval);
          setScanningState('processing');
          
          // Simulate processing time
          setTimeout(() => {
            completeScan();
          }, 1500);
        }
        
        return Math.min(newProgress, 1);
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [scanningState]);
  
  // Start the scanning process
  const startScan = async () => {
    setScanningState('scanning');
    setProgress(0);
    setStatusMessage(statusMessages[0]);
  };
  
  // Complete the scan and fetch mock results
  const completeScan = async () => {
    try {
      // Fetch mock scan results from our API
      const response = await fetch('/api/scan-results');
      const data = await response.json();
      
      // Call the onScanComplete callback with the results
      onScanComplete(data.roomStyle, data.roomDimensions);
      
      setScanningState('complete');
    } catch (error) {
      console.error('Error fetching scan results:', error);
      // Provide fallback data in case of error
      const fallbackStyle = {
        id: 'mid-century',
        name: 'Mid-Century Modern',
        description: 'Retro-inspired design with organic forms and bold colors.',
        confidence: 0.83
      };
      
      const fallbackDimensions = {
        width: 4.2,
        length: 5.1,
        height: 2.8,
        area: 21.42
      };
      
      onScanComplete(fallbackStyle, fallbackDimensions);
      setScanningState('complete');
    }
  };
  
  // Show pre-recorded demo
  const showDemo = () => {
    setShowTryItButton(false);
    startScan();
  };
  
  // Toggle "How It Works" overlay
  const toggleHowItWorks = () => {
    setShowHowItWorks(prev => !prev);
  };
  
  return (
    <div className="relative w-full h-full">
      {/* 3D Visualization Container */}
      <div ref={containerRef} className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
        {/* This is where Three.js will render */}
      </div>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900/70 to-transparent">
        {scanningState === 'idle' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              
              
              <VoiceCommandButton onScanTriggered={startScan} />
            </div>
            
            <button
              onClick={toggleHowItWorks}
              className="text-white underline text-sm"
            >
              {showHowItWorks ? 'Hide How It Works' : 'How It Works'}
            </button>
            
            {!navigator.xr && (
              <button
                onClick={() => setShowTryItButton(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all"
              >
                WebXR Not Available? Try Demo
              </button>
            )}
          </div>
        )}
        
        {showTryItButton && (
          <div className="flex justify-center">
            <button
              onClick={showDemo}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg animate-pulse transition-all"
            >
              Try It Now!
            </button>
          </div>
        )}
        
        {(scanningState === 'scanning' || scanningState === 'processing') && (
          <div className="space-y-3">
            <div className="flex justify-between text-white text-sm font-medium">
              <span>{Math.round(progress * 100)}% Complete</span>
              <span>{scanningState === 'processing' ? 'Processing...' : statusMessage}</span>
            </div>
            
            <div className="w-full bg-gray-300 rounded-full h-2.5">
              <div
                className="bg-[#FF9900] h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* "How It Works" Overlay */}
      {showHowItWorks && (
        <div className="absolute inset-0 bg-gray-900/80 p-6 overflow-auto">
          <button
            onClick={toggleHowItWorks}
            className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-2xl mx-auto text-white">
            <h3 className="text-2xl font-bold mb-4 text-[#FF9900]">How Our AI Room Scanner Works</h3>
            
            <div className="space-y-6">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 text-[#FF9900]">WebXR Technology</h4>
                <p className="text-gray-200">Our scanner uses WebXR to create a 3D map of your room. This technology accesses your device's camera and motion sensors to understand the physical space around you.</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 text-[#FF9900]">CLIP AI Analysis</h4>
                <p className="text-gray-200">CLIP (Contrastive Language-Image Pre-training) is an AI model developed by OpenAI that understands both images and text. Our system uses CLIP to analyze your room's visual style and match it with our product database.</p>
                <div className="mt-3 flex items-center justify-center">
                  <div className="bg-gray-700 p-3 rounded-lg text-xs text-center">
                    <pre className="whitespace-pre-wrap text-left">
                      {`{
  "style": "minimalist",
  "dominantColor": "#F5F5F5",
  "confidence": 0.87,
  "recommendedProducts": [101, 203, 305]
}`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 text-[#FF9900]">Room Dimension Analysis</h4>
                <p className="text-gray-200">We measure your room's dimensions using depth sensing and spatial mapping. This ensures that recommended furniture will fit perfectly in your space.</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 text-[#FF9900]">Personalized Recommendations</h4>
                <p className="text-gray-200">By combining style analysis and room dimensions, our AI generates personalized product recommendations that match both your aesthetic preferences and spatial requirements.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Metrics Dashboard */}
      <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg shadow-md text-xs font-medium">
        <div className="text-gray-800">Rooms Scanned</div>
        <div className="text-2xl font-bold text-[#232F3E]">
          {10000 + Math.floor(Math.random() * 500)}
        </div>
      </div>
      
      {/* Hackathon Banner */}
      <div className="absolute top-4 left-4">
        <a 
          href="#"
          className="inline-block bg-gradient-to-r from-[#232F3E] to-[#131921] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          🏆 Deployed on Netlify
        </a>
      </div>
    </div>
  );
};

export default MockRoomScanner;