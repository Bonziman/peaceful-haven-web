// frontend/src/components/ShopGroupCard.tsx (Conceptual Component)
import React from 'react';
import { AvailableTrade } from '../services/api';
import { TradeItem } from './TradeComponents'; // Reusable item component

interface ShopGroupCardProps {
    shop: ShopGroup; // The new grouped structure
}

const ShopGroupCard: React.FC<ShopGroupCardProps> = ({ shop }) => {
    // Determine the color accent based on shop type
    const isOwnerShop = shop.owner_uuid !== null;
    const borderColor = isOwnerShop ? 'var(--color-primary)' : 'var(--color-accent)'; // Blue for player, Orange for admin

    return (
        <div style={{
            backgroundColor: 'rgba(26, 26, 26, 0.7)', // Dark transparent background
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            margin: '20px 0',
            padding: '20px',
            boxShadow: `0 0 15px 0px ${borderColor}40`, // Subtle glow effect
        }}>
            {/* Shop Header */}
            <div style={{ borderBottom: '1px dashed var(--color-text-subtle)', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: '0', color: 'var(--color-text-light)', fontSize: '1.5em' }}>
                    {shop.name || 'Unnamed Shop'} ({shop.shop_type.toUpperCase()})
                </h3>
                <p style={{ margin: '5px 0 0 0', color: 'var(--color-text-subtle)' }}>
                    Owner: {shop.owner_name || 'System'} | World: {shop.location.world} ({shop.location.x}, {shop.location.y}, {shop.location.z})
                </p>
            </div>
            
            {/* Individual Trades List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {shop.trades.map((trade, index) => (
                    <div 
                        key={trade.trade_unique_id} 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: index < shop.trades.length - 1 ? '1px dotted #333' : 'none' }}
                    >
                        {/* Cost Side (Left) */}
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', color: 'var(--color-text-subtle)' }}>
                            <TradeItem item={trade.cost1} showAmount={true} />
                            {trade.cost2 && <> & </>}
                            {trade.cost2 && <TradeItem item={trade.cost2} showAmount={true} />}
                        </div>
                        
                        {/* Separator Arrow (Center) */}
                        <span style={{ color: 'var(--color-accent)', fontSize: '1.5em', margin: '0 20px' }}>
                            &rarr;
                        </span>

                        {/* Result Side (Right) */}
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', color: 'var(--color-primary)' }}>
                            <TradeItem item={trade.result} showAmount={true} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
