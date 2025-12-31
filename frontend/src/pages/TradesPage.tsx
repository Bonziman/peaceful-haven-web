// frontend/src/pages/TradesPage.tsx (Renamed and slightly modified from TradesList.tsx)
import React, { useState, useEffect } from 'react';
import type { AvailableTrade, AvailableTradesResponse, tradeApi } from '../services/api';
import { TradeItem, getDisplayName } from '@/components/TradeComponents';

// Function to fetch and display the list of trades
const TradesPage: React.FC = () => {
    const [trades, setTrades] = useState<AvailableTrade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTrades = async () => {
            try {
                const response = await tradeApi.getAvailable(0, 100);
                setTrades(response.data.trades);
            } catch (err) {
                console.error("Failed to fetch trades:", err);
                setError("Failed to load trades. Please check the server.");
            } finally {
                setLoading(false);
            }
        };
        loadTrades();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Loading available trades...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Server Trades ({trades.length})</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {trades.map(trade => (
                    <div 
                        key={trade.trade_unique_id} 
                        style={{ 
                            border: '1px solid #333', 
                            borderRadius: '8px', 
                            padding: '15px', 
                            backgroundColor: '#1e1e1e', 
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        
                        <h3 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
                            {trade.shop_name} ({trade.shop_type.toUpperCase()})
                        </h3>
                        
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.9em' }}>
                            Owner: {trade.owner_name || 'Admin Shop'}
                        </p>
                        
                        <div style={{ borderTop: '1px dashed #555', paddingTop: '10px' }}>
                            <p style={{ margin: '0 0 5px 0' }}>**SELLS**</p>
                            <TradeItem item={trade.result} />
                        </div>

                        <div style={{ borderTop: '1px dashed #555', paddingTop: '10px', marginTop: '10px' }}>
                            <p style={{ margin: '0 0 5px 0' }}>**FOR**</p>
                            <TradeItem item={trade.cost1} />
                            {trade.cost2 && <TradeItem item={trade.cost2} />}
                        </div>
                        
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.8em', color: '#aaa' }}>
                            Location: {trade.location.world} ({trade.location.x}, {trade.location.y}, {trade.location.z})
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TradesPage;
