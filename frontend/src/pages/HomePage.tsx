// frontend/src/pages/HomePage.tsx
import React from 'react';
import ServerAddressCard from '../components/ServerAddressCard';

const HomePage: React.FC = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)', /* Assuming nav bar is 60px */
        padding: '40px 20px',
        textAlign: 'center',
    }}>
        <h1 style={{
            fontSize: '4em',
            margin: '0 0 10px 0',
            color: 'var(--color-primary)',
            textShadow: '0 0 10px rgba(0, 119, 255, 0.7)',
            letterSpacing: '5px',
        }}>
            PEACEFUL HAVEN SMP
        </h1>
        
        <h2 style={{
            fontSize: '1.5em',
            margin: '0 0 40px 0',
            color: 'var(--color-accent)',
        }}>
            WEBSITE UNDER CONSTRUCTION / SERVER IS LIVE
        </h2>

        <div style={{
            display: 'flex',
            gap: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center',
        }}>
            <ServerAddressCard 
                type="Java" 
                address="play.peacefulhaven.lol" 
            />
            <ServerAddressCard 
                type="Bedrock" 
                address="brock.peacefulhaven.lol" 
            />
        </div>

        <p style={{ marginTop: '50px', color: 'var(--color-text-subtle)' }}>
            Monitor the status of the server and player data on the <a href="/trades">Trades</a> page.
        </p>
    </div>
);

export default HomePage;
