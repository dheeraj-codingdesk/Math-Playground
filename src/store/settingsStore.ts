import { create } from 'zustand';

interface SettingsState {
  // Theme settings
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Animation settings
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  
  // Math settings
  decimalPlaces: number;
  setDecimalPlaces: (places: number) => void;
  
  // Chart settings
  chartQuality: 'low' | 'medium' | 'high';
  setChartQuality: (quality: 'low' | 'medium' | 'high') => void;
  
  // Performance settings
  maxDataPoints: number;
  setMaxDataPoints: (points: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  
  animationsEnabled: true,
  setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
  
  decimalPlaces: 3,
  setDecimalPlaces: (places) => set({ decimalPlaces: Math.max(0, Math.min(10, places)) }),
  
  chartQuality: 'medium',
  setChartQuality: (quality) => set({ chartQuality: quality }),
  
  maxDataPoints: 1000,
  setMaxDataPoints: (points) => set({ maxDataPoints: Math.max(100, Math.min(10000, points)) })
}));