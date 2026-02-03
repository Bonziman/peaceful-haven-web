// frontend/src/components/ServerAddressCard.tsx
import React, { useState } from 'react';

interface ServerAddressCardProps {
    type: 'Java' | 'Bedrock';
    address: string;
}

const ServerAddressCard: React.FC<ServerAddressCardProps> = ({ type, address }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const typeColor = type === 'Java' ? 'var(--color-primary)' : 'var(--color-accent)';
    const typeLabel = type === 'Java' ? 'JAVA EDITION' : 'BEDROCK EDITION';

    return (
        <div style={{
            backgroundColor: '#2A2A2A',
            border: `1px solid ${typeColor}`,
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'left',
            maxWidth: '400px',
            boxShadow: '0 0 15px rgba(0, 119, 255, 0.3)', /* Blue glow */
            marginBottom: '20px',
        }}>
            <h3 style={{ margin: '0 0 5px 0', color: typeColor, fontSize: '1.2em' }}>
                {typeLabel}
            </h3>
            <p style={{ margin: '5px 0 15px 0', fontSize: '1.8em', fontWeight: 'bold', color: 'var(--color-text-light)' }}>
                {address}
            </p>
            <button 
                onClick={handleCopy}
                style={{
                    backgroundColor: isCopied ? 'var(--color-accent)' : 'var(--color-primary)',
                    minWidth: '100px',
                }}
            >
                {isCopied ? 'COPIED!' : 'CLICK TO COPY'}
            </button>
        </div>
    );
};

export default ServerAddressCard;
