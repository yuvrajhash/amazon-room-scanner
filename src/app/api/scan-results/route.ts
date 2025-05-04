/**
 * Mock CLIP API Response Route
 * 
 * This API route provides mock responses that simulate AI analysis of room dimensions and style
 * using CLIP (Contrastive Language-Image Pre-training) technology.
 */

import { NextResponse } from 'next/server';

// Mock room styles with detailed analysis
const roomStyles = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines and uncluttered space with a focus on functionality.',
    dominantColor: '#F5F5F5',
    accentColor: '#212121',
    confidence: 0.87,
    matchedFeatures: ['clean lines', 'neutral palette', 'uncluttered space', 'functional layout'],
    recommendedProducts: [101, 203, 305, 412],
    ecoScore: 85
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Light, airy spaces with natural materials and simple forms.',
    dominantColor: '#FFFFFF',
    accentColor: '#E0E0E0',
    confidence: 0.92,
    matchedFeatures: ['light wood', 'white walls', 'natural light', 'cozy textiles'],
    recommendedProducts: [105, 218, 342, 429],
    ecoScore: 92
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Raw, unfinished elements with metal accents and exposed architecture.',
    dominantColor: '#616161',
    accentColor: '#8D6E63',
    confidence: 0.78,
    matchedFeatures: ['exposed brick', 'metal fixtures', 'concrete surfaces', 'open ceiling'],
    recommendedProducts: [118, 227, 336, 445],
    ecoScore: 78
  },
  {
    id: 'mid-century',
    name: 'Mid-Century Modern',
    description: 'Retro-inspired design with organic forms and bold colors.',
    dominantColor: '#FFECB3',
    accentColor: '#FF6F00',
    confidence: 0.83,
    matchedFeatures: ['tapered legs', 'organic shapes', 'bold accent colors', 'functional design'],
    recommendedProducts: [124, 236, 348, 457],
    ecoScore: 80
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic mix of patterns, textures, and global influences.',
    dominantColor: '#EFEBE9',
    accentColor: '#6D4C41',
    confidence: 0.75,
    matchedFeatures: ['layered textiles', 'mixed patterns', 'plants', 'global artifacts'],
    recommendedProducts: [132, 245, 359, 468],
    ecoScore: 88
  }
];

// Mock room dimensions with detailed analysis
const roomDimensions = [
  {
    width: 4.2,
    length: 5.1,
    height: 2.8,
    area: 21.42,
    volume: 59.98,
    corners: 4,
    windows: 2,
    doors: 1,
    wallSpace: 18.6,
    floorSpace: 21.42,
    lightingConditions: 'bright',
    naturalLight: 'high'
  },
  {
    width: 3.8,
    length: 4.5,
    height: 2.7,
    area: 17.1,
    volume: 46.17,
    corners: 4,
    windows: 1,
    doors: 1,
    wallSpace: 16.2,
    floorSpace: 17.1,
    lightingConditions: 'moderate',
    naturalLight: 'medium'
  },
  {
    width: 5.2,
    length: 6.3,
    height: 3.0,
    area: 32.76,
    volume: 98.28,
    corners: 6,
    windows: 3,
    doors: 2,
    wallSpace: 24.5,
    floorSpace: 32.76,
    lightingConditions: 'very bright',
    naturalLight: 'high'
  }
];

// Mock furniture recommendations with sustainability data
const recommendedFurniture = [
  {
    id: 101,
    name: 'Minimalist Coffee Table',
    price: 149.99,
    rating: 4.7,
    image: '/images/andrew-sharp-J90zM9OtBXY-unsplash.jpg',
    dimensions: { width: 120, height: 45, depth: 60 },
    material: 'Sustainable bamboo',
    ecoScore: 92,
    co2Savings: '18kg CO2 vs. average',
    sustainabilityFeatures: ['Renewable materials', 'Low-VOC finishes', 'Carbon-neutral shipping']
  },
  {
    id: 203,
    name: 'Scandinavian Bookshelf',
    price: 229.99,
    rating: 4.5,
    image: '/images/phillip-goldsberry-fZuleEfeA1Q-unsplash.jpg',
    dimensions: { width: 80, height: 180, depth: 30 },
    material: 'FSC-certified oak',
    ecoScore: 88,
    co2Savings: '15kg CO2 vs. average',
    sustainabilityFeatures: ['Sustainably harvested wood', 'Water-based finishes', 'Plastic-free packaging']
  },
  {
    id: 305,
    name: 'Industrial Desk Lamp',
    price: 79.99,
    rating: 4.8,
    image: '/images/jon-tyson-py9sH2rThWs-unsplash.jpg',
    dimensions: { width: 15, height: 45, depth: 15 },
    material: 'Recycled aluminum',
    ecoScore: 95,
    co2Savings: '5kg CO2 vs. average',
    sustainabilityFeatures: ['Energy-efficient LED', 'Recycled materials', 'Repairable design']
  }
];

export async function GET() {
  // Randomly select a style and dimensions to simulate scanning results
  const randomStyle = roomStyles[Math.floor(Math.random() * roomStyles.length)];
  const randomDimensions = roomDimensions[Math.floor(Math.random() * roomDimensions.length)];
  
  // Create a complete response with all the mock data
  const mockResponse = {
    scanId: `scan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    roomStyle: randomStyle,
    roomDimensions: randomDimensions,
    recommendations: recommendedFurniture,
    analysisMetrics: {
      processingTime: '1.2 seconds',
      confidenceScore: randomStyle.confidence,
      pointCloudDensity: '4,328 points',
      algorithmVersion: 'CLIP-Room-1.2.0'
    }
  };
  
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return NextResponse.json(mockResponse);
}