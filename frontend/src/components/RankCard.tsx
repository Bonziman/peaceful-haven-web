// frontend/src/components/RankCard.tsx
import React from 'react';
import type { Rank } from '../data/ranks';
import { getStartingPrice } from '../data/ranks';

interface RankCardProps {
    rank: Rank;
}

const RankCard: React.FC<RankCardProps> = ({ rank }) => {
    const startingDuration = getStartingPrice(rank);

    return (
        <div style={{
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            border: `2px solid ${rank.color}80`,
            boxShadow: `0 4px 15px ${rank.color}30`,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            minHeight: '400px',
        }}>
            {/* Price Badge (Top Right) */}
            <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                backgroundColor: rank.color,
                color: '#fff',
                padding: '4px 10px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderBottomLeftRadius: '8px',
                zIndex: 10,
            }}>
                {startingDuration.duration} from €{startingDuration.price}
            </span>

            {/* Header */}
            <div style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <h3 style={{
                    color: rank.color,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: 0,
                }}>
                    {rank.title}
                </h3>
                <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>
                    {rank.accent_emoji} {rank.subtitle}
                </p>
            </div>

            {/* Description */}
            <p style={{ color: '#ddd', fontSize: '14px', flexGrow: 1 }}>
                {rank.description}
            </p>

            {/* Key Features */}
            <div style={{ marginBottom: '20px', flexGrow: 2 }}>
                <h4 style={{ color: '#fff', fontSize: '16px', borderLeft: `3px solid ${rank.color}`, paddingLeft: '8px', marginBottom: '10px' }}>
                    What you get
                </h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {rank.key_features.map((feature, index) => (
                        <li key={index} style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.6', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: rank.color, marginRight: '8px' }}>✓</span> {feature}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Pricing Options Button/Link (Updated to use the URL) */}
            <a
                href={rank.base_url} // <-- Uses the Ko-fi URL
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'block', // Make sure the link acts like a block button
                    textAlign: 'center',
                    backgroundColor: rank.color,
                    color: '#111',
                    textDecoration: 'none',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginTop: 'auto',
                }}
            >
                View Purchase Options
            </a>
        </div>
    );
};

export default RankCard;
