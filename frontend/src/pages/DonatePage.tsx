// frontend/src/pages/DonatePage.tsx
import React from 'react';
import { RANKS } from '../data/ranks';
import RankCard from '../components/RankCard';

const DonatePage: React.FC = () => {
    return (
        <div style={{
            padding: '40px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: 'var(--color-bg-dark)',
            minHeight: '100vh',
            color: 'var(--color-text-light)'
        }}>
            {/* Header and Encouragement */}
            <header style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ 
                    fontSize: '36px', 
                    fontWeight: '800', 
                    color: 'var(--color-primary)', 
                    letterSpacing: '1px' 
                }}>
                    SUPPORT PEACEFUL HAVEN
                </h1>
                <p style={{ 
                    fontSize: '18px', 
                    color: 'var(--color-text-subtle)', 
                    maxWidth: '800px', 
                    margin: '10px auto 20px' 
                }}>
                    By purchasing a rank, you are directly helping us cover essential <strong>server costs, hosting, and maintenance</strong> required to keep our community running smoothly 24/7.
                </p>
                
                <div style={{
                    backgroundColor: '#333',
                    padding: '15px',
                    borderRadius: '6px',
                    display: 'inline-block',
                    fontWeight: '600',
                    color: '#ff6b6b' // Red/Accent color for warning
                }}>
                    ⚠️ IMPORTANT: Donations offer <strong>NO competitive advantage</strong> over other players. All perks are purely cosmetic.
                </div>
            </header>

            {/* Rank Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
            }}>
                {RANKS.map(rank => (
                    <RankCard key={rank.id} rank={rank} />
                ))}
            </div>
            
            {/* Detailed Mechanics (Optional Footer) */}
            <footer style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #333' }}>
                <h2 style={{ color: 'var(--color-primary)', fontSize: '24px' }}>Rank Mechanics Explained</h2>
                <div style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>
                    <p><strong>Cosmetic Keys:</strong> Grant access to cosmetic chests upon purchase. Cosmetics unlocked via keys or legendary bonuses last for 3 months from the date of unlock.</p>
                    <p><strong>Rank Requirement:</strong> Your rank must be active to utilize any associated cosmetics, including those unlocked in the past 3 months. If your rank expires, the cosmetics are temporarily locked but never permanently lost. Re-activating the rank instantly restores access to any unexpired items.</p>
                </div>
            </footer>
        </div>
    );
};

export default DonatePage;
