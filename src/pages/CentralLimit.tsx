import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine } from 'recharts';
import { ControlPanel, Slider, Select } from '@/components/common/ControlPanel';
import { FormulaDisplay } from '@/components/math/FormulaDisplay';
import { generatePopulation, generateSampleMeans, generateHistogram } from '@/utils/data';
import { calculateMean, calculateStdDev, normalPDF } from '@/utils/math';
import { useVisualizationStore } from '@/store/visualizationStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Point } from '@/types/math';

const POPULATION_TYPES = ['uniform', 'normal', 'exponential', 'binomial'] as const;
type PopulationType = typeof POPULATION_TYPES[number];

export const CentralLimit: React.FC = () => {
  const { cltParams, setCLTParams } = useVisualizationStore();
  const { decimalPlaces } = useSettingsStore();
  
  const [population, setPopulation] = useState<number[]>([]);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [populationHistogram, setPopulationHistogram] = useState<Point[]>([]);
  const [sampleMeansHistogram, setSampleMeansHistogram] = useState<Point[]>([]);
  const [theoreticalNormal, setTheoreticalNormal] = useState<Point[]>([]);
  const [statistics, setStatistics] = useState({
    populationMean: 0,
    populationStdDev: 0,
    sampleMeanMean: 0,
    sampleMeanStdDev: 0,
    theoreticalStdError: 0
  });
  const [isSimulating, setIsSimulating] = useState(false);

  // Generate population and sample means
  useEffect(() => {
    setIsSimulating(true);
    
    try {
      // Generate population
      const newPopulation = generatePopulation(
        cltParams.populationType,
        cltParams.populationSize
      );
      setPopulation(newPopulation);
      
      // Generate sample means
      const newSampleMeans = generateSampleMeans(
        newPopulation,
        cltParams.sampleSize,
        cltParams.numSamples
      );
      setSampleMeans(newSampleMeans);
      
      // Calculate statistics
      const popMean = calculateMean(newPopulation);
      const popStdDev = calculateStdDev(newPopulation);
      const sampleMeanMean = calculateMean(newSampleMeans);
      const sampleMeanStdDev = calculateStdDev(newSampleMeans);
      const theoreticalStdError = popStdDev / Math.sqrt(cltParams.sampleSize);
      
      setStatistics({
        populationMean: popMean,
        populationStdDev: popStdDev,
        sampleMeanMean: sampleMeanMean,
        sampleMeanStdDev: sampleMeanStdDev,
        theoreticalStdError: theoreticalStdError
      });
      
      // Generate histograms
      const popHist = generateHistogram(newPopulation, 30);
      setPopulationHistogram(popHist);
      
      const sampleHist = generateHistogram(newSampleMeans, 30);
      setSampleMeansHistogram(sampleHist);
      
      // Generate theoretical normal distribution for comparison
      const minVal = Math.min(...newSampleMeans);
      const maxVal = Math.max(...newSampleMeans);
      const step = (maxVal - minVal) / 100;
      const theoreticalData: Point[] = [];
      
      for (let x = minVal; x <= maxVal; x += step) {
        const y = normalPDF(x, popMean, theoreticalStdError) * cltParams.numSamples * (maxVal - minVal) / 30;
        theoreticalData.push({ x, y });
      }
      setTheoreticalNormal(theoreticalData);
      
    } catch (error) {
      console.error('Error generating CLT data:', error);
    } finally {
      setIsSimulating(false);
    }
  }, [cltParams]);

  const handlePopulationTypeChange = (newType: string) => {
    setCLTParams({ populationType: newType as PopulationType });
  };

  const handleParameterChange = (param: string, value: number) => {
    setCLTParams({ [param]: value });
  };

  const getPopulationDescription = (type: PopulationType) => {
    switch (type) {
      case 'uniform':
        return 'Uniform distribution: All values equally likely';
      case 'normal':
        return 'Normal distribution: Bell-shaped curve';
      case 'exponential':
        return 'Exponential distribution: Decreasing probability';
      case 'binomial':
        return 'Binomial distribution: Discrete successes';
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
            Central Limit Theorem Simulation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Observe how the distribution of sample means approaches normality regardless of the population distribution. 
            This fundamental theorem demonstrates the power of statistical sampling.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel title="Population Settings">
              <Select
                label="Population Type"
                value={cltParams.populationType}
                options={POPULATION_TYPES.map(t => t.charAt(0).toUpperCase() + t.slice(1))}
                onChange={handlePopulationTypeChange}
              />
              
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">{getPopulationDescription(cltParams.populationType)}</p>
              </div>
            </ControlPanel>

            <ControlPanel title="Sampling Parameters">
              <Slider
                label="Sample Size"
                value={cltParams.sampleSize}
                min={5}
                max={100}
                step={5}
                onChange={(value) => handleParameterChange('sampleSize', value)}
              />
              
              <Slider
                label="Number of Samples"
                value={cltParams.numSamples}
                min={100}
                max={5000}
                step={100}
                onChange={(value) => handleParameterChange('numSamples', value)}
              />
              
              <Slider
                label="Population Size"
                value={cltParams.populationSize}
                min={1000}
                max={20000}
                step={1000}
                onChange={(value) => handleParameterChange('populationSize', value)}
              />
            </ControlPanel>

            <ControlPanel title="Statistical Summary">
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-semibold text-blue-900 mb-2">Population Statistics</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Mean:</span>
                      <span className="font-mono">{statistics.populationMean.toFixed(decimalPlaces)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Std Dev:</span>
                      <span className="font-mono">{statistics.populationStdDev.toFixed(decimalPlaces)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-md">
                  <h4 className="font-semibold text-green-900 mb-2">Sample Means Statistics</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-green-700">Mean:</span>
                      <span className="font-mono">{statistics.sampleMeanMean.toFixed(decimalPlaces)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Std Dev:</span>
                      <span className="font-mono">{statistics.sampleMeanStdDev.toFixed(decimalPlaces)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-md">
                  <h4 className="font-semibold text-purple-900 mb-2">Theoretical Prediction</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Std Error:</span>
                      <span className="font-mono">{statistics.theoreticalStdError.toFixed(decimalPlaces)}</span>
                    </div>
                    <div className="text-xs text-purple-600 mt-2">
                      σ/√n = {statistics.populationStdDev.toFixed(decimalPlaces)}/√{cltParams.sampleSize}
                    </div>
                  </div>
                </div>
              </div>
            </ControlPanel>
          </div>

          {/* Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Population Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Population Distribution ({cltParams.populationType.charAt(0).toUpperCase() + cltParams.populationType.slice(1)})
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={populationHistogram} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      scale="linear"
                      tickFormatter={(value) => value.toFixed(1)}
                      label={{ value: 'Value', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => value.toFixed(0)}
                      label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatTooltipValue(value), 'Count']}
                      labelFormatter={(value) => `Value: ${formatTooltipValue(value)}`}
                    />
                    
                    <Bar 
                      dataKey="y" 
                      fill="#3b82f6" 
                      fillOpacity={0.7}
                      name="Population"
                    />
                    
                    <ReferenceLine 
                      x={statistics.populationMean} 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      label={{ value: "Mean", position: "top" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Sample Means Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Distribution of Sample Means
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sampleMeansHistogram} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      scale="linear"
                      tickFormatter={(value) => value.toFixed(1)}
                      label={{ value: 'Sample Mean', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => value.toFixed(0)}
                      label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatTooltipValue(value), 'Count']}
                      labelFormatter={(value) => `Sample Mean: ${formatTooltipValue(value)}`}
                    />
                    <Legend />
                    
                    <Bar 
                      dataKey="y" 
                      fill="#10b981" 
                      fillOpacity={0.7}
                      name="Sample Means"
                    />
                    
                    <Line 
                      type="monotone" 
                      data={theoreticalNormal}
                      dataKey="y" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={false}
                      name="Theoretical Normal"
                    />
                    
                    <ReferenceLine 
                      x={statistics.sampleMeanMean} 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      label={{ value: "Sample Mean", position: "top" }}
                    />
                    
                    <ReferenceLine 
                      x={statistics.populationMean} 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      strokeDasharray="2 2"
                      label={{ value: "Population Mean", position: "bottom" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  Notice how the distribution of sample means (green bars) approaches a normal distribution 
                  (red line) regardless of the population distribution. The theoretical normal curve is calculated 
                  using the Central Limit Theorem with mean = μ and standard error = σ/√n.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};