import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TradesPage from './pages/TradesPage';
import LoginPage from './pages/LoginPage';
import './App.css'; 

// A utility component to highlight the active link
const NavLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    const style: React.CSSProperties = {
        color: isActive ? 'var(--color-accent)' : 'var(--color-text-light)',
        fontWeight: isActive ? 'bold' : 'normal',
        textDecoration: 'none',
        marginRight: '30px',
        padding: '5px 0',
        borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
        transition: 'all 0.2s ease',
    };
    
    const hoverStyle = {
        color: 'var(--color-accent)',
        borderBottomColor: 'var(--color-accent)',
    };

    return (
        <Link 
            to={to} 
            style={style} 
            onMouseOver={e => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseOut={e => Object.assign(e.currentTarget.style, style)}
        >
            {children}
        </Link>
    );
};


const App: React.FC = () => {
    return (
        <div className="App" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
            
            {/* 1. Sleek Navigation Header */}
            <nav style={{ 
                background: '#222', 
                padding: '15px 40px', 
                borderBottom: '2px solid var(--color-primary)', /* Blue accent line */
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    maxWidth: '1400px', /* Optional: Max width for content */
                    margin: '0 auto',
                }}>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                        HAVEN SMP
                    </div>
                    <div>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/trades">Trades</NavLink>

                    </div>
                </div>
            </nav>

            {/* 2. Main Content Layout */}
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/trades" element={<TradesPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}>
                        <h1 style={{color: 'var(--color-accent)'}}>404 - DATA NOT FOUND</h1>
                        <p>The requested data slice does not exist.</p>
                    </div>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
