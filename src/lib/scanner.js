/**
 * Amazon AI Room Scanner Implementation
 * 
 * This module provides the core functionality for the Amazon AI Room Scanner feature,
 * including WebXR integration for room scanning and CLIP model for style analysis.
 * Optimized for cross-device compatibility (mobile, tablet, desktop) with responsive design.
 */

// WebXR session and related variables
let xrSession = null;
let xrRefSpace = null;
let xrHitTestSource = null;
let scanActive = false;
let pointCloud = [];

// Device detection and capabilities
const deviceInfo = {
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator?.userAgent || ''),
  isIOS: /iPad|iPhone|iPod/.test(navigator?.userAgent || '') && !(window && window.MSStream),
  isAndroid: /Android/i.test(navigator?.userAgent || ''),
  screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
  screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
};

// Style analysis using CLIP model
const styleCategories = [
  'Modern',
  'Scandinavian',
  'Industrial',
  'Bohemian',
  'Minimalist',
  'Mid-Century Modern',
  'Traditional',
  'Coastal',
  'Farmhouse',
  'Contemporary'
];

/**
 * Initialize the WebXR session for room scanning
 * @param {HTMLElement} domElement - The DOM element to attach the AR session to
 * @returns {Promise<Object>} - Result of the initialization
 */
export async function initRoomScanner(domElement) {
  // Check for WebXR support
  if (!navigator.xr) {
    console.error('WebXR not supported by this browser');
    return { 
      supported: false, 
      error: 'WebXR not supported by this browser',
      fallbackAvailable: checkForFallbackOptions()
    };
  }

  try {
    // Optimize session request based on device capabilities
    const sessionMode = 'immersive-ar';
    const isSupported = await navigator.xr.isSessionSupported(sessionMode);
    
    if (!isSupported) {
      return { 
        supported: false, 
        error: 'AR not supported on this device', 
        fallbackAvailable: checkForFallbackOptions() 
      };
    }

    // Determine optimal features based on device
    const requiredFeatures = ["hit-test", "dom-overlay"];
    const optionalFeatures = [];
    
    // Add plane detection if likely supported (better on newer devices)
    if (!deviceInfo.isIOS || (deviceInfo.isIOS && parseFloat(navigator.userAgent.match(/OS (\d+)_/)?.[1] || '0') >= 13)) {
      optionalFeatures.push("plane-detection");
    }
    
    // Add depth sensing as optional for compatible devices
    if (!deviceInfo.isMobile || deviceInfo.isAndroid) {
      optionalFeatures.push("depth-sensing");
    }

    // Request AR session with appropriate features
    xrSession = await navigator.xr.requestSession(sessionMode, {
      requiredFeatures: requiredFeatures,
      optionalFeatures: optionalFeatures,
      domOverlay: { root: domElement }
    });
    
    // Set up reference space - use 'local' for better cross-device compatibility
    xrRefSpace = await xrSession.requestReferenceSpace('local');
    
    // Set up hit test source
    const viewerSpace = await xrSession.requestReferenceSpace('viewer');
    xrHitTestSource = await xrSession.requestHitTestSource({ 
      space: viewerSpace,
      offsetRay: deviceInfo.isMobile ? undefined : (typeof XRRay !== 'undefined' ? new XRRay() : undefined) // Optimize for desktop vs mobile
    });
    
    // Configure performance based on device capabilities
    configurePerformanceSettings();
    
    // Set up frame loop
    xrSession.requestAnimationFrame(onXRFrame);
    
    // Reset point cloud
    pointCloud = [];
    scanActive = true;
    
    return { 
      supported: true, 
      session: xrSession,
      deviceInfo: deviceInfo
    };
  } catch (error) {
    console.error('Error initializing AR session:', error);
    return { 
      supported: false, 
      error: error.message,
      fallbackAvailable: checkForFallbackOptions()
    };
  }
}

/**
 * Check for fallback AR options when WebXR is not available
 * @returns {Object} Available fallback options
 */
