/**
 * Type declarations for roomScanner.js
 */

export interface ScannerInitResult {
  supported: boolean;
  error?: string;
  session?: any;
  lidarCapabilities?: any;
}

export interface StyleMatch {
  id: string;
  name: string;
  confidence: number;
  description: string;
  colorPalette: string[];
  imageUrl?: string;
}

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
  area: number;
  volume: number;
}

export const pinterestTrendStyles: Array<{
  id: string;
  name: string;
  description: string;
  colorPalette: string[];
  imageUrl?: string;
}>;

export function initScanner(domElement: HTMLElement): Promise<ScannerInitResult>;
export function calculateStyleMatch(pointCloud: any[]): Promise<StyleMatch>;
export function getRoomDimensions(pointCloud: any[]): RoomDimensions;