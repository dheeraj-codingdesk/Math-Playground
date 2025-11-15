import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ControlPanel, Slider, Input, FormulaInput, FormulaQuickPick } from '@/components/common/ControlPanel';
import { FormulaDisplay } from '@/components/math/FormulaDisplay';
import { parseFunction, generateFunctionPoints, generateTangentLine, calculateDerivative } from '@/utils/math';
import { useVisualizationStore } from '@/store/visualizationStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Point } from '@/types/math';

export const Calculus: React.FC = () => {
  const { calculusParams, setCalculusParams } = useVisualizationStore();
  const { decimalPlaces } = useSettingsStore();
  
  const [functionData, setFunctionData] = useState<Point[]>([]);
  const [tangentData, setTangentData] = useState<Point[]>([]);
  const [derivativeValue, setDerivativeValue] = useState<number>(0);
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [showDerivative, setShowDerivative] = useState<boolean>(true);

  // Parse the mathematical function
  const mathFunction = useMemo(() => {
    return parseFunction(calculusParams.function);
  }, [calculusParams.function]);

  // Generate function and tangent data
  useEffect(() => {
    try {
      const functionPoints = generateFunctionPoints(
        mathFunction.evaluate,
        calculusParams.range
      );
      setFunctionData(functionPoints);

      if (showTangent) {
        const tangentPoints = generateTangentLine(
          mathFunction.evaluate,
          calculusParams.point,
          calculusParams.range
        );
        setTangentData(tangentPoints);
      }

      // Calculate derivative at the current point
      const derivative = calculateDerivative(mathFunction.evaluate, calculusParams.point);
      setDerivativeValue(derivative);
    } catch (error) {
      console.error('Error generating function data:', error);
    }
  }, [mathFunction, calculusParams, showTangent]);

  const handleFunctionChange = (newFunction: string) => {
    setCalculusParams({ function: newFunction });
  };

  const handlePointChange = (newPoint: number) => {
    setCalculusParams({ point: newPoint });
  };

  const handleRangeChange = (min: number, max: number) => {
    setCalculusParams({ range: { min, max, step: calculusParams.range.step } });
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
            Calculus Slopes Visualization
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the geometric interpretation of derivatives by visualizing functions and their tangent lines. 
            Drag the point along the curve to see how the slope changes in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel title="Function Settings">
              <FormulaInput
                value={calculusParams.function}
                onChange={handleFunctionChange}
                placeholder="Enter function (e.g., x^2, sin(x), exp(x))"
              />
              <FormulaQuickPick
                onSelect={handleFunctionChange}
                category="polynomial"
              />
            </ControlPanel>

            <ControlPanel title="Visualization Controls">
              <Slider
                label="Point Position"
                value={calculusParams.point}
                min={calculusParams.range.min}
                max={calculusParams.range.max}
                step={0.1}
                onChange={handlePointChange}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="X Min"
                  type="number"
                  value={calculusParams.range.min.toString()}
                  onChange={(value) => handleRangeChange(parseFloat(value), calculusParams.range.max)}
                />
                <Input
                  label="X Max"
                  type="number"
                  value={calculusParams.range.max.toString()}
                  onChange={(value) => handleRangeChange(calculusParams.range.min, parseFloat(value))}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showTangent}
                    onChange={(e) => setShowTangent(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Tangent Line</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showDerivative}
                    onChange={(e) => setShowDerivative(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Derivative Info</span>
                </label>
              </div>
            </ControlPanel>

            {showDerivative && (
              <ControlPanel title="Mathematical Information">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Function:</span>
                    <FormulaDisplay formula={`f(x) = ${calculusParams.function}`} displayMode="block" />
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">At x = {calculusParams.point.toFixed(decimalPlaces)}:</span>
                    <div className="mt-1 space-y-1">
                      <div className="text-sm text-gray-600">
                        f({calculusParams.point.toFixed(decimalPlaces)}) = {mathFunction.evaluate(calculusParams.point).toFixed(decimalPlaces)}
                      </div>
                      <div className="text-sm text-gray-600">
                        f'({calculusParams.point.toFixed(decimalPlaces)}) = {derivativeValue.toFixed(decimalPlaces)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Tangent Line Equation:</span>
                    <FormulaDisplay 
                      formula={`y = ${derivativeValue.toFixed(decimalPlaces)}(x - ${calculusParams.point.toFixed(decimalPlaces)}) + ${mathFunction.evaluate(calculusParams.point).toFixed(decimalPlaces)}`} 
                      displayMode="block" 
                    />
                  </div>
                </div>
              </ControlPanel>
            )}
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Function and Tangent Line</h3>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={functionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      scale="linear"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <YAxis 
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatTooltipValue(value), 'f(x)']}
                      labelFormatter={(value) => `x: ${formatTooltipValue(value)}`}
                    />
                    
                    {/* Function line */}
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={false}
                      name="Function"
                    />
                    
                    {/* Tangent line */}
                    {showTangent && tangentData.length > 0 && (
                      <Line 
                        type="monotone" 
                        data={tangentData}
                        dataKey="y" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Tangent Line"
                      />
                    )}
                    
                    {/* Current point */}
                    <ReferenceLine 
                      x={calculusParams.point} 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      strokeDasharray="2 2"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Drag the slider to move the point along the function. The red dashed line shows the tangent at the current point.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};