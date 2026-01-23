// frontend/src/components/ShopGroupCard.tsx

import React, { useState } from 'react';
import type { AvailableTrade, ItemData } from '../services/api'; 
// Assuming ItemData is imported from '../services/api' or is globally available
import type { ShopGroup } from '../pages/TradesPage';

// ----------------------------------------------------
// TYPES 
// ----------------------------------------------------

interface ShopGroupCardProps {
    shop: ShopGroup;
}


// ----------------------------------------------------
// TRADE ITEM COMPONENT (FIXED TYPING AND UNUSED VARIABLE)
// ----------------------------------------------------
// FIX 1: Change 'item: ItemData' to 'item: ItemData | null'
const TradeItem: React.FC<{ item: ItemData | null, isMirrored?: boolean }> = ({ item, isMirrored = false }) => {
    
    // Check if the item is null immediately
    if (!item) return null; // Exit early if no item data

    // FIX 2: Remove the unused isGif variable
    // const isGif = imageUrl?.toLowerCase().endsWith('.gif'); 
    
    // --- Safe Name Extraction Logic (Handles JSON text components) ---
    // Note: item is guaranteed not to be null here
    let baseName = item.display_name || item.type?.split(':').pop() || 'Item';

    // Check for JSON-like Minecraft component text and extract the "text" property
    if (baseName.includes('"text"')) {
        const match = baseName.match(/"text":"(.*?)"/i);
        baseName = match ? match[1] : 'Custom Item';
    } else if (baseName.startsWith('{') && baseName.endsWith('}')) {
        const match = baseName.match(/text:\s*["']?([^,"']+)["']?/i);
        baseName = match ? match[1] : 'Custom Item';
    }
    
    const displayName = baseName;
    const imageUrl = item.icon_url;
    const isCustom = item.is_custom; 
    
    if (!displayName) return null;

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flexDirection: isMirrored ? 'row-reverse' : 'row',
            position: 'relative',
            // Add padding to accommodate the custom tag
            paddingTop: isCustom ? '12px' : '0',
            paddingLeft: !isMirrored && isCustom ? '8px' : '0',
            paddingRight: isMirrored && isCustom ? '8px' : '0',
        }}>
            
            {/* Custom Tag - positioned relative to the outermost container */}
            {isCustom && (
                <span style={{
                    position: 'absolute',
                    top: '-6px',
                    // Position based on mirroring
                    left: isMirrored ? 'auto' : '0', 
                    right: isMirrored ? '0' : 'auto', 
                    backgroundColor: 'var(--color-accent)', 
                    color: 'var(--color-bg-dark)',
                    fontSize: '9px', 
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    zIndex: 20,
                    whiteSpace: 'nowrap'
                }}>
                    {displayName.toUpperCase()}
                </span>
            )}

            {/* The Icon Container */}
            <div style={{
                width: '40px', 
                height: '40px',
                backgroundColor: '#2A2A2A',
                border: '1px solid #444',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={displayName}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            imageRendering: 'pixelated', 
                            padding: '4px'
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : (
                    // FALLBACK: Text for custom/modded items
                    <span style={{ 
                        fontSize: '8px', 
                        textAlign: 'center', 
                        color: 'var(--color-accent)', 
                        padding: '2px', 
                        wordBreak: 'break-all',
                        lineHeight: '1.2'
                    }}>
                        CUSTOM ITEM
                    </span>
                )}
            </div>
            
            {/* The Text Container: holds Name and Amount */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMirrored ? 'flex-end' : 'flex-start', 
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>
                <span style={{
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: 'var(--color-text-light)', 
                    lineHeight: '1.2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                }}>
                    {displayName}
                </span>
                <span style={{
                    fontSize: '12px', 
                    color: 'var(--color-text-subtle)', 
                    fontWeight: '400',
                }}>
                    {item.amount}x 
                </span>
            </div>
        </div>
    );
};



// ----------------------------------------------------
// TRADE ROW COMPONENT
// ----------------------------------------------------
const TradeRow: React.FC<{ trade: AvailableTrade }> = ({ trade }) => {
    // 1. Determine Stock Status
    const stock = trade.stock_remaining;
    const isLowStock = stock !== null && stock <= 5;
    const stockText = stock === null ? 'Stock N/A' : (stock === 0 ? 'SOLD OUT' : `${stock} IN STOCK`);
    
    // 2. Determine Stock Color
    const stockColor = stock === 0 
        ? '#ff6b6b' // Red for sold out
        : isLowStock 
            ? 'var(--color-accent)' // Orange for low stock
            : 'var(--color-primary)'; // Blue for normal stock

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
            borderBottom: '1px solid #1a1a1a',
            gap: '16px'
        }}>
            {/* Cost Side (Left - NO MIRROR) */}
            <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                minWidth: '200px', 
                justifyContent: 'flex-start'
            }}>
                {/* FIX 3: trade.cost1 is passed correctly as ItemData | null */}
                <TradeItem item={trade.cost1} />
                {trade.cost2 && (
                    <>
                        <span style={{ color: 'var(--color-text-subtle)', fontSize: '12px' }}>+</span>
                        {/* FIX 4: trade.cost2 is passed correctly as ItemData | null */}
                        <TradeItem item={trade.cost2} />
                    </>
                )}
            </div>

            
            {/* Stock Status Block (Center) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                textAlign: 'center',
                margin: '0 20px',
            }}>
                <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '600',
                    color: stockColor, // Apply stock status color
                    marginBottom: '4px',
                    letterSpacing: '0.5px'
                }}>
                    {stockText}
                </span>
                <span style={{ 
                    color: 'var(--color-accent)', 
                    fontSize: '20px',
                    lineHeight: '1'
                }}>
                    &rarr;
                </span>
            </div>
            {/* Result Side (Right - MIRRORED) */}
            <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                minWidth: '200px', 
                justifyContent: 'flex-end'
            }}>
                {/* trade.result is already safely conditionally rendered */}
                {trade.result && <TradeItem item={trade.result} isMirrored={true} />} 
            </div>
        </div>
    );
};


