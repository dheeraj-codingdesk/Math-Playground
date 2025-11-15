import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { ControlPanel, Slider, Select } from '@/components/common/ControlPanel';
import { FormulaDisplay } from '@/components/math/FormulaDisplay';
import { generateDistributionData } from '@/utils/data';
import { normalPDF, normalCDF } from '@/utils/math';
import { useVisualizationStore } from '@/store/visualizationStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Point } from '@/types/math';

const DISTRIBUTION_TYPES = ['normal', 'binomial', 'poisson', 'exponential'] as const;

type DistributionType = typeof DISTRIBUTION_TYPES[number];

export const Probability: React.FC = () => {
  const { distributionParams, setDistributionParams } = useVisualizationStore();
  const { decimalPlaces } = useSettingsStore();
  
  const [distributionData, setDistributionData] = useState<Point[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [probabilityInfo, setProbabilityInfo] = useState({
    mean: 0,
    variance: 0,
    stdDev: 0,
    skewness: 0,
    kurtosis: 0
  });
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonType, setComparisonType] = useState<DistributionType>('normal');
  
  const handleComparisonTypeChange = (value: string) => {
    setComparisonType(value as DistributionType);
  };

  // Generate distribution data
  useEffect(() => {
    try {
      const params = getDistributionParams(distributionParams.type);
      const range = getDistributionRange(distributionParams.type, params);
      
      const data = generateDistributionData(distributionParams.type, params, range);
      setDistributionData(data);
      
      // Calculate statistical properties
      const stats = calculateDistributionStats(data, distributionParams.type, params);
      setProbabilityInfo(stats);
      
      // Generate comparison data if enabled
      if (showComparison) {
        const comparisonParams = getDistributionParams(comparisonType);
        const comparisonRange = getDistributionRange(comparisonType, comparisonParams);
        const comparisonData = generateDistributionData(comparisonType, comparisonParams, comparisonRange);
        
        // Merge data for comparison chart
        const mergedData = mergeDistributionData(data, comparisonData, distributionParams.type, comparisonType);
        setComparisonData(mergedData);
      }
    } catch (error) {
      console.error('Error generating distribution data:', error);
    }
  }, [distributionParams, showComparison, comparisonType]);

  const getDistributionParams = (type: DistributionType) => {
    switch (type) {
      case 'normal':
        return {
          mean: distributionParams.mean || 0,
          stdDev: distributionParams.stdDev || 1
        };
      case 'binomial':
        return {
          n: distributionParams.n || 10,
          p: distributionParams.p || 0.5
        };
      case 'poisson':
        return {
          lambda: distributionParams.lambda || 1
        };
      case 'exponential':
        return {
          lambda: distributionParams.lambda || 1
        };
      default:
        return {};
    }
  };

  const getDistributionRange = (type: DistributionType, params: any) => {
    switch (type) {
      case 'normal':
        const mean = params.mean || 0;
        const stdDev = params.stdDev || 1;
        return {
          min: mean - 4 * stdDev,
          max: mean + 4 * stdDev,
          step: stdDev / 10
        };
      case 'binomial':
        const n = params.n || 10;
        return {
          min: 0,
          max: n,
          step: 1
        };
      case 'poisson':
        const lambda = params.lambda || 1;
        return {
          min: 0,
          max: Math.ceil(lambda * 3),
          step: 1
        };
      case 'exponential':
        const expLambda = params.lambda || 1;
        return {
          min: 0,
          max: 5 / expLambda,
          step: 0.1
        };
      default:
        return { min: -5, max: 5, step: 0.1 };
    }
  };

  const calculateDistributionStats = (data: Point[], type: DistributionType, params: any) => {
    const values = data.map(d => d.y);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      mean,
      variance,
      stdDev,
      skewness: 0, // Simplified calculation
      kurtosis: 0  // Simplified calculation
    };
  };

  const mergeDistributionData = (data1: Point[], data2: Point[], type1: DistributionType, type2: DistributionType) => {
    // Simple merging strategy - interpolate to common x values
    const allX = [...new Set([...data1.map(d => d.x), ...data2.map(d => d.x)])].sort((a, b) => a - b);
    
    return allX.map(x => {
      const point1 = data1.find(d => Math.abs(d.x - x) < 0.001);
      const point2 = data2.find(d => Math.abs(d.x - x) < 0.001);
      
      return {
        x,
        [type1]: point1?.y || 0,
        [type2]: point2?.y || 0
      };
    });
  };

  const handleTypeChange = (newType: string) => {
    setDistributionParams({ type: newType as DistributionType });
  };

  const handleParameterChange = (param: string, value: number) => {
    setDistributionParams({ [param]: value });
  };

  const getDistributionFormula = (type: DistributionType) => {
    switch (type) {
      case 'normal':
        return 'f(x) = (1/(σ√(2π))) * e^(-(x-μ)²/(2σ²))';
      case 'binomial':
        return 'P(X=k) = C(n,k) * p^k * (1-p)^(n-k)';
      case 'poisson':
        return 'P(X=k) = (λ^k * e^(-λ)) / k!';
      case 'exponential':
        return 'f(x) = λe^(-λx) for x ≥ 0';
      default:
        return '';
    }
  };

  const formatTooltipValue = (value: number) => {
    return value.toFixed(decimalPlaces);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Probability Distributions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore different probability distributions and understand their properties through interactive parameter manipulation. 
            Compare distributions and visualize their shapes and characteristics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel title="Distribution Type">
              <Select
                label="Distribution"
                value={distributionParams.type}
                options={DISTRIBUTION_TYPES.map(t => t.charAt(0).toUpperCase() + t.slice(1))}
                onChange={handleTypeChange}
              />
              
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">Formula:</span>
                <FormulaDisplay formula={getDistributionFormula(distributionParams.type)} displayMode="block" />
              </div>
            </ControlPanel>

            <ControlPanel title="Parameters">
              {distributionParams.type === 'normal' && (
                <>
                  <Slider
                    label="Mean (μ)"
                    value={distributionParams.mean || 0}
                    min={-10}
                    max={10}
                    step={0.1}
                    onChange={(value) => handleParameterChange('mean', value)}
                  />
                  <Slider
                    label="Standard Deviation (σ)"
                    value={distributionParams.stdDev || 1}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onChange={(value) => handleParameterChange('stdDev', value)}
                  />
                </>
              )}
              
              {distributionParams.type === 'binomial' && (
                <>
                  <Slider
                    label="Number of Trials (n)"
                    value={distributionParams.n || 10}
                    min={1}
                    max={50}
                    step={1}
                    onChange={(value) => handleParameterChange('n', value)}
                  />
                  <Slider
                    label="Probability of Success (p)"
                    value={distributionParams.p || 0.5}
                    min={0.01}
                    max={0.99}
                    step={0.01}
                    onChange={(value) => handleParameterChange('p', value)}
                  />
                </>
              )}
              
              {(distributionParams.type === 'poisson' || distributionParams.type === 'exponential') && (
                <Slider
                  label="Rate Parameter (λ)"
                  value={distributionParams.lambda || 1}
                  min={0.1}
                  max={10}
                  step={0.1}
                  onChange={(value) => handleParameterChange('lambda', value)}
                />
              )}
            </ControlPanel>

            <ControlPanel title="Statistical Properties">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mean:</span>
                  <span className="font-mono">{probabilityInfo.mean.toFixed(decimalPlaces)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Variance:</span>
                  <span className="font-mono">{probabilityInfo.variance.toFixed(decimalPlaces)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Std Dev:</span>
                  <span className="font-mono">{probabilityInfo.stdDev.toFixed(decimalPlaces)}</span>
                </div>
              </div>
            </ControlPanel>

            <ControlPanel title="Comparison">
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showComparison}
                    onChange={(e) => setShowComparison(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Compare Distributions</span>
                </label>
                
                {showComparison && (
                  <Select
                    label="Compare with"
                    value={comparisonType}
                    options={DISTRIBUTION_TYPES.filter(t => t !== distributionParams.type).map(t => t.charAt(0).toUpperCase() + t.slice(1))}
                    onChange={handleComparisonTypeChange}
                  />
                )}
              </div>
            </ControlPanel>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {distributionParams.type.charAt(0).toUpperCase() + distributionParams.type.slice(1)} Distribution
              </h3>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {showComparison ? (
                    <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="x" 
                        type="number" 
                        scale="linear"
                        tickFormatter={(value) => value.toFixed(1)}
                      />
                      <YAxis 
                        tickFormatter={(value) => value.toFixed(3)}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [formatTooltipValue(value), name]}
                        labelFormatter={(value) => `x: ${formatTooltipValue(value)}`}
                      />
                      <Legend />
                      
                      <Line 
                        type="monotone" 
                        dataKey={distributionParams.type} 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={false}
                        name={distributionParams.type.charAt(0).toUpperCase() + distributionParams.type.slice(1)}
                      />
                      
                      <Line 
                        type="monotone" 
                        dataKey={comparisonType} 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={false}
                        name={comparisonType.charAt(0).toUpperCase() + comparisonType.slice(1)}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="x" 
                        type="number" 
                        scale="linear"
                        tickFormatter={(value) => value.toFixed(1)}
                      />
                      <YAxis 
                        tickFormatter={(value) => value.toFixed(3)}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatTooltipValue(value), 'Probability']}
                        labelFormatter={(value) => `x: ${formatTooltipValue(value)}`}
                      />
                      
                      <Area 
                        type="monotone" 
                        dataKey="y" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fill="url(#colorGradient)"
                        fillOpacity={0.3}
                      />
                      
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};