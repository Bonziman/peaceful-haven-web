// frontend/src/App.tsx (FINAL LAYOUT FIX)

import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TradesPage from './pages/TradesPage';

import DonatePage from './pages/DonatePage';

import './App.css'; 

// Utility to create the active navigation link style
const NavLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to; 
    
    const baseStyle: React.CSSProperties = {
        color: isActive ? '#f97316' : '#ffffff',
        fontWeight: '600',
        textDecoration: 'none',
        padding: '8px 0',
        borderBottom: isActive ? '2px solid #f97316' : '2px solid transparent',
        transition: 'all 0.3s ease',
        letterSpacing: '0.5px',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
    };

    const hoverStyle = {
        color: '#f97316',
        borderBottomColor: '#f97316',
    };

    return (
        <Link 
            to={to} 
            style={baseStyle}
            onMouseOver={e => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseOut={e => Object.assign(e.currentTarget.style, baseStyle)}
        >
            {children}
        </Link>
    );
};


const App: React.FC = () => {
    return (
        <div className="App" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
            
            {/* Minimalist Navigation Header */}
            <nav style={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                width: '100%',
                boxSizing: 'border-box',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                transition: 'all 0.3s ease'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '20px 40px', 
                    maxWidth: '1600px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {/* Logo */}
                    <Link
                        to="/"
                        style={{
                            fontSize: '1.2rem',
                            fontWeight: '900',
                            color: '#ffffff',
                            letterSpacing: '1.5px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.opacity = '1';
                        }}
                    >
                        <span style={{fontSize: '1.4rem'}}>🏰</span>
                        HAVEN SMP
                    </Link>

                    {/* Navigation Links */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '50px',
                        alignItems: 'center'
                    }}>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/trades">Trades</NavLink>
                        <NavLink to="/donate">Donate</NavLink>
                        
                    </div>
                </div>
            </nav>

            {/* Main Content Layout */}
            <main style={{ width: '100%', boxSizing: 'border-box' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/donate" element={<DonatePage />} />
                    <Route path="/trades" element={<TradesPage />} />
                    
                    
                    <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}>
                        <h1 style={{color: 'var(--color-accent)'}}>404 - DATA NOT FOUND</h1>
                        <p style={{color: 'var(--color-text-subtle)'}}>The requested data slice does not exist.</p>
                    </div>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
