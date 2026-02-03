import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TradesPage from './pages/TradesPage';
import AboutPage from './pages/AboutPage';
import RulesPage from './pages/RulesPage';
import DonatePage from './pages/DonatePage';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-brand-black font-sans text-slate-200 selection:bg-brand-blue/30 flex flex-col">
            <Navbar />
            
            <main className="relative flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/trades" element={<TradesPage />} />
                    <Route path="/shop" element={<Navigate to="/trades" replace />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/rules" element={<RulesPage />} />
                    <Route path="/donate" element={<DonatePage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            
            <Footer />
        </div>
    );
};

export default App;
