import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FunctionSquare, BarChart3, GitBranch, TrendingUp, ArrowRight, Calculator, Brain, Zap } from 'lucide-react';

const visualizations = [
  {
    title: 'Calculus Slopes',
    description: 'Explore derivatives and tangent lines with interactive function visualization. Understand the geometric meaning of derivatives.',
    icon: FunctionSquare,
    href: '/calculus',
    color: 'from-blue-500 to-cyan-500',
    features: ['Interactive tangent lines', 'Real-time derivative calculation', 'Multiple function types'],
    difficulty: 'Intermediate',
    time: '5-10 min'
  },
  {
    title: 'Probability Distributions',
    description: 'Visualize different probability distributions and understand their properties through parameter manipulation.',
    icon: BarChart3,
    href: '/probability',
    color: 'from-green-500 to-emerald-500',
    features: ['Normal, Binomial, Poisson', 'Interactive parameters', 'Probability calculations'],
    difficulty: 'Beginner',
    time: '10-15 min'
  },
  {
    title: 'Fourier Transforms',
    description: 'Decompose signals into frequency components and understand the relationship between time and frequency domains.',
    icon: GitBranch,
    href: '/fourier',
    color: 'from-purple-500 to-pink-500',
    features: ['Signal decomposition', 'Harmonic analysis', 'Frequency spectrum'],
    difficulty: 'Advanced',
    time: '15-20 min'
  },
  {
    title: 'Central Limit Theorem',
    description: 'Simulate sampling distributions and observe how sample means approach normality regardless of population distribution.',
    icon: TrendingUp,
    href: '/central-limit',
    color: 'from-orange-500 to-red-500',
    features: ['Population sampling', 'Distribution convergence', 'Sample size effects'],
    difficulty: 'Intermediate',
    time: '10-15 min'
  }
];

const learningBenefits = [
  {
    icon: Calculator,
    title: 'Interactive Learning',
    description: 'Manipulate parameters in real-time and see immediate mathematical results'
  },
  {
    icon: Brain,
    title: 'Visual Understanding',
    description: 'Complex mathematical concepts become intuitive through beautiful visualizations'
  },
  {
    icon: Zap,
    title: 'Immediate Feedback',
    description: 'Get instant visual feedback as you explore mathematical relationships'
  }
];

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Interactive{' '}
              <span className="text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Math Playground
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore beautiful mathematical visualizations and gain intuitive understanding of 
              complex concepts through interactive experiences. From calculus to probability, 
              discover the beauty of mathematics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/calculus"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#visualizations"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                View All Visualizations
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Learning Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learn Mathematics Visually
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform abstract mathematical concepts into intuitive visual experiences 
              that make learning engaging and memorable.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div id="visualizations" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Interactive Visualizations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of mathematical visualizations, each designed to 
              illuminate different aspects of mathematical theory and application.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visualizations.map((viz, index) => (
              <motion.div
                key={viz.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${viz.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative p-6">
                  <div className="flex items-center mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${viz.color} flex items-center justify-center text-white`}>
                      <viz.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                        {viz.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{viz.difficulty}</span>
                        <span className="mx-2">•</span>
                        <span>{viz.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {viz.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {viz.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    to={viz.href}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 group-hover:shadow-md"
                  >
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Explore Mathematics?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Start with any visualization and discover the beauty of mathematical concepts 
              through interactive exploration.
            </p>
            <Link
              to="/calculus"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Begin Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};