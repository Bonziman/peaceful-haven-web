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
            <div className="server-copy-icon">{copied ? '✓' : 'copy'}</div>
        </button>
    );
};

// --- Feature Card Component ---
//interface FeatureCardProps {
//    title: string;
//    description: string;
//    icon: string;
//}

// const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
//     <div className="feature-card">
//         <div className="feature-icon">{icon}</div>
//         <h3>{title}</h3>
//         <p>{description}</p>
//     </div>
// );

// --- Home Page Component ---
const HomePage: React.FC = () => {
    // const [serverStatus, setServerStatus] = useState<{ online: boolean; players?: { online: number; max: number } }>({ online: false });
    const [, setServerStatus] = useState<{ online: boolean; players?: { online: number; max: number } }>({ online: false });

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
                    <h1>A Peaceful Vanilla World, Built to Last</h1>
                    <p>A true vanilla survival server where peace is chosen, not enforced by claims. With a player-driven economy, strict moderation, and a calm community, this is a world made for long-term play. The server is still young. <br /> Join now and help shape its future from the beginning.</p>

                    <div className="server-cards">
                        <ServerAddressCard type="Java Edition" address="play.peacefulhaven.lol" />
                        <ServerAddressCard type="Bedrock" address="brock.peacefulhaven.lol" />
                    </div>
                </div>
            </header>

            {/* FEATURES SECTION */}
            {/* <section className="features">
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
            </section> */}

            {/* FOOTER */}
            {/* <footer className="footer">
                <p>Peaceful Haven SMP is not affiliated with or endorsed by Mojang, Microsoft, or Xbox Live.</p>
            </footer> */}
        </div>
    );
};

export default HomePage;
