// frontend/src/pages/TradesPage.tsx

import React, { useState, useEffect } from 'react';
import { ShopGroupCard } from '../components/ShopGroupCard';
import { tradeApi } from '@/services/api';
import type { AvailableTrade } from '@/services/api';

// 1. Define the correct, robust structure for the grouped shop
// This type is used by both TradesPage and ShopGroupCard
export interface ShopGroup {
    shop_uuid: string;
    name: string;
    type: string;
    owner_name: string | null;
    location: AvailableTrade['location'];
    trades: AvailableTrade[]; 
}

// 2. Core Logic: Function to group the flattened trades by their shop UUID
const groupTradesByShop = (trades: AvailableTrade[]): ShopGroup[] => {
    const shopMap = new Map<string, ShopGroup>();
    
    for (const trade of trades) {
        const shopUuid = trade.shop_uuid;
        
        if (!shopUuid) continue;

        if (!shopMap.has(shopUuid)) {
            // Initialize the shop group with clean, safe properties
            shopMap.set(shopUuid, {
                shop_uuid: shopUuid,
                name: trade.shop_name || 'System Shop',
                type: trade.shop_type,
                owner_name: trade.shop_owner_name,
                location: trade.location,
                trades: []
            });
        }
        
        shopMap.get(shopUuid)!.trades.push(trade);
    }
    
    return Array.from(shopMap.values());
};


const TradesPage: React.FC = () => {
    // We now use the custom ShopGroup[] type for state
    const [groupedShops, setGroupedShops] = useState<ShopGroup[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTrades = async () => {
            try {
                // Fetch up to 500 trades for grouping
                const response = await tradeApi.getAvailable(0, 500); 
                const trades = response.data.trades;
                
                const grouped = groupTradesByShop(trades);
                setGroupedShops(grouped);
                
            } catch (err) {
                console.error("Failed to fetch trades:", err);
                setError("Failed to load trades. Please check the API backend status.");
            } finally {
                setLoading(false);
            }
        };
        loadTrades();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Loading trade data...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: '#ff6b6b', textAlign: 'center' }}>
                Error: {error}
            </div>
        );
    }
    
    const totalShops = groupedShops.length;

    return (
        <div style={{
            padding: '32px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: 'var(--color-bg-dark)', // Use CSS Variable
            minHeight: 'calc(100vh - 60px)' // Subtract navbar height
        }}>
            <h1 style={{
                textAlign: 'center',
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '1px',
                color: 'var(--color-text-light)',
                marginBottom: '8px'
            }}>
                AVAILABLE SHOPS
            </h1>
            <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: 'var(--color-text-subtle)', // Use CSS Variable
                marginBottom: '40px'
            }}>
                ({totalShops})
            </p>

            {totalShops === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-subtle)' }}>
                    No active shops or trades are currently available.
                </p>
            )}

            <div>
                {groupedShops.map(shop => (
                    <ShopGroupCard key={shop.shop_uuid} shop={shop} />
                ))}
            </div>
        </div>
    );
};

export default TradesPage;
