import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Home } from './pages/Home';
import { Calculus } from './pages/Calculus';
import { Probability } from './pages/Probability';
import { Fourier } from './pages/Fourier';
import { CentralLimit } from './pages/CentralLimit';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculus" element={<Calculus />} />
            <Route path="/probability" element={<Probability />} />
            <Route path="/fourier" element={<Fourier />} />
            <Route path="/central-limit" element={<CentralLimit />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
