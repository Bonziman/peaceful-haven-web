// frontend/src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import ServerAddressCard from '../components/ServerAddressCard';
// CORRECTED IMPORT WITH 'type' keyword
import { serverApi, type ServerStatus } from '../services'; 

// Array of images paths in the public directory
const HERO_IMAGES = [
    '/images/hero/hero1.jpg', // Placeholder 1
    '/images/hero/hero2.jpg', // Placeholder 2
    '/images/hero/hero3.jpg', // Placeholder 3
];

// --- Hero Background Component (NEW) ---
const HeroBackground: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Cycles the image index every 7 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % HERO_IMAGES.length);
        }, 7000); // Change image every 7 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0, // Behind all content
            backgroundColor: 'var(--color-bg-dark)'
        }}>
            {HERO_IMAGES.map((imgSrc, index) => (
                <img
                    key={imgSrc}
                    src={imgSrc}
                    alt="Server Screenshot"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'opacity 2s ease-in-out', // Fade transition
                        opacity: index === currentIndex ? 0.2 : 0, // 0.2 opacity to keep dark theme
                    }}
                />
            ))}
            {/* Dark overlay to ensure text contrast */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.4)', // Dark gradient/overlay
            }}></div>
        </div>
    );
};

// --- Live Status Display Component ---
const LiveStatusDisplay: React.FC<{ status: ServerStatus }> = ({ status }) => {
    const isOnline = status.online;
    const playersOnline = status.players?.online ?? 0;
    const playersMax = status.players?.max ?? 0;
    
    // Choose colors based on status
    const statusColor = isOnline ? 'var(--color-primary)' : '#ff6b6b'; // Blue for Online, Red for Offline
    const playerColor = playersOnline > 0 ? 'var(--color-accent)' : 'var(--color-text-subtle)'; // Orange if players > 0

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '20px 0 40px 0',
            border: `1px solid ${statusColor}40`,
            borderRadius: '8px',
            padding: '20px 40px',
            boxShadow: `0 0 15px ${statusColor}20`,
            backgroundColor: 'rgba(26, 26, 26, 0.7)', // Semi-transparent overlay
        }}>
            <h3 style={{
                color: statusColor,
                fontSize: '1.6em',
                fontWeight: 'bold',
                textShadow: `0 0 8px ${statusColor}80`,
                margin: '0 0 10px 0',
                letterSpacing: '2px',
            }}>
                STATUS: {isOnline ? 'ONLINE' : 'OFFLINE'}
            </h3>
            <p style={{
                margin: 0,
                fontSize: '1.2em',
                fontWeight: '600',
                color: isOnline ? playerColor : 'var(--color-text-subtle)',
            }}>
                {isOnline ? 
                    `${playersOnline} / ${playersMax} Players Online` : 
                    'Server Unreachable. Check back soon.'}
            </p>
            {isOnline && status.version && (
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: 'var(--color-text-subtle)' }}>
                    Version: {status.version}
                </p>
            )}
        </div>
    );
};

// --- Core Feature Card Component ---
interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <div style={{
        backgroundColor: '#2A2A2A',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '300px',
        textAlign: 'left',
        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
    }}>
        <div style={{ fontSize: '2em', color: 'var(--color-accent)', marginBottom: '10px' }}>{icon}</div>
        <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-primary)' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--color-text-subtle)' }}>{description}</p>
    </div>
);


const HomePage: React.FC = () => {
    const [serverStatus, setServerStatus] = useState<ServerStatus>({ online: false } as ServerStatus);
    
    // Fetch status on mount (and interval)
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await serverApi.getStatus();
                setServerStatus(response.data);
            } catch (error) {
                console.error("Failed to fetch server status:", error);
            }
        };
        fetchStatus();
        const intervalId = setInterval(fetchStatus, 30000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'calc(100vh - 60px)',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-bg-dark)',
            position: 'relative', // Context for HeroBackground
            overflow: 'hidden',
        }}>
            
            <HeroBackground /> 

            {/* Content must be z-indexed above the background */}
            <div style={{ position: 'relative', zIndex: 10 }}> 

                {/* 1. HERO SECTION */}
                <h1 style={{
                    fontSize: '4em',
                    margin: '0 0 10px 0',
                    color: 'var(--color-accent)',
                    textShadow: '0 0 15px rgba(255, 153, 0, 0.5)', 
                    letterSpacing: '5px',
                }}>
                    PEACEFUL HAVEN SMP
                </h1>
                
                <h2 style={{
                    fontSize: '1.5em',
                    margin: '0 0 40px 0',
                    color: 'var(--color-primary)',
                }}>
                    Balanced Survival. Player-Driven Economy. Safe Community.
                </h2>

                {/* 2. LIVE STATUS INTEGRATION */}
                <LiveStatusDisplay status={serverStatus} />
                
                {/* 3. SERVER ADDRESSES */}
                <div style={{
                    display: 'flex',
                    gap: '40px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: '60px'
                }}>
                    <ServerAddressCard type="Java" address="play.peacefulhaven.lol" />
                    <ServerAddressCard type="Bedrock" address="brock.peacefulhaven.lol" />
                </div>
                
                {/* 4. CORE FEATURES SECTION */}
                <div style={{ marginBottom: '60px', width: '100%', maxWidth: '1000px' }}>
                    <h3 style={{ marginBottom: '30px', color: 'var(--color-primary)' }}>CORE FEATURES</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
                        <FeatureCard
                            title="Player-Driven Marketplace"
                            description="View all live player and admin shops, stock status, and pricing history. Fully integrated with Shopkeepers."
                            icon="🛒"
                        />
                        <FeatureCard
                            title="Secure & Anti-Grief"
                            description="Protected lands, active moderation, and advanced plugins ensure a safe, long-term survival experience."
                            icon="🔒"
                        />
                        <FeatureCard
                            title="Seamless Cross-Play"
                            description="Join from any device! Full Java and Bedrock cross-platform support with synchronized features."
                            icon="📱"
                        />
                    </div>
                </div>

                {/* 5. DISCLAIMER SECTION */}
                <p style={{ 
                    fontSize: '0.7em', 
                    color: 'var(--color-text-subtle)', 
                    marginTop: '50px', 
                    borderTop: '1px solid #333', 
                    paddingTop: '20px' 
                }}>
                    Peaceful Haven SMP is not affiliated with or endorsed by Mojang, Microsoft, or Xbox Live.
                </p>
            </div>
        </div>
    );
};

export default HomePage;
