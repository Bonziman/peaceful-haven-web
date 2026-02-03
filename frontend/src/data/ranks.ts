// frontend/src/data/ranks.ts

export interface RankDuration {
    duration: string;
    price: number; // Price in Euros (€)
    is_permanent?: boolean;
}

export interface Rank {
    id: 'supporter' | 'supporter_plus' | 'patron';
    title: string;
    subtitle: string;
    color: string;
    accent_emoji: string;
    description: string;
    key_features: string[];
    monthly_rewards: string[];
    base_url: string; // <--- NEW: URL to the Ko-fi shop page
    durations: RankDuration[];
}

export const RANKS: Rank[] = [
    {
        id: 'supporter',
        title: 'Supporter',
        subtitle: 'Cosmetic Rank',
        color: '#2ecc71',
        accent_emoji: '🟢',
        description: 'Support the server and unlock monthly cosmetic rewards using UltraCosmetics!',
        key_features: [
            '1 Cosmetic Key per month purchased',
            'Gradient-colored name in chat',
            'Supporter role on Discord',
        ],
        monthly_rewards: [
            '1 Cosmetic Key per month purchased',
            'Cosmetics last 3 months',
            'Rank required to use cosmetics',
        ],
        base_url: 'https://ko-fi.com/havensmp/shop/supporterrank', // ADDED
        durations: [
            { duration: '1 Month', price: 5 },
            { duration: '3 Months', price: 12 },
            { duration: '6 Months', price: 20 },
            { duration: '12 Months', price: 35 },
        ]
    },
    {
        id: 'supporter_plus',
        title: 'Supporter Plus',
        subtitle: 'Enhanced Cosmetic Rank',
        color: '#3498db',
        accent_emoji: '🔵',
        description: 'More keys, more cosmetics, and enhanced visual presence on the server.',
        key_features: [
            '2 Cosmetic Keys per month purchased',
            'Enhanced Gradient-colored name in chat',
            'Supporter Plus role on Discord',
        ],
        monthly_rewards: [
            '2 Cosmetic Keys per month purchased',
            'Cosmetics last 3 months',
            'Rank required to use cosmetics',
        ],
        base_url: 'https://ko-fi.com/havensmp/shop/supporterplusrank', // ADDED
        durations: [
            { duration: '1 Month', price: 12 },
            { duration: '3 Months', price: 30 },
            { duration: '6 Months', price: 55 },
            { duration: '12 Months', price: 100 },
        ]
    },
    {
        id: 'patron',
        title: 'Patron',
        subtitle: 'Premium Cosmetic Rank',
        color: '#9b59b6',
        accent_emoji: '🟣',
        description: 'Maximum monthly cosmetics and exclusive legendary rewards.',
        key_features: [
            '4 Cosmetic Keys per month purchased',
            '✨ Glowing name in chat and tab list',
            'Patron role on Discord',
        ],
        monthly_rewards: [
            '4 Cosmetic Keys per month purchased',
            '1 Legendary Cosmetic per month purchased',
            'Cosmetics last 3 months',
            'Rank required to use cosmetics',
        ],
        base_url: 'https://ko-fi.com/havensmp/shop/patronrank', // ADDED
        durations: [
            { duration: '1 Month', price: 20 },
            { duration: '3 Months', price: 50 },
            { duration: '6 Months', price: 90 },
            { duration: 'Permanent', price: 180, is_permanent: true },
        ]
    }
];

export const getStartingPrice = (rank: Rank): RankDuration => {
    // For Patron, the permanent is the highest price, so we look for the cheapest monthly option (1 month)
    return rank.durations.find(d => !d.is_permanent) || rank.durations[0];
}
