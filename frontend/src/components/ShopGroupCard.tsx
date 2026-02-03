// frontend/src/components/ShopGroupCard.tsx

import React, { useState } from 'react';
import type { AvailableTrade, ItemData } from '../services/api'; 
import type { ShopGroup } from '../pages/TradesPage';
import GlassCard from './GlassCard';
import { ChevronDown, ChevronUp, MapPin, User, Package, ArrowRight } from 'lucide-react';

// ----------------------------------------------------
// COMPONENTS
// ----------------------------------------------------

const toRoman = (num: number) => {
    const roman: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let str = '';
    for (let i in roman) {
        while (num >= roman[i]) {
            str += i;
            num -= roman[i];
        }
    }
    return str;
};

const ItemSlot = ({ item, isResult = false }: { item: ItemData | null, isResult?: boolean }) => {
    if (!item) return null;

    let baseName = item.display_name || item.type?.split(':').pop() || 'Item';
    if (baseName.includes('"text"')) {
        const match = baseName.match(/"text":"(.*?)"/i);
        baseName = match ? match[1] : 'Custom Item';
    }

    // 1. Get real enchantments from the array
    const realEnchants = item.enchantments?.map(e => `${e.name} ${toRoman(e.level)}`) || [];

    // 2. Get lore safely (fallback)
    let loreLines: string[] = [];
    if (item.lore && Array.isArray(item.lore)) {
        loreLines = item.lore.map(line => {
            if (line.includes('"text"')) {
                const match = line.match(/"text":"(.*?)"/i);
                return match ? match[1] : line;
            }
            return line.replace(/§[0-9a-fklmnor]/g, '');
        }).filter(line => line.trim().length > 0);
    }

    const allLines = [...realEnchants, ...loreLines];
    const hasEnchants = allLines.length > 0;

    return (
        <div className="flex flex-col items-center gap-2 group/item relative">
            <div className={`
                w-16 h-16 rounded-lg bg-black/40 border-2 flex items-center justify-center relative
                ${isResult ? 'border-brand-orange/40 shadow-[0_0_15px_rgba(237,137,54,0.1)]' : 'border-white/10'}
                transition-all duration-300 group-hover/item:border-white/30
            `}>
                {/* Enchantment Glint Effect */}
                {hasEnchants && (
                    <div className="absolute inset-0 z-10 opacity-30 pointer-events-none bg-gradient-to-tr from-purple-500/0 via-purple-400/50 to-purple-500/0 animate-[pulse_3s_infinite] mix-blend-color-dodge"></div>
                )}

                {item.icon_url ? (
                    <img 
                        src={item.icon_url} 
                        alt={baseName} 
                        className={`w-10 h-10 object-contain pixelated drop-shadow-lg transition-transform group-hover/item:scale-110 relative z-0 ${hasEnchants ? 'brightness-110' : ''}`}
                    />
                ) : (
                    <Package className="w-6 h-6 text-slate-600" />
                )}
                
                {/* Amount Badge */}
                <div className="absolute -bottom-1 -right-1 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 shadow-lg z-20">
                    {item.amount}x
                </div>

                {/* ENCHANTMENT TOOLTIP */}
                {hasEnchants && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-[#100110]/95 border-2 border-[#2d0a2d] rounded shadow-2xl opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 backdrop-blur-sm">
                        <div className="text-[#55FFFF] font-bold text-sm mb-1">{baseName}</div>
                        <div className="space-y-0.5">
                            {allLines.map((line, i) => (
                                <div key={i} className={`${i < realEnchants.length ? 'text-purple-400' : 'text-[#AAAAAA]'} text-xs font-medium`}>
                                    {line}
                                </div>
                            ))}
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#2d0a2d]"></div>
                    </div>
                )}
            </div>
            <span className="text-[10px] font-medium text-slate-400 max-w-[80px] text-center truncate group-hover/item:text-white transition-colors">
                {baseName}
            </span>
        </div>
    );
};

const TradeRow: React.FC<{ trade: AvailableTrade; isAdmin: boolean }> = ({ trade, isAdmin }) => {
    const stock = trade.stock_remaining;
    
    // Only Admin shops are truly unlimited. 
    // For Player shops, null/0 means out of stock.
    const isUnlimited = isAdmin && stock === null;
    const isOutOfStock = !isUnlimited && (stock === 0 || stock === null);
    
    return (
        <div className={`
            flex items-center justify-between p-6 rounded-xl border border-white/5 
            ${isOutOfStock ? 'opacity-50 grayscale bg-black/20' : 'bg-white/5 hover:bg-white/[0.08]'} 
            transition-all duration-300 group/row
        `}>
            {/* Costs Side */}
            <div className="flex items-center gap-4 w-1/3 justify-start">
                <ItemSlot item={trade.cost1} />
                {trade.cost2 && (
                    <>
                        <div className="text-slate-600 font-bold">+</div>
                        <ItemSlot item={trade.cost2} />
                    </>
                )}
            </div>

            {/* Middle Section (Always Centered) */}
            <div className="flex flex-col items-center gap-2 w-1/3">
                <div className={`
                    text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border
                    ${isOutOfStock ? 'bg-red-500/10 border-red-500/20 text-red-400' : isUnlimited ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue' : 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'}
                `}>
                    {isOutOfStock ? 'Out of Stock' : isUnlimited ? 'Unlimited Stock' : `${stock} Left`}
                </div>
                <div className="text-slate-600 group-hover/row:text-brand-orange transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </div>

            {/* Result Side */}
            <div className="flex items-center gap-4 w-1/3 justify-end">
                <ItemSlot item={trade.result} isResult />
            </div>
        </div>
    );
};

export const ShopGroupCard: React.FC<{ shop: ShopGroup }> = ({ shop }) => {
    const [expanded, setExpanded] = useState(true);
    const isAdmin = shop.type?.toLowerCase() === 'admin';

    return (
        <GlassCard className="mb-8 overflow-visible" hoverEffect={false}>
            {/* Header Area */}
            <div 
                className={`p-6 cursor-pointer flex items-center justify-between border-b border-white/5 bg-gradient-to-r ${isAdmin ? 'from-brand-orange/5' : 'from-brand-blue/5'} to-transparent`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white tracking-tight">{shop.name}</h3>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${isAdmin ? 'border-brand-orange/30 text-brand-orange' : 'border-brand-blue/30 text-brand-blue'}`}>
                            {shop.type || 'Shop'}
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <User className="w-4 h-4 text-brand-orange" />
                            <span>Owner: <span className="text-slate-200 font-medium">{shop.owner_name || (isAdmin ? 'System' : 'Unknown')}</span></span>
                        </div>
                        <a 
                            href={`https://map.peacefulhaven.lol/?world=${shop.location.world}&x=${shop.location.x}&z=${shop.location.z}&zoom=6`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-blue transition-colors group"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MapPin className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
                            <span>{shop.location.world}: <span className="text-slate-200 font-medium">{shop.location.x}, {shop.location.y}, {shop.location.z}</span></span>
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Trades</div>
                        <div className="text-xl font-black text-white">{shop.trades.length}</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-slate-400">
                        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>
            </div>

            {/* Trades Grid */}
            {expanded && (
                <div className="p-6 grid grid-cols-1 gap-4 bg-black/20">
                    {shop.trades.map((trade) => (
                        <TradeRow key={trade.trade_unique_id} trade={trade} isAdmin={isAdmin} />
                    ))}
                </div>
            )}
        </GlassCard>
    );
};
