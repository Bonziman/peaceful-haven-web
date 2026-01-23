// frontend/src/App.tsx (Final Structure with Conditional Padding)

import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TradesPage from './pages/TradesPage';
import DonatePage from './pages/DonatePage';
import RulesPage from './pages/RulesPage';
import './App.css'; 

const NavLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to; 
    
    return (
        <Link 
            to={to}
            className={`nav-link ${isActive ? 'active' : ''}`}
        >
            {children}
        </Link>
    );
};

const App: React.FC = () => {
    const location = useLocation();
    // Check for the Home Page route (the only one with a full-screen hero image)
    const isHeroPage = location.pathname === '/'; 
    
    // The height of the header pill + top margin (20px) = 40px + 20px = 60px
    // The average header height is around 80px for standard spacing.
    const HEADER_HEIGHT_PX = 80; 

    // Style for the main content area
    const mainContentStyle: React.CSSProperties = {
        width: '100%',
        boxSizing: 'border-box',
        // CRITICAL FIX: Apply top padding ONLY on non-Hero pages
        paddingTop: isHeroPage ? 0 : HEADER_HEIGHT_PX, 
        // CRITICAL FIX: Apply solid background ONLY on non-Hero pages
        backgroundColor: isHeroPage ? 'transparent' : 'var(--bg-dark)', 
        minHeight: '100vh',
    };

    return (
        <div className="App">
            
            {/* 1. Navigation Header (Positioned Absolute on all pages) */}
            <nav>
                <div className="nav-container">
                    {/* Left: Logo */}
                    <div className="nav-logo-group">
                        <Link to="/" className="logo-link">
                            <img src="/images/Logo.png" className="logo" alt="HAVEN SMP Logo" />
                            {/* Adding a placeholder for text to match the image, as this was missing */}
                           
                        </Link>
                    </div>

                    {/* Right: Pill Container (Links + Button) */}
                    <div className="nav-pill-group"> 
                        {/* Primary Links */}
                        <NavLink to="/">Home</NavLink>
                        {/* <NavLink to="/about">About</NavLink> */}
                        <NavLink to="/trades">Trades</NavLink>
                        <NavLink to="/rules">Rules</NavLink>
                        <NavLink to="/donate">Donate</NavLink>
                        
                        {/* Play Now Button (Accent/Action) */}
                        <Link to="#" className="play-now-btn">
                            Play Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 2. Main Content Layout (Conditional Padding) */}
            <main style={mainContentStyle}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/donate" element={<DonatePage />} />
                    <Route path="/trades" element={<TradesPage />} />
                    <Route path="/rules" element={<RulesPage />} />
                    <Route path="*" element={
                        <div className="error-404">
                            <h1>404 - DATA NOT FOUND</h1>
                            <p>The requested data slice does not exist.</p>
                        </div>
                    } />
                </Routes>
            </main>
        </div>
    );
};

export default App;
