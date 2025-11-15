import { Point, ComplexNumber, FunctionRange } from '@/types/math';

// Mathematical constants
export const MATH_CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
  SQRT2: Math.SQRT2,
  LN2: Math.LN2,
  LN10: Math.LN10
};

// Color palettes for visualizations
export const COLOR_PALETTES = {
  primary: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
  secondary: ['#6366f1', '#a855f7', '#f43f5e', '#f97316', '#14b8a6'],
  gradients: [
    ['#3b82f6', '#8b5cf6'],
    ['#8b5cf6', '#ec4899'],
    ['#ec4899', '#f59e0b'],
    ['#f59e0b', '#10b981'],
    ['#10b981', '#3b82f6']
  ]
};

// Generate range of numbers
export const generateRange = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Linear interpolation
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

// Map value from one range to another
export const mapRange = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  return toMin + ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin);
};

// Format numbers for display
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

// Check if number is valid
export const isValidNumber = (num: any): num is number => {
  return typeof num === 'number' && !isNaN(num) && isFinite(num);
};

// Generate random number in range
export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate random integer in range
export const randomIntInRange = (min: number, max: number): number => {
  return Math.floor(randomInRange(min, max + 1));
};

// Calculate mean of array
export const calculateMean = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

// Calculate standard deviation
export const calculateStdDev = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const mean = calculateMean(arr);
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

// Normalize array to 0-1 range
export const normalizeArray = (arr: number[]): number[] => {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min;
  if (range === 0) return arr.map(() => 0.5);
  return arr.map(val => (val - min) / range);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};