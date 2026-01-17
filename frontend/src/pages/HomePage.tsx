import React, { useState, useEffect } from 'react';
import './HomePage.css';

// --- Server Address Card Component ---
interface ServerAddressCardProps {
    type: string;
    address: string;
}

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
            <div className="server-copy-icon">{copied ? '✓' : '📋'}</div>
        </button>
    );
};

// --- Feature Card Component ---
interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

// --- Home Page Component ---
const HomePage: React.FC = () => {
    const [serverStatus, setServerStatus] = useState<{ online: boolean; players?: { online: number; max: number } }>({ online: false });

    useEffect(() => {
        setServerStatus({
            online: true,
            players: { online: 6, max: 200 }
        });
    }, []);

    return (
        <div className="homepage">
            {/* HERO SECTION */}
            <header className="hero">
                <div className="hero-background">
                    <img src="/images/hero1.png" alt="Peaceful Haven" />
                </div>

                <div className="hero-content">
                    <h1>The super cool server lol</h1>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper</p>

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
                <p>Peaceful Haven SMP is not affiliated with or endorsed by Mojang, Microsoft, or Xbox Live.</p>
            </footer>
        </div>
    );
};

export default HomePage;
