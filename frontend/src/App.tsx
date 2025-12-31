// frontend/src/App.tsx (Replace contents)
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TradesPage from './pages/TradesPage';
import './App.css'; // Assuming you have some basic styling

// A simple placeholder for a future Home Page
const HomePage: React.FC = () => (
    <div style={{ padding: '20px' }}>
        <h1>Welcome to Peaceful Haven!</h1>
        <p>Your journey begins here. Check out the available trades on the server.</p>
        <Link to="/trades" style={{ color: '#4CAF50', textDecoration: 'underline' }}>View Available Trades</Link>
    </div>
);

const App: React.FC = () => {
    return (
        <div className="App">
            {/* Simple Navigation Header */}
            <nav style={{ background: '#222', padding: '10px 20px', borderBottom: '1px solid #444' }}>
                <Link to="/" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Home</Link>
                <Link to="/trades" style={{ color: '#fff', textDecoration: 'none' }}>Trades</Link>
                {/* Future: <Link to="/login">Login with Microsoft</Link> */}
            </nav>

            {/* Define Routes */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/trades" element={<TradesPage />} />
                {/* Add a simple 404 handler */}
                <Route path="*" element={<div style={{padding: '20px'}}>404 - Page Not Found</div>} />
            </Routes>
        </div>
    );
};

export default App;
