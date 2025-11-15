import React from 'react';
import { motion } from 'framer-motion';

interface ControlPanelProps {
  title: string;
  controls?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ title, controls, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {controls}
        {children}
      </div>
    </motion.div>
  );
};

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  displayValue?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  unit = '',
  displayValue 
}) => {
  const displayValueFn = displayValue || ((val: number) => `${val.toFixed(2)}${unit}`);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{displayValueFn(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
};

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder, type = 'text' }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};

export { FormulaInput, FormulaQuickPick } from '@/components/math/FormulaDisplay';