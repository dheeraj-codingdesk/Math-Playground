# Interactive Math Playground 🧮

A beautiful web application that makes advanced mathematical concepts accessible through interactive visualizations. Explore calculus, probability distributions, Fourier transforms, and the Central Limit Theorem with stunning, interactive charts and real-time parameter manipulation.

## ✨ Features

### 🔢 Calculus Slopes Visualization
- Interactive function plotting with real-time tangent lines
- Derivative calculation and geometric interpretation
- Support for polynomial, trigonometric, and exponential functions
- Mathematical formula rendering with KaTeX

### 📊 Probability Distributions
- Visualize Normal, Binomial, Poisson, and Exponential distributions
- Interactive parameter adjustment (mean, variance, rate parameters)
- Statistical property calculations and comparisons
- Probability density and cumulative distribution functions

### 🌊 Fourier Transforms
- Signal decomposition into frequency components
- Time domain and frequency domain visualization
- Multiple signal types (square, triangle, sawtooth waves)
- Harmonic analysis with configurable harmonics

### 📈 Central Limit Theorem Simulation
- Population sampling with various distribution types
- Real-time histogram generation of sample means
- Comparison with theoretical normal distribution
- Statistical summary and standard error calculations

## 🚀 Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for mathematical visualizations
- **Math**: Math.js for computations, KaTeX for formula rendering
- **State Management**: Zustand for efficient state handling
- **Animations**: Framer Motion for smooth transitions

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/dheeraj-codingdesk/Math-Playground.git
cd interactive-math-playground

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run check
```

## 🎯 Usage

1. **Start Exploring**: Visit the homepage to see all available visualizations
2. **Choose a Topic**: Select from Calculus, Probability, Fourier, or Central Limit Theorem
3. **Interact**: Use the control panels to adjust parameters in real-time
4. **Learn**: Observe how mathematical concepts change with different inputs
5. **Compare**: Use comparison modes to understand relationships between concepts

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers (4K displays)
- Tablets and iPads
- Mobile phones (320px and up)

## 🎨 Visual Design

- **Modern Interface**: Clean, minimalist design with beautiful gradients
- **Color Schemes**: Professional blues and purples with accent colors
- **Typography**: Clean, readable fonts with proper mathematical notation
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📚 Educational Value

Each visualization is designed to provide:
- **Intuitive Understanding**: Visual representation of abstract concepts
- **Interactive Learning**: Real-time parameter manipulation
- **Mathematical Accuracy**: Precise calculations and proper formulas
- **Educational Context**: Clear explanations and mathematical background
- **Immediate Feedback**: Instant visual response to changes

## 🔧 Customization

### Adding New Visualizations

1. Create a new page component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Create utility functions in `src/utils/`
4. Add state management in `src/store/`
5. Update navigation in `src/components/common/Header.tsx`

### Modifying Parameters

Edit the Zustand stores in `src/store/` to add new parameters or modify existing ones:
- `visualizationStore.ts`: Main visualization parameters
- `settingsStore.ts`: User preferences and settings

## 🧪 Development

### Code Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/         # Shared components
│   ├── math/           # Math-specific components
│   └── visualizations/ # Visualization containers
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

### Key Files
- `src/App.tsx`: Main application component with routing
- `src/pages/Home.tsx`: Landing page with visualization cards
- `src/pages/Calculus.tsx`: Calculus slopes visualization
- `src/pages/Probability.tsx`: Probability distributions
- `src/pages/Fourier.tsx`: Fourier transforms
- `src/pages/CentralLimit.tsx`: Central Limit Theorem simulation

## 🎓 Mathematical Concepts Covered

### Calculus
- Derivatives and tangent lines
- Function analysis
- Geometric interpretation of derivatives

### Probability & Statistics
- Probability distributions
- Parameter effects on distribution shapes
- Statistical properties (mean, variance, standard deviation)

### Signal Processing
- Fourier analysis
- Time and frequency domains
- Harmonic decomposition

### Statistical Theory
- Central Limit Theorem
- Sampling distributions
- Normal approximation

## 🌟 Future Enhancements

- **3D Visualizations**: Advanced 3D mathematical surfaces
- **More Distributions**: Additional probability distributions
- **Linear Algebra**: Matrix operations and transformations
- **Differential Equations**: Solution visualization
- **Collaboration**: Share visualizations with others
- **Mobile App**: Native mobile applications
- **LMS Integration**: Integration with learning management systems

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Recharts**: For beautiful charting capabilities
- **Math.js**: For comprehensive mathematical computations
- **KaTeX**: For fast mathematical formula rendering
- **Tailwind CSS**: For utility-first styling
- **Framer Motion**: For smooth animations

---

**Happy Learning!** 🎉 Explore the beauty of mathematics through interactive visualizations and discover how mathematical concepts come to life.
