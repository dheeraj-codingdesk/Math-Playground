import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ControlPanel, Slider, Select } from '@/components/common/ControlPanel';
import { FormulaDisplay } from '@/components/math/FormulaDisplay';
import { generateSquareWave, generateTriangleWave, generateSawtoothWave, generateSignalWithHarmonics, dft } from '@/utils/math';
import { generateFourierData } from '@/utils/data';
import { useVisualizationStore } from '@/store/visualizationStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Point } from '@/types/math';

const SIGNAL_TYPES = ['square', 'triangle', 'sawtooth', 'custom'] as const;
type SignalType = typeof SIGNAL_TYPES[number];

export const Fourier: React.FC = () => {
  const { signalConfig, setSignalConfig } = useVisualizationStore();
  const { decimalPlaces } = useSettingsStore();
  
  const [signal, setSignal] = useState<number[]>([]);
  const [timeDomainData, setTimeDomainData] = useState<Point[]>([]);
  const [frequencyDomainData, setFrequencyDomainData] = useState<Point[]>([]);
  const [harmonicsData, setHarmonicsData] = useState<any[]>([]);
  const [showHarmonics, setShowHarmonics] = useState(false);
  const [selectedHarmonic, setSelectedHarmonic] = useState(1);

  // Generate signal based on configuration
  useEffect(() => {
    try {
      let newSignal: number[] = [];
      const samples = 1000;
      
      switch (signalConfig.type) {
        case 'square':
          newSignal = generateSquareWave(signalConfig.frequency, signalConfig.amplitude, samples);
          break;
        case 'triangle':
          newSignal = generateTriangleWave(signalConfig.frequency, signalConfig.amplitude, samples);
          break;
        case 'sawtooth':
          newSignal = generateSawtoothWave(signalConfig.frequency, signalConfig.amplitude, samples);
          break;
        case 'custom':
          newSignal = generateSignalWithHarmonics(signalConfig.frequency, signalConfig.harmonics, signalConfig.amplitude, samples);
          break;
      }
      
      setSignal(newSignal);
      
      // Generate time domain data
      const timeData = newSignal.map((value, index) => ({
        x: index / samples,
        y: value
      }));
      setTimeDomainData(timeData);
      
      // Generate frequency domain data using DFT
      const dftResult = dft(newSignal);
      const freqData = dftResult.slice(0, samples / 2).map((complex, index) => ({
        x: (index * samples) / samples, // Frequency in Hz
        y: Math.sqrt(complex.real * complex.real + complex.imag * complex.imag) / samples
      }));
      setFrequencyDomainData(freqData);
      
      // Generate harmonics data
      if (showHarmonics) {
        const harmonics = [];
        for (let h = 1; h <= signalConfig.harmonics; h++) {
          const harmonicSignal = generateSignalWithHarmonics(signalConfig.frequency, h, signalConfig.amplitude, samples);
          const harmonicTimeData = harmonicSignal.map((value, index) => ({
            x: index / samples,
            y: value,
            harmonic: h
          }));
          harmonics.push(...harmonicTimeData);
        }
        setHarmonicsData(harmonics);
      }
    } catch (error) {
      console.error('Error generating signal data:', error);
    }
  }, [signalConfig, showHarmonics]);

  const handleTypeChange = (newType: string) => {
    setSignalConfig({ type: newType as SignalType });
  };

  const handleParameterChange = (param: string, value: number) => {
    setSignalConfig({ [param]: value });
  };

  const handleHarmonicChange = (harmonic: number) => {
    setSelectedHarmonic(harmonic);
  };

  const getSignalFormula = (type: SignalType) => {
    switch (type) {
      case 'square':
        return 'f(t) = A * sign(sin(2πft))';
      case 'triangle':
        return 'f(t) = (2A/π) * arcsin(sin(2πft))';
      case 'sawtooth':
        return 'f(t) = (2A/π) * (πft mod 2π - π)';
      case 'custom':
        return 'f(t) = Σ (A/n) * sin(2πnft)';
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
            Fourier Transform Visualization
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore how signals decompose into frequency components. Understand the relationship between 
            time domain and frequency domain representations of signals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel title="Signal Configuration">
              <Select
                label="Signal Type"
                value={signalConfig.type}
                options={SIGNAL_TYPES.map(t => t.charAt(0).toUpperCase() + t.slice(1))}
                onChange={handleTypeChange}
              />
              
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">Formula:</span>
                <FormulaDisplay formula={getSignalFormula(signalConfig.type)} displayMode="block" />
              </div>
            </ControlPanel>

            <ControlPanel title="Signal Parameters">
              <Slider
                label="Frequency (Hz)"
                value={signalConfig.frequency}
                min={0.1}
                max={10}
                step={0.1}
                onChange={(value) => handleParameterChange('frequency', value)}
              />
              
              <Slider
                label="Amplitude"
                value={signalConfig.amplitude}
                min={0.1}
                max={2}
                step={0.1}
                onChange={(value) => handleParameterChange('amplitude', value)}
              />
              
              <Slider
                label="Harmonics"
                value={signalConfig.harmonics}
                min={1}
                max={20}
                step={1}
                onChange={(value) => handleParameterChange('harmonics', value)}
              />
            </ControlPanel>

            <ControlPanel title="Analysis Options">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showHarmonics}
                  onChange={(e) => setShowHarmonics(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Show Harmonics</span>
              </label>
              
              {showHarmonics && (
                <Slider
                  label="Selected Harmonic"
                  value={selectedHarmonic}
                  min={1}
                  max={signalConfig.harmonics}
                  step={1}
                  onChange={handleHarmonicChange}
                />
              )}
            </ControlPanel>
          </div>

          {/* Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Time Domain */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Time Domain</h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeDomainData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      scale="linear"
                      tickFormatter={(value) => value.toFixed(2)}
                      label={{ value: 'Time (s)', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => value.toFixed(2)}
                      label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatTooltipValue(value), 'Amplitude']}
                      labelFormatter={(value) => `Time: ${formatTooltipValue(value)}s`}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                      name="Signal"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Frequency Domain */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequency Domain (Magnitude Spectrum)</h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={frequencyDomainData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      scale="linear"
                      tickFormatter={(value) => value.toFixed(1)}
                      label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => value.toFixed(3)}
                      label={{ value: 'Magnitude', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatTooltipValue(value), 'Magnitude']}
                      labelFormatter={(value) => `Frequency: ${formatTooltipValue(value)}Hz`}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Magnitude"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Harmonics Analysis */}
            {showHarmonics && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Harmonic Analysis (Harmonic {selectedHarmonic})
                </h3>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={harmonicsData.filter(d => d.harmonic === selectedHarmonic)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="x" 
                        type="number" 
                        scale="linear"
                        tickFormatter={(value) => value.toFixed(2)}
                        label={{ value: 'Time (s)', position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => value.toFixed(2)}
                        label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatTooltipValue(value), 'Amplitude']}
                        labelFormatter={(value) => `Time: ${formatTooltipValue(value)}s`}
                      />
                      
                      <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={false}
                        name={`Harmonic ${selectedHarmonic}`}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};