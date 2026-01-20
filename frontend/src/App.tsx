// frontend/src/App.tsx (Structural Fix for Navbar)

import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TradesPage from './pages/TradesPage';
import DonatePage from './pages/DonatePage';
import './App.css'; 

const NavLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to; 
    
    return (
        // Apply class names for CSS styling
        <Link 
            to={to}
            className={`nav-link ${isActive ? 'active' : ''}`}
        >
            {children}
        </Link>
    );
};

const App: React.FC = () => {
    return (
        <div className="App">
            
            {/* Navigation Header */}
            <nav>
                <div className="nav-container">
                    {/* Left: Logo */}
                    <div className="nav-logo-group">
                        <Link to="/" className="logo-link">
                            <img src="/images/Logo.png" className="logo" alt="HAVEN SMP Logo" />
                        </Link>
                    </div>

                    {/* Right: Navigation Links and Play Now Button */}
                    <div className="nav-links-group">
                        {/* Primary Links */}
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/about">About</NavLink>
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

            {/* Main Content Layout */}
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/donate" element={<DonatePage />} />
                    <Route path="/trades" element={<TradesPage />} />
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
