// frontend/src/App.tsx

import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TradesPage from './pages/TradesPage';
import DonatePage from './pages/DonatePage';
import './App.css'; 

// Utility to create the active navigation link
const NavLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to; 
    
    return (
        <Link 
            to={to}
            className={isActive ? 'active' : ''}
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
                <div>
                    {/* Logo */}
                    <Link to="/">
                        <img src="/images/Logo.png" className="logo" alt="HAVEN SMP Logo" />
                    </Link>

                    {/* Navigation Links */}
                    <div>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/trades">Trades</NavLink>
                        <NavLink to="/donate">Donate</NavLink>
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
                        <div>
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
