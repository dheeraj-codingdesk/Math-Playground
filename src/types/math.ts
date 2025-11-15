// Mathematical types
export interface Point {
  x: number;
  y: number;
}

export interface ComplexNumber {
  real: number;
  imag: number;
}

export interface FunctionRange {
  min: number;
  max: number;
  step: number;
}

export interface MathFunction {
  expression: string;
  evaluate: (x: number) => number;
  derivative?: (x: number) => number;
}

// Visualization types
export interface VisualizationData {
  points: Point[];
  metadata?: Record<string, any>;
}

export interface ChartConfig {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  width: number;
  height: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Control types
export interface ControlConfig {
  type: 'slider' | 'select' | 'checkbox' | 'input';
  label: string;
  key: string;
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

// Component prop types
export interface VisualizationProps {
  title: string;
  description: string;
  controls: ControlConfig[];
  onParameterChange: (params: Record<string, any>) => void;
}

// Distribution types
export interface DistributionParams {
  type: 'normal' | 'binomial' | 'poisson' | 'exponential';
  mean?: number;
  stdDev?: number;
  lambda?: number;
  n?: number;
  p?: number;
}

// Fourier transform types
export interface SignalConfig {
  type: 'square' | 'triangle' | 'sawtooth' | 'custom';
  frequency: number;
  amplitude: number;
  harmonics: number;
}

// Calculus types
export interface CalculusParams {
  function: string;
  point: number;
  range: FunctionRange;
}

// Central limit theorem types
export interface CLTParams {
  populationType: 'uniform' | 'normal' | 'exponential' | 'binomial';
  sampleSize: number;
  numSamples: number;
  populationSize: number;
}