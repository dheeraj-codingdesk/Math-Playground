import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface FormulaDisplayProps {
  formula: string;
  displayMode?: 'inline' | 'block';
  className?: string;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ 
  formula, 
  displayMode = 'inline', 
  className = '' 
}) => {
  const formulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formulaRef.current) {
      try {
        katex.render(formula, formulaRef.current, {
          displayMode: displayMode === 'block',
          throwOnError: false,
          strict: false
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (formulaRef.current) {
          formulaRef.current.textContent = formula;
        }
      }
    }
  }, [formula, displayMode]);

  return (
    <div 
      ref={formulaRef} 
      className={`katex-display ${className}`}
      style={{ 
        display: displayMode === 'block' ? 'block' : 'inline-block',
        fontSize: displayMode === 'block' ? '1.2em' : '1em'
      }}
    />
  );
};

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  preview?: boolean;
}

export const FormulaInput: React.FC<FormulaInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter formula (e.g., x^2 + 2*x + 1)",
  className = '',
  preview = true
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
      />
      {preview && value && (
        <div className="p-3 bg-gray-50 rounded-md border">
          <FormulaDisplay formula={value} displayMode="block" />
        </div>
      )}
    </div>
  );
};

// Common mathematical formulas for quick reference
export const COMMON_FORMULAS = {
  polynomial: [
    { label: 'Linear', formula: 'a*x + b' },
    { label: 'Quadratic', formula: 'a*x^2 + b*x + c' },
    { label: 'Cubic', formula: 'a*x^3 + b*x^2 + c*x + d' },
    { label: 'Quartic', formula: 'a*x^4 + b*x^3 + c*x^2 + d*x + e' }
  ],
  trigonometric: [
    { label: 'Sine', formula: 'sin(a*x)' },
    { label: 'Cosine', formula: 'cos(a*x)' },
    { label: 'Tangent', formula: 'tan(a*x)' },
    { label: 'Secant', formula: '1/cos(a*x)' }
  ],
  exponential: [
    { label: 'Exponential', formula: 'a*exp(b*x)' },
    { label: 'Natural Log', formula: 'ln(x)' },
    { label: 'Logarithm', formula: 'log(x)' },
    { label: 'Power', formula: 'x^a' }
  ],
  special: [
    { label: 'Gaussian', formula: 'exp(-x^2)' },
    { label: 'Sigmoid', formula: '1/(1 + exp(-x))' },
    { label: 'Absolute', formula: 'abs(x)' },
    { label: 'Square Root', formula: 'sqrt(x)' }
  ]
};

interface FormulaQuickPickProps {
  onSelect: (formula: string) => void;
  category?: string;
}

export const FormulaQuickPick: React.FC<FormulaQuickPickProps> = ({ onSelect, category }) => {
  const categories = category ? { [category]: COMMON_FORMULAS[category as keyof typeof COMMON_FORMULAS] } : COMMON_FORMULAS;
  
  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([catName, formulas]) => (
        <div key={catName}>
          <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">{catName}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {formulas.map(({ label, formula }) => (
              <button
                key={label}
                onClick={() => onSelect(formula)}
                className="flex items-center justify-between p-2 text-left border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">{label}</span>
                <FormulaDisplay formula={formula} displayMode="inline" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};