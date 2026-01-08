import React, { useState, useEffect } from 'react';

const HERO_IMAGES = [
    '/images/hero1.png', 
    '/images/hero2.png', 
    '/images/hero3.png',
];

// --- Define Types for ServerAddressCard ---
interface ServerAddressCardProps {
    type: string;
    address: string;
}

// --- Server Address Card Component ---
// FIX: Use defined type
const ServerAddressCard: React.FC<ServerAddressCardProps> = ({ type, address }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button 
            onClick={handleCopy}
            className={`server-card ${copied ? 'copied' : ''}`}
        >
            <div className="server-label">{type}</div>
            <div className="server-address">{address}</div>
            <div className="server-copy-icon">{copied ? '✓' : 'Copy'}</div>
        </button>
    );
};

// --- Define Types for FeatureCard ---
interface FeatureCardProps {
    title: string;
    description: string;
    icon: string; // Assuming the icon is an emoji string
}

// --- Feature Card Component ---
// FIX: Use defined type
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const HomePage: React.FC = () => {
    const [heroImageIndex, setHeroImageIndex] = useState(0);
    const [serverStatus, setServerStatus] = useState<{ online: boolean; players?: { online: number; max: number } }>({ online: false });

    useEffect(() => {
        // Simulate server status
        setServerStatus({
            online: true,
            players: { online: 6, max: 200 }
        });
        
        const imageInterval = setInterval(() => {
            setHeroImageIndex(prevIndex => (prevIndex + 1) % HERO_IMAGES.length);
        }, 8000);

        return () => clearInterval(imageInterval);
    }, []);

    const isOnline = serverStatus.online;
    const playersOnline = serverStatus.players?.online ?? 0;
    const playersMax = serverStatus.players?.max ?? 0;

    return (
        <div className="homepage">
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                :root {
                    --primary: #3b82f6;
                    --accent: #f97316;
                    --text-light: #ffffff;
                    --text-muted: #cbd5e1;
                    --bg-dark: #0f172a;
                }

                .homepage {
                    background: var(--bg-dark);
                    overflow-x: hidden;
                }

                /* ===== HERO SECTION - IMAGE FOCUSED ===== */
                .hero {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Background images with smooth transitions */
                .hero-background {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    overflow: hidden;
                }

                .hero-background img {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0;
                    transition: opacity 1.5s ease-in-out;
                    top: 0;
                    left: 0;
                }

                .hero-background img.active {
                    opacity: 1;
                }

                /* Sophisticated dark overlay - lets image shine through */
                .hero::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        180deg,
                        rgba(15, 23, 42, 0.3) 0%,
                        rgba(15, 23, 42, 0.5) 50%,
                        rgba(15, 23, 42, 0.7) 100%
                    );
                    z-index: 2;
                    pointer-events: none;
                }

                /* Content sits on top */
                .hero-content {
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    padding: 40px 20px;
                    max-width: 900px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 25px;
                    animation: fadeIn 1s ease;
                }
                .hero-content h1 {
                    fontz-size: 140px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Clean, bold title */
                .hero h1 {
                    font-size: clamp(2.5rem, 10vw, 4.5rem);
                    font-weight: 900;
                    color: var(--text-light);
                    letter-spacing: 2px;
                    line-height: 1.1;
                    text-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                    word-spacing: 100vw;
                }

                /* Tagline */
                .hero p {
                    font-size: clamp(1rem, 2.5vw, 1.3rem);
                    color: var(--text-muted);
                    font-weight: 300;
                    letter-spacing: 1px;
                    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
                    max-width: 600px;
                }

                /* Status bar - minimal and clean */
                .status-bar {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 20px;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50px;
                    backdrop-filter: blur(10px);
                    animation: slideUp 1s ease 0.2s backwards;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #22c55e;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
                    50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); }
                }

                .status-text {
                    font-size: 0.9rem;
                    color: var(--text-light);
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .status-players {
                    font-size: 0.85rem;
                    color: var(--accent);
                    font-weight: 500;
                }

                /* Server cards - sleek and minimal */
                .server-cards {
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                    justify-content: center;
                    animation: slideUp 1s ease 0.4s backwards;
                }

                .server-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    padding: 18px 32px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    backdrop-filter: blur(20px);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    min-width: 260px;
                }

                .server-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        45deg,
                        transparent 30%,
                        rgba(255, 255, 255, 0.08) 50%,
                        transparent 70%
                    );
                    transform: translate(-100%, -100%);
                    transition: transform 0.6s;
                }

                .server-card:hover::before {
                    transform: translate(100%, 100%);
                }

                .server-card:hover {
                    border-color: rgba(255, 255, 255, 0.3);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                    transform: translateY(-6px);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
                }

                .server-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: var(--accent);
                    opacity: 0.8;
                    position: relative;
                    z-index: 2;
                }

                .server-address {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-light);
                    font-family: 'Courier New', monospace;
                    letter-spacing: 0.5px;
                    position: relative;
                    z-index: 2;
                }

                .server-copy-icon {
                    font-size: 1.2rem;
                    opacity: 0.6;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 2;
                }

                .server-card:hover .server-copy-icon {
                    opacity: 1;
                    transform: scale(1.2);
                }

                .server-card.copied {
                    border-color: #22c55e;
                }

                /* ===== FEATURES SECTION ===== */
                .features {
                    padding: 120px 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 5;
                }

                .features-header {
                    text-align: center;
                    margin-bottom: 80px;
                }

                .features-header h2 {
                    font-size: clamp(2rem, 5vw, 3rem);
                    font-weight: 900;
                    color: var(--text-light);
                    margin-bottom: 15px;
                    letter-spacing: 1px;
                }

                .features-header .accent {
                    color: var(--accent);
                }

                .features-divider {
                    width: 60px;
                    height: 4px;
                    background: linear-gradient(90deg, var(--primary), var(--accent));
                    margin: 20px auto;
                    border-radius: 2px;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 40px;
                }

                .feature-card {
                    padding: 40px 30px;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(249, 115, 22, 0.03) 100%);
                    border: 1px solid rgba(59, 130, 246, 0.1);
                    border-radius: 16px;
                    transition: all 0.4s ease;
                    position: relative;
                    overflow: hidden;
                }

                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: -1px;
                    left: -1px;
                    right: -1px;
                    bottom: -1px;
                    background: linear-gradient(45deg, var(--primary), var(--accent));
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    border-radius: 16px;
                    z-index: -1;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .feature-card:hover::before {
                    opacity: 0.05;
                }

                .feature-icon {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    display: block;
                }

                .feature-card h3 {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--text-light);
                    margin-bottom: 12px;
                }

                .feature-card p {
                    font-size: 0.95rem;
                    color: var(--text-muted);
                    line-height: 1.7;
                }

                /* ===== FOOTER ===== */
                .footer {
                    padding: 40px;
                    text-align: center;
                    border-top: 1px solid rgba(59, 130, 246, 0.1);
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .footer a {
                    color: var(--primary);
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .footer a:hover {
                    color: var(--accent);
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 768px) {
                    .hero h1 {
                        font-size: 2rem;
                    }

                    .hero p {
                        font-size: 0.95rem;
                    }

                    .server-cards {
                        gap: 15px;
                    }

                    .server-card {
                        min-width: 240px;
                        padding: 16px 24px;
                    }

                    .features {
                        padding: 80px 20px;
                    }

                    .features-header h2 {
                        font-size: 1.8rem;
                    }

                    .features-grid {
                        gap: 25px;
                    }
                }
            `}</style>

            {/* HERO SECTION */}
            <header className="hero">
                <div className="hero-background">
                    {HERO_IMAGES.map((imgSrc, index) => (
                        <img
                            key={imgSrc}
                            src={imgSrc}
                            alt="Peaceful Haven"
                            className={index === heroImageIndex ? 'active' : ''}
                        />
                    ))}
                </div>

                <div className="hero-content">
                    <h1>PEACEFUL HAVEN <br />SMP</h1>
                    <p>A thriving Minecraft community built on survival, economy, and peace</p>

                    <div className="status-bar">
                        <div className="status-dot"></div>
                        <span className="status-text">SERVER {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                        <span className="status-players">
                            {isOnline ? `${playersOnline}/${playersMax} players` : 'Unreachable'}
                        </span>
                    </div>

                    <div className="server-cards">
                        <ServerAddressCard type="Java Edition" address="play.peacefulhaven.lol" />
                        <ServerAddressCard type="Bedrock" address="brock.peacefulhaven.lol" />
                    </div>
                </div>
            </header>

            {/* FEATURES SECTION */}
            <section className="features">
                <div className="features-header">
                    <h2>Why Join <span className="accent">Peaceful Haven?</span></h2>
                    <div className="features-divider"></div>
                </div>

                <div className="features-grid">
                    <FeatureCard
                        icon="🛒"
                        title="Player Economy"
                        description="Engage in a thriving player-driven marketplace with admin shops, stock management, and dynamic pricing to create a real economic ecosystem."
                    />
                    <FeatureCard
                        icon="🛡️"
                        title="Safe & Protected"
                        description="A peaceful community built on trust and respect. Griefers face strict punishments and rollbacks to ensure your creations are preserved."
                    />
                    <FeatureCard
                        icon="🌐"
                        title="Cross-Play"
                        description="Play from any device with full Java and Bedrock support, seamlessly synchronized features, and a unified community experience."
                    />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>
                    Peaceful Haven SMP is not affiliated with or endorsed by Mojang, Microsoft, or Xbox Live.
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
