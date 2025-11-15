import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FunctionSquare, GitBranch, TrendingUp, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navigation = [
  { name: 'Calculus', href: '/calculus', icon: FunctionSquare },
  { name: 'Probability', href: '/probability', icon: BarChart3 },
  { name: 'Fourier', href: '/fourier', icon: GitBranch },
  { name: 'Central Limit', href: '/central-limit', icon: TrendingUp },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
              Math Playground
            </Link>
          </div>
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-base font-medium transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="ml-10 space-x-4 lg:hidden">
            <button
              type="button"
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden"
            >
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      location.pathname === link.href
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <link.icon className="mr-3 h-5 w-5" />
                      {link.name}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};