// frontend/src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const location = useLocation();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Function to start the Microsoft OAuth flow
    const handleLogin = () => {
        // Redirects the user to the FastAPI endpoint, which starts the Microsoft OAuth chain
        window.location.href = 'https://api.peacefulhaven.lol/auth/login';
    };

    // Handler for errors returned after the callback redirect
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get('error');

        if (error) {
            let message = "Login Failed. Please try again.";
            
            switch (error) {
                case 'auth_failed':
                case 'api_fail':
                    message = "Microsoft API chain failed. (e.g., Token exchange failed or network error)";
                    break;
                case 'banned':
                    message = "Login blocked. Your account is banned from the server.";
                    break;
                case 'not_logged_in':
                    message = "Login blocked. You must log into the Minecraft server at least once.";
                    break;
                default:
                    message = `Login failed: ${error}.`;
            }
            setStatusMessage(message);
        }
    }, [location.search]);

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Peaceful Haven Login</h2>
            
            {statusMessage && (
                <div style={{ color: 'red', margin: '20px 0', border: '1px solid red', padding: '10px' }}>
                    {statusMessage}
                </div>
            )}

            <p>
                Sign in with your Minecraft-linked Microsoft Account to access player stats and shop management tools.
            </p>

            <button
                onClick={handleLogin}
                style={{
                    padding: '10px 20px',
                    fontSize: '18px',
                    backgroundColor: '#107c10', // Microsoft/Xbox green
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px',
                }}
            >
                Sign in with Microsoft
            </button>
            
            <p style={{ marginTop: '20px' }}>
                <Link to="/" style={{ color: '#4CAF50' }}>Back to Home</Link>
            </p>
        </div>
    );
};

export default LoginPage;
