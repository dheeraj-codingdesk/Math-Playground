import { create } from 'zustand';
import { CalculusParams, DistributionParams, SignalConfig, CLTParams } from '@/types/math';

interface VisualizationState {
  // Calculus state
  calculusParams: CalculusParams;
  setCalculusParams: (params: Partial<CalculusParams>) => void;
  
  // Probability distribution state
  distributionParams: DistributionParams;
  setDistributionParams: (params: Partial<DistributionParams>) => void;
  
  // Fourier transform state
  signalConfig: SignalConfig;
  setSignalConfig: (config: Partial<SignalConfig>) => void;
  
  // Central Limit Theorem state
  cltParams: CLTParams;
  setCLTParams: (params: Partial<CLTParams>) => void;
  
  // UI state
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  
  selectedVisualization: string;
  setSelectedVisualization: (viz: string) => void;
}

export const useVisualizationStore = create<VisualizationState>((set) => ({
  // Initial calculus parameters
  calculusParams: {
    function: 'x^2',
    point: 2,
    range: { min: -5, max: 5, step: 0.1 }
  },
  setCalculusParams: (params) => set((state) => ({
    calculusParams: { ...state.calculusParams, ...params }
  })),
  
  // Initial distribution parameters
  distributionParams: {
    type: 'normal',
    mean: 0,
    stdDev: 1
  },
  setDistributionParams: (params) => set((state) => ({
    distributionParams: { ...state.distributionParams, ...params }
  })),
  
  // Initial signal configuration
  signalConfig: {
    type: 'square',
    frequency: 1,
    amplitude: 1,
    harmonics: 5
  },
  setSignalConfig: (config) => set((state) => ({
    signalConfig: { ...state.signalConfig, ...config }
  })),
  
  // Initial CLT parameters
  cltParams: {
    populationType: 'uniform',
    sampleSize: 30,
    numSamples: 1000,
    populationSize: 10000
  },
  setCLTParams: (params) => set((state) => ({
    cltParams: { ...state.cltParams, ...params }
  })),
  
  // UI state
  isAnimating: false,
  setIsAnimating: (animating) => set({ isAnimating: animating }),
  
  selectedVisualization: 'calculus',
  setSelectedVisualization: (viz) => set({ selectedVisualization: viz })
}));