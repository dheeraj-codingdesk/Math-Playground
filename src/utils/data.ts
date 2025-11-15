import { Point } from '@/types/math';
import { normalPDF, binomialPMF, poissonPMF, exponentialPDF } from './math';

// Generate population data for Central Limit Theorem
export const generatePopulation = (
  type: 'uniform' | 'normal' | 'exponential' | 'binomial',
  size: number = 10000,
  params: Record<string, number> = {}
): number[] => {
  const population: number[] = [];
  
  switch (type) {
    case 'uniform':
      const min = params.min || 0;
      const max = params.max || 100;
      for (let i = 0; i < size; i++) {
        population.push(Math.random() * (max - min) + min);
      }
      break;
      
    case 'normal':
      const mean = params.mean || 50;
      const stdDev = params.stdDev || 15;
      for (let i = 0; i < size; i++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        population.push(mean + stdDev * z0);
      }
      break;
      
    case 'exponential':
      const lambda = params.lambda || 0.1;
      for (let i = 0; i < size; i++) {
        population.push(-Math.log(1 - Math.random()) / lambda);
      }
      break;
      
    case 'binomial':
      const n = params.n || 10;
      const p = params.p || 0.5;
      for (let i = 0; i < size; i++) {
        let successes = 0;
        for (let j = 0; j < n; j++) {
          if (Math.random() < p) successes++;
        }
        population.push(successes);
      }
      break;
  }
  
  return population;
};

// Generate sample means for Central Limit Theorem
export const generateSampleMeans = (
  population: number[],
  sampleSize: number,
  numSamples: number
): number[] => {
  const sampleMeans: number[] = [];
  
  for (let i = 0; i < numSamples; i++) {
    const sample: number[] = [];
    for (let j = 0; j < sampleSize; j++) {
      sample.push(population[Math.floor(Math.random() * population.length)]);
    }
    const mean = sample.reduce((sum, val) => sum + val, 0) / sampleSize;
    sampleMeans.push(mean);
  }
  
  return sampleMeans;
};

// Generate histogram data
export const generateHistogram = (
  data: number[],
  bins: number = 30,
  min?: number,
  max?: number
): Point[] => {
  const actualMin = min !== undefined ? min : Math.min(...data);
  const actualMax = max !== undefined ? max : Math.max(...data);
  const binWidth = (actualMax - actualMin) / bins;
  
  const histogram: number[] = new Array(bins).fill(0);
  
  data.forEach(value => {
    if (value >= actualMin && value <= actualMax) {
      const binIndex = Math.min(Math.floor((value - actualMin) / binWidth), bins - 1);
      histogram[binIndex]++;
    }
  });
  
  const points: Point[] = [];
  for (let i = 0; i < bins; i++) {
    const x = actualMin + i * binWidth + binWidth / 2;
    const y = histogram[i];
    points.push({ x, y });
  }
  
  return points;
};

// Generate distribution data points
export const generateDistributionData = (
  type: 'normal' | 'binomial' | 'poisson' | 'exponential',
  params: Record<string, number>,
  range: { min: number; max: number; step: number }
): Point[] => {
  const points: Point[] = [];
  
  switch (type) {
    case 'normal':
      const mean = params.mean || 0;
      const stdDev = params.stdDev || 1;
      for (let x = range.min; x <= range.max; x += range.step) {
        const y = normalPDF(x, mean, stdDev);
        points.push({ x, y });
      }
      break;
      
    case 'binomial':
      const n = params.n || 10;
      const p = params.p || 0.5;
      for (let k = 0; k <= n; k++) {
        const y = binomialPMF(k, n, p);
        points.push({ x: k, y });
      }
      break;
      
    case 'poisson':
      const lambda = params.lambda || 1;
      const maxK = Math.min(20, Math.ceil(lambda * 3)); // Reasonable upper bound
      for (let k = 0; k <= maxK; k++) {
        const y = poissonPMF(k, lambda);
        points.push({ x: k, y });
      }
      break;
      
    case 'exponential':
      const expLambda = params.lambda || 1;
      for (let x = range.min; x <= range.max; x += range.step) {
        const y = exponentialPDF(x, expLambda);
        points.push({ x, y });
      }
      break;
  }
  
  return points;
};

// Generate probability comparison data
export const generateProbabilityComparison = (
  distributions: Array<{
    type: 'normal' | 'binomial' | 'poisson' | 'exponential';
    params: Record<string, number>;
    color: string;
    name: string;
  }>,
  range: { min: number; max: number; step: number }
): Array<{
  name: string;
  data: Point[];
  color: string;
}> => {
  return distributions.map(dist => ({
    name: dist.name,
    data: generateDistributionData(dist.type, dist.params, range),
    color: dist.color
  }));
};

// Generate Fourier transform visualization data
export const generateFourierData = (
  signal: number[],
  sampleRate: number = 1000
): {
  timeDomain: Point[];
  frequencyDomain: Point[];
  magnitude: Point[];
} => {
  const timeDomain: Point[] = [];
  const frequencyDomain: Point[] = [];
  const magnitude: Point[] = [];
  
  // Time domain
  for (let i = 0; i < signal.length; i++) {
    const t = i / sampleRate;
    timeDomain.push({ x: t, y: signal[i] });
  }
  
  // Frequency domain (simplified - in practice, use proper FFT)
  const frequencies = signal.length / 2;
  for (let i = 0; i < frequencies; i++) {
    const freq = (i * sampleRate) / signal.length;
    const magnitude_val = Math.abs(signal[i] || 0);
    frequencyDomain.push({ x: freq, y: magnitude_val });
    magnitude.push({ x: freq, y: magnitude_val });
  }
  
  return { timeDomain, frequencyDomain, magnitude };
};

// Generate signal with harmonics
export const generateSignalWithHarmonics = (
  baseFrequency: number,
  harmonics: number,
  amplitude: number = 1,
  samples: number = 1000
): number[] => {
  const signal: number[] = new Array(samples).fill(0);
  
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    let value = 0;
    
    // Add fundamental and harmonics
    for (let h = 1; h <= harmonics; h++) {
      const harmonicFreq = baseFrequency * h;
      const harmonicAmp = amplitude / h; // Amplitude decreases with harmonic number
      value += harmonicAmp * Math.sin(2 * Math.PI * harmonicFreq * t);
    }
    
    signal[i] = value;
  }
  
  return signal;
};