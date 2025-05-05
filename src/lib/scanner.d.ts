/**
 * Type declarations for scanner.js
 */

export interface DeviceCapabilities {
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

export interface ScannerInitResult {
  supported: boolean;
  error?: string;
  session?: any;
  fallbackAvailable?: boolean;
}

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
  area: number;
  volume: number;
}

export interface StyleAnalysisResult {
  id: string;
  name: string;
  confidence: number;
  description: string;
  colorPalette: string[];
}

export function initRoomScanner(domElement: HTMLElement): Promise<ScannerInitResult>;
export function stopScan(): void;
export function getRoomDimensions(): RoomDimensions;
export function analyzeRoomStyle(): Promise<StyleAnalysisResult>;
export function getRecommendedProducts(styleId: string): any[];
export function checkDeviceCapabilities(): Promise<DeviceCapabilities>;
export function getARFallbackUrl(modelUrl: string, options?: {title?: string}): string;