function checkForFallbackOptions() {
  return {
    arKit: deviceInfo.isIOS && window.webkit?.messageHandlers?.webkit?.postMessage !== undefined,
    arCore: deviceInfo.isAndroid && navigator.userAgent.includes('ARCore'),
    quickLook: deviceInfo.isIOS,
    sceneViewer: deviceInfo.isAndroid
  };
}

/**
 * Configure performance settings based on device capabilities
 */
function configurePerformanceSettings() {
  // Adjust point cloud density based on device performance
  const pointCloudDensity = deviceInfo.isMobile ? 
    (deviceInfo.pixelRatio >= 2 ? 0.05 : 0.03) : // Mobile devices
    0.1; // Desktop
  
  // Set global performance variables
  window.XR_POINT_CLOUD_DENSITY = pointCloudDensity;
  
  // Adjust hit test frequency based on device type
  window.XR_HIT_TEST_FREQUENCY = deviceInfo.isMobile ? 2 : 1; // Every 2 frames on mobile, every frame on desktop
}

/**
 * Process each XR frame to extract room data
 * @param {number} time - The current time
 * @param {XRFrame} frame - The current XR frame
 */
function onXRFrame(time, frame) {
  if (!scanActive) return;
  
  const session = frame.session;
  session.requestAnimationFrame(onXRFrame);
  
  if (!xrRefSpace || !xrHitTestSource) return;
  
  // Get pose and hit test results
  const pose = frame.getViewerPose(xrRefSpace);
  if (pose) {
    // Skip some frames on mobile devices to improve performance
    const frameSkip = window.XR_HIT_TEST_FREQUENCY || 1;
    if (time % frameSkip !== 0 && deviceInfo.isMobile) return;
    
    const hitTestResults = frame.getHitTestResults(xrHitTestSource);
    
    if (hitTestResults.length > 0) {
      const hitPose = hitTestResults[0].getPose(xrRefSpace);
      if (hitPose) {
        // Add point to point cloud with adaptive sampling based on device capability
        const samplingRate = window.XR_POINT_CLOUD_DENSITY || 0.1;
        if (Math.random() < samplingRate) {
          // Add point with device-specific precision
          const precision = deviceInfo.isMobile ? 100 : 1000; // Lower precision on mobile
          pointCloud.push({
            x: Math.round(hitPose.transform.position.x * precision) / precision,
            y: Math.round(hitPose.transform.position.y * precision) / precision,
            z: Math.round(hitPose.transform.position.z * precision) / precision
          });
        }
        
        // Calculate target point count based on device capability
        const targetPointCount = deviceInfo.isMobile ? 500 : 1000;
        
        // Dispatch event with current scan progress
        const scanProgressEvent = new CustomEvent('scanProgress', {
          detail: {
            pointCount: pointCloud.length,
            progress: Math.min(100, Math.floor((pointCloud.length / targetPointCount) * 100)),
            deviceInfo: deviceInfo
          }
        });
        window.dispatchEvent(scanProgressEvent);
      }
    }
  }
}

/**
 * Stop the current scanning session
 */
export function stopScan() {
  scanActive = false;
  if (xrSession) {
    xrSession.end().catch(error => console.error('Error ending XR session:', error));
    xrSession = null;
  }
  xrHitTestSource = null;
  xrRefSpace = null;
}

/**
 * Check if the current device supports AR features
 * @returns {Promise<Object>} Device AR capabilities
 */
export async function checkDeviceCapabilities() {
  const capabilities = {
    webXR: false,
    arKit: false,
    arCore: false,
    quickLook: false,
    sceneViewer: false,
    deviceInfo: { ...deviceInfo }
  };
  
  // Check WebXR support
  if (navigator.xr) {
    capabilities.webXR = await navigator.xr.isSessionSupported('immersive-ar')
      .catch(() => false);
  }
  
  // Check for platform-specific AR capabilities
  capabilities.arKit = deviceInfo.isIOS && window.webkit?.messageHandlers?.webkit?.postMessage !== undefined;
  capabilities.arCore = deviceInfo.isAndroid && navigator.userAgent.includes('ARCore');
  capabilities.quickLook = deviceInfo.isIOS;
  capabilities.sceneViewer = deviceInfo.isAndroid;
  
  return capabilities;
}

