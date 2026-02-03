// frontend/src/components/TradeComponents.tsx
import React from 'react';
import type { ItemData } from '../services'; 

// Simple function to extract the display name, handling the complex text component format
export const getDisplayName = (item: ItemData | null): string => {
    if (!item) return "N/A";

    // If the display name is a JSON string (like "{color:\"green\",...}") return the raw ID
    if (item.display_name && (item.display_name.startsWith('{') || item.display_name.includes('"text"'))) {
        return item.type.split(':').pop()?.replace(/_/g, ' ').toUpperCase() || 'Custom Item';
    }
    
    // Otherwise, return the enriched/custom name
    return item.display_name || item.type.split(':').pop()?.replace(/_/g, ' ').toUpperCase() || 'Unknown Item';
};

// Component to display a single item with its count and icon
export const TradeItem: React.FC<{ item: ItemData | null }> = ({ item }) => {
    if (!item) return <span>-</span>;
    
    const displayName = getDisplayName(item);
    
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.icon_url && (
                <img 
                    src={item.icon_url} 
                    alt={displayName} 
                    title={displayName} 
                    style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }} 
                />
            )}
            <span>
                {item.amount}x {displayName}
            </span>
        </div>
    );
};
