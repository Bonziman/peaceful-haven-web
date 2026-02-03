// frontend/src/pages/TradesPage.tsx

import React, { useState, useEffect } from 'react';
import { ShopGroupCard } from '../components/ShopGroupCard';
import { tradeApi } from '../services/api';
import type { AvailableTrade } from '../services/api';

export interface ShopGroup {
    shop_uuid: string;
    name: string;
    type: string;
    owner_uuid: string | null;
    owner_name: string | null;
    location: AvailableTrade['location'];
    trades: AvailableTrade[]; 
}

const groupTradesByShop = (trades: AvailableTrade[]): ShopGroup[] => {
    const shopMap = new Map<string, ShopGroup>();
    for (const trade of trades) {
        const shopUuid = trade.shop_uuid;
        if (!shopUuid) continue;
        if (!shopMap.has(shopUuid)) {
            shopMap.set(shopUuid, {
                shop_uuid: shopUuid,
                name: trade.shop_name || 'System Shop',
                type: trade.shop_type,
                owner_uuid: trade.owner_uuid,
                owner_name: trade.owner_name,
                location: trade.location,
                trades: []
            });
        }
        shopMap.get(shopUuid)!.trades.push(trade);
    }
    return Array.from(shopMap.values());
};

const TradesPage: React.FC = () => {
    const [groupedShops, setGroupedShops] = useState<ShopGroup[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTrades = async () => {
            try {
                const response = await tradeApi.getAvailable(0, 500); 
                const tradesData = response.data;
                let trades: AvailableTrade[] = [];
                
                if (Array.isArray(tradesData)) {
                    trades = tradesData;
                } else if (tradesData && typeof tradesData === 'object' && 'trades' in tradesData) {
                    trades = tradesData.trades as AvailableTrade[];
                }
                
                setGroupedShops(groupTradesByShop(trades));
            } catch (err) {
                console.error("Failed to fetch trades:", err);
                setError("Failed to load trades. Please check the API backend status.");
            } finally {
                setLoading(false);
            }
        };
        loadTrades();
    }, []);

    return (
        <div className="relative min-h-screen bg-obsidian text-slate-100 font-sans selection:bg-brand-orange/30 overflow-x-hidden">
            {/* Ambient Background Noise */}
            <div className="fixed inset-0 bg-noise z-0 pointer-events-none opacity-40"></div>
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-blue/10 to-transparent z-0 pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-24">
                <header className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-teal text-glow">Shops</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20"></div>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                             {groupedShops.length} Active Merchants
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20"></div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Synchronizing with Global Economy...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-xl mx-auto p-8 rounded-3xl bg-red-500/5 border border-red-500/20 text-center space-y-4">
                        <p className="text-red-400 font-medium">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors text-sm font-bold"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedShops.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                                <p className="text-slate-500">No active shops found. Check back later!</p>
                            </div>
                        ) : (
                            groupedShops.map(shop => (
                                <ShopGroupCard key={shop.shop_uuid} shop={shop} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradesPage;