/**
 * Get a fallback URL for AR viewing when WebXR is not supported
 * @param {string} modelUrl - URL to the 3D model
 * @param {Object} options - Additional options
 * @returns {string|null} - URL for fallback AR experience or null if not available
 */
export function getARFallbackUrl(modelUrl, options = {}) {
  const { title = 'View in AR', scale = 1.0 } = options;
  
  if (deviceInfo.isIOS) {
    // iOS AR Quick Look
    return `https://apple-cdn.example.com/ar-quicklook?url=${encodeURIComponent(modelUrl)}&title=${encodeURIComponent(title)}`;
  } else if (deviceInfo.isAndroid) {
    // Android Scene Viewer
    return `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_only&title=${encodeURIComponent(title)}&resizable=false&scale=${scale}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
  }
  
  return null;
}

/**
 * Get the dimensions of the room based on the point cloud
 * @returns {Object} - The dimensions of the room
 */
export function getRoomDimensions() {
  if (pointCloud.length < 10) {
    return { width: 0, length: 0, height: 0, units: 'meters' };
  }
  
  // Find min and max values for each dimension
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  
  // Apply outlier filtering for more accurate dimensions
  const filteredPoints = filterOutliers(pointCloud);
  
  filteredPoints.forEach(point => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
    minZ = Math.min(minZ, point.z);
    maxZ = Math.max(maxZ, point.z);
  });
  
  // Calculate dimensions in meters
  const width = Math.abs(maxX - minX);
  const height = Math.abs(maxY - minY);
  const length = Math.abs(maxZ - minZ);
  
  // Determine if we should use imperial units based on locale
  const useImperial = navigator.language === 'en-US' || navigator.language === 'en-GB';
  
  if (useImperial) {
    // Convert to feet (1m = 3.28084ft)
    const conversionFactor = 3.28084;
    return {
      width: parseFloat((width * conversionFactor).toFixed(2)),
      length: parseFloat((length * conversionFactor).toFixed(2)),
      height: parseFloat((height * conversionFactor).toFixed(2)),
      units: 'feet',
      metersWidth: parseFloat(width.toFixed(2)),
      metersLength: parseFloat(length.toFixed(2)),
      metersHeight: parseFloat(height.toFixed(2))
    };
  }
  
  return {
    width: parseFloat(width.toFixed(2)),
    length: parseFloat(length.toFixed(2)),
    height: parseFloat(height.toFixed(2)),
    units: 'meters'
  };
}

/**
 * Filter outliers from point cloud for more accurate measurements
 * @param {Array} points - The point cloud array
 * @returns {Array} - Filtered point cloud
 */
function filterOutliers(points) {
  if (points.length < 20) return points;
  
  // Simple statistical filtering - remove points that are too far from the mean
  const sum = { x: 0, y: 0, z: 0 };
  points.forEach(point => {
    sum.x += point.x;
    sum.y += point.y;
    sum.z += point.z;
  });
  
  const mean = {
    x: sum.x / points.length,
    y: sum.y / points.length,
    z: sum.z / points.length
  };
  
  // Calculate standard deviation
  const variance = { x: 0, y: 0, z: 0 };
  points.forEach(point => {
    variance.x += Math.pow(point.x - mean.x, 2);
    variance.y += Math.pow(point.y - mean.y, 2);
    variance.z += Math.pow(point.z - mean.z, 2);
  });
  
  const stdDev = {
    x: Math.sqrt(variance.x / points.length),
    y: Math.sqrt(variance.y / points.length),
    z: Math.sqrt(variance.z / points.length)
  };
  
  // Filter points that are within 2 standard deviations
  return points.filter(point => {
    return Math.abs(point.x - mean.x) < 2 * stdDev.x &&
           Math.abs(point.y - mean.y) < 2 * stdDev.y &&
           Math.abs(point.z - mean.z) < 2 * stdDev.z;
  });
}

/**
 * Analyze the room style using the CLIP model
 * In a real implementation, this would use the CLIP model to analyze images
 * For this demo, we'll simulate the style analysis
 * @returns {Object} - The detected style information
 */
export function analyzeRoomStyle() {
  // Simulate CLIP model analysis
  // In a real implementation, this would process images from the scan
  // and use the CLIP model to determine the style
  
  // For demo purposes, randomly select a style
  const randomIndex = Math.floor(Math.random() * styleCategories.length);
  const detectedStyle = styleCategories[randomIndex];
  
  // Generate confidence scores (simulated)
  const confidenceScores = {};
  styleCategories.forEach(style => {
    if (style === detectedStyle) {
      confidenceScores[style] = 0.7 + Math.random() * 0.3; // 70-100% confidence for detected style
    } else {
      confidenceScores[style] = Math.random() * 0.7; // 0-70% confidence for other styles
    }
  });
  
  return {
    primaryStyle: detectedStyle,
    confidenceScores: confidenceScores
  };
}

/**
 * Get product recommendations based on room style and dimensions
 * @param {string} style - The detected room style
 * @param {Object} dimensions - The room dimensions
 * @returns {Array} - Array of recommended products
 */
export function getRecommendedProducts(style, dimensions) {
  // Product database (simulated)
  // In a real implementation, this would fetch from an API
  const productsByStyle = {
    'Modern': [
      {
        id: 'm1',
        name: 'Modern Minimalist Desk - White',
        price: 149.99,
        rating: 4.5,
        image: '/api/placeholder/150/150',
        isPrime: true,
        dimensions: { width: 1.2, height: 0.75, depth: 0.6 }
      },
      {
        id: 'm2',
        name: 'Contemporary Office Chair - Black Mesh',
        price: 189.99,
        rating: 4.2,
        image: '/api/placeholder/150/150',
        isPrime: true,
        dimensions: { width: 0.6, height: 1.1, depth: 0.6 }
      },
      {
        id: 'm3',
        name: 'LED Floor Lamp with Remote Control',
        price: 79.99,
        rating: 4.7,
        image: '/api/placeholder/150/150',
        isPrime: true,
        dimensions: { width: 0.3, height: 1.8, depth: 0.3 }
      }
    ],
    'Scandinavian': [
      {
        id: 's1',
        name: 'Light Wood Desk with Storage',
        price: 199.99,
        rating: 4.7,
        image: '/api/placeholder/150/150',
        isPrime: true,
        dimensions: { width: 1.3, height: 0.75, depth: 0.65 }
      },
      {
        id: 's2',
        name: 'White Ergonomic Chair with Wood Legs',
        price: 159.99,
        rating: 4.4,
        image: '/api/placeholder/150/150',
        isPrime: true,
        dimensions: { width: 0.55, height: 0.95, depth: 0.55 }
      },
      {
        id: 's3',
        name: 'Minimalist Pendant Light',
        price: 89.99,
        rating: 4.6,
        image: '/api/placeholder/150/150',
        isPrime: true,
        dimensions: { width: 0.4, height: 0.3, depth: 0.4 }
      }
    ],
    // Add more styles as needed
  };
  
  // Get products for the detected style or use default
  let products = productsByStyle[style] || [];
  
  // If no products for this style, use Modern as fallback
  if (products.length === 0 && style !== 'Modern') {
    products = productsByStyle['Modern'] || [];
  }
  
  // Filter products based on room dimensions
  // For example, don't recommend furniture that's too large for the room
  if (dimensions && dimensions.width > 0) {
    products = products.filter(product => {
      // Only include products that would fit in the room
      // with some margin (80% of room dimension)
      const maxWidth = dimensions.width * 0.8;
      const maxLength = dimensions.length * 0.8;
      
      return (
        product.dimensions.width <= maxWidth &&
        product.dimensions.depth <= maxLength
      );
    });
  }
  
  return products;
}

/**
 * Get a list of all available room styles
 * @returns {Array} - Array of style categories
 */
export function getAvailableStyles() {
  return styleCategories;
}
