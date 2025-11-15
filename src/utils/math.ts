import { Point, ComplexNumber, MathFunction } from '@/types/math';
import { derivative, compile } from 'mathjs';

// Export statistical functions from constants.ts
export { calculateMean, calculateStdDev } from '@/utils/constants';

// Parse and evaluate mathematical expression
export const parseFunction = (expression: string): MathFunction => {
  try {
    const normalized = expression
      .replace(/\bln\(/g, 'log(')
      .replace(/\blog\(/g, 'log10(');

    const node = compile(normalized);

    const evaluate = (x: number): number => {
      try {
        return node.evaluate({ x, a: 1, b: 0, c: 0, d: 0, e: 0 });
      } catch (error) {
        console.error('Function evaluation error:', error);
        return NaN;
      }
    };

    return {
      expression,
      evaluate
    };
  } catch (error) {
    console.error('Function parsing error:', error);
    return {
      expression: 'x',
      evaluate: (x: number) => x
    };
  }
};

// Calculate numerical derivative
export const calculateDerivative = (f: (x: number) => number, x: number, h: number = 1e-8): number => {
  return (f(x + h) - f(x - h)) / (2 * h); // Central difference method
};

// Generate function points for plotting
export const generateFunctionPoints = (
  f: (x: number) => number,
  range: { min: number; max: number; step: number }
): Point[] => {
  const points: Point[] = [];
  for (let x = range.min; x <= range.max; x += range.step) {
    try {
      const y = f(x);
      if (isFinite(y) && !isNaN(y)) {
        points.push({ x, y });
      }
    } catch (error) {
      // Skip invalid points
      continue;
    }
  }
  return points;
};

// Generate tangent line points
export const generateTangentLine = (
  f: (x: number) => number,
  x0: number,
  range: { min: number; max: number; step: number }
): Point[] => {
  const slope = calculateDerivative(f, x0);
  const y0 = f(x0);
  const points: Point[] = [];
  
  for (let x = range.min; x <= range.max; x += range.step) {
    const y = y0 + slope * (x - x0);
    if (isFinite(y) && !isNaN(y)) {
      points.push({ x, y });
    }
  }
  
  return points;
};

// Probability distribution functions
export const normalPDF = (x: number, mean: number = 0, stdDev: number = 1): number => {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return coefficient * Math.exp(exponent);
};

export const normalCDF = (x: number, mean: number = 0, stdDev: number = 1): number => {
  const z = (x - mean) / stdDev;
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
};

// Error function approximation
export const erf = (x: number): number => {
  // Abramowitz and Stegun approximation
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
};

export const binomialPMF = (k: number, n: number, p: number): number => {
  const binomialCoefficient = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result = result * (n - i + 1) / i;
    }
    return result;
  };

  return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

export const poissonPMF = (k: number, lambda: number): number => {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

export const exponentialPDF = (x: number, lambda: number): number => {
  if (x < 0) return 0;
  return lambda * Math.exp(-lambda * x);
};

// Factorial function
export const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Fourier Transform functions
export const dft = (signal: number[]): ComplexNumber[] => {
  const N = signal.length;
  const result: ComplexNumber[] = [];
  
  for (let k = 0; k < N; k++) {
    let real = 0;
    let imag = 0;
    
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      real += signal[n] * Math.cos(angle);
      imag -= signal[n] * Math.sin(angle);
    }
    
    result.push({ real, imag });
  }
  
  return result;
};

// Generate signal functions
export const generateSquareWave = (frequency: number, amplitude: number = 1, samples: number = 1000): number[] => {
  const signal: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    const value = Math.sin(2 * Math.PI * frequency * t);
    signal.push(value > 0 ? amplitude : -amplitude);
  }
  return signal;
};

export const generateTriangleWave = (frequency: number, amplitude: number = 1, samples: number = 1000): number[] => {
  const signal: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    const period = 1 / frequency;
    const phase = (t % period) / period;
    const value = phase < 0.5 ? 4 * amplitude * phase - amplitude : 4 * amplitude * (1 - phase) - amplitude;
    signal.push(value);
  }
  return signal;
};

export const generateSawtoothWave = (frequency: number, amplitude: number = 1, samples: number = 1000): number[] => {
  const signal: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    const period = 1 / frequency;
    const phase = (t % period) / period;
    const value = 2 * amplitude * phase - amplitude;
    signal.push(value);
  }
  return signal;
};

// Generate signal with harmonics
export const generateSignalWithHarmonics = (baseFrequency: number, harmonics: number, amplitude: number = 1, samples: number = 1000): number[] => {
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