// ----------------------------------------------------
// SHOP GROUP CARD COMPONENT
// ----------------------------------------------------
export const ShopGroupCard: React.FC<ShopGroupCardProps> = ({ shop }) => {
    const [expanded, setExpanded] = useState(true);

    // shop.owner_uuid must be handled as string | null based on imported type
    const isOwnerShop = shop.owner_uuid !== null;
    const borderColor = isOwnerShop ? '#1a1e33' : 'var(--color-accent)'; 
    
    // 1. Explicitly check if it's a non-empty string (most robust check for name)
    const hasOwnerName = typeof shop.owner_name === 'string' && shop.owner_name.trim().length > 0;

    // 2. Determine the text to display with clear priority
    const ownerToDisplay = hasOwnerName
        ? shop.owner_name // 1. Use the actual name (e.g., "_Chowo")
        : (shop.type?.toLowerCase() === 'admin' 
            ? 'System' // 2. If no name AND it's an admin shop, use 'System'
            : 'Unknown Player'); // 3. Fallback for player shop with missing name.

    // The return statement MUST use the variable defined above it.
    return (
        <div style={{
            background: 'linear-gradient(#272a3d1a 0%,#272a3d66 100%)',
            border: `1px solid ${borderColor}`,
            borderRadius: '6px',
            marginBottom: '20px',
            overflow: 'hidden',
            boxShadow: `0 4px 12px ${borderColor}20` 
        }}>
            {/* Header */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    padding: '16px 20px',
                    background: 'linear-gradient(#272a3d1a 0%,#272a3d66 100%)',
                    borderBottom: '1px solid #2a2a2a',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    userSelect: 'none'
                }}
            >
                <div>
                    <h3 style={{
                        margin: '0 0 4px 0',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--color-text-light)',
                        letterSpacing: '0.5px'
                    }}>
                        {shop.name} <span style={{ color: 'var(--color-text-subtle)', fontWeight: '400', fontSize: '14px' }}>({shop.type?.toUpperCase() ?? 'UNKNOWN'})</span>
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: 'var(--color-text-subtle)'
                    }}>
                        Owner: {ownerToDisplay} | <a href={`https://map.peacefulhaven.lol/?world=${shop.location.world}&renderer=vintage_story&zoom=0&x=${shop.location.x}&z=${shop.location.z}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'none' }}>
                            {shop.location.x} {shop.location.y} {shop.location.z} in {shop.location.world}
                        </a>
                    </p>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>
                    {shop.trades.length} {shop.trades.length === 1 ? 'trade' : 'trades'}
                </span>
            </div>

            {/* Trades List */}
            {expanded && (
                <div style={{ borderTop: '1px solid #1a1a1a' }}>
                    {shop.trades && shop.trades.length > 0 ? (
                        shop.trades.map((trade) => (
                            <TradeRow key={trade.trade_unique_id} trade={trade} />
                        ))
                    ) : (
                        <div style={{ padding: '16px', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
                            No trades available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
