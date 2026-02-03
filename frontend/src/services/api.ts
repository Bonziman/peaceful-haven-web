import axios from 'axios';
import { config } from '../config'; // Assuming you create this file as instructed

export const api = axios.create({
  // This line must execute with the correct, resolved URL.
  baseURL: config.apiBaseUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// API Response Types
// ============================================


export interface TopPlayer {
    rank: number;
    uuid: string;
    player_name: string;
    value: number;
    last_seen: string;
}

export interface StatLeaderboard {
    stat_id: string;
    stat_label: string;
    top_players: TopPlayer[];
}

export interface StatsDashboard {
    summary: {
        total_stats_available: number;
        total_players_cached: number;
    };
    leaderboards: StatLeaderboard[];
    awards_overview: { id: string; label: string }[];
}

export interface ItemData {
  is_custom: any;
  type: string;
  amount: number;
  display_name: string | null;
  lore: string[] | null;
  custom_model_data: number | null;
  // ADDED: Field for the item icon URL from the backend service
  icon_url?: string | null; 
  enchantments?: {
    id: string;
    name: string;
    level: number;
  }[] | null;
}

export interface ShopOffer {
  id: string;
  result: ItemData | null;
  cost1: ItemData | null;
  cost2: ItemData | null;
}

export interface Shop {
  id: string;
  uuid: string;
  type: string;
  name: string;
  owner_uuid: string | null;
  owner_name: string | null;
  location: {
    world: string;
    x: number;
    y: number;
    z: number;
  };
  offers: ShopOffer[];
}

// --- TYPES for /trades/available ---
export interface AvailableTrade {
  stock_remaining: any;
  trade_unique_id: string; // The generated unique ID from backend
  shop_uuid: string;
  shop_type: string;
  shop_name: string;
  owner_uuid: string | null;
  owner_name: string | null;
  location: {
    world: string;
    x: number;
    y: number;
    z: number;
  };
  id: string; // The offer ID from the YAML (original shop offer ID)
  result: ItemData | null;
  cost1: ItemData | null;
  cost2: ItemData | null;
}

export interface AvailableTradesResponse {
    trades: AvailableTrade[];
    total: number;
    page: number;
    page_size: number;
}
// ---------------------------------------

export interface Trade {
  timestamp: string;
  player_uuid: string;
  player_name: string;
  shop_uuid: string;
  shop_owner_uuid: string | null;
  shop_owner_name: string | null;
  item_1_type: string;
  item_1_amount: number;
  item_2_type: string | null;
  item_2_amount: number | null;
  result_item_type: string;
  result_item_amount: number;
  trade_count: number;
}

export interface TopSeller {
  player_uuid: string;
  player_name: string;
  total_sales: number;
  unique_items: number;
}

export interface PlayerPlaytime {
  uuid: string;
  playtime_ticks: number;
  playtime_hours: number;
  playtime_formatted: string;
}

export interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
    sample?: string[];
  };
  version?: string;
  motd?: string;
  latency?: number;
  error?: string;
}

export interface PlayerStatus {
  uuid: string;
  name: string | null;
  has_logged_in: boolean;
  is_banned: boolean;
  message: string;
}

// ============================================
// API Functions
// ============================================

export const statsApi = {
    getDashboard: () =>
        api.get<StatsDashboard>('/stats/dashboard'),
    getAvailableStats: () =>
        api.get<{ available_stats: string[]; count: number }>('/stats/'),
    getLeaderboard: (statName: string, limit = 20) =>
        api.get<TopPlayer[]>(`/stats/leaderboard/${statName}`, { params: { limit } }),
};

export const shopApi = {
  getAll: (skip = 0, limit = 100) =>
    api.get<{ shops: Shop[]; total: number }>('/shops/', { params: { skip, limit } }),
  
  getById: (uuid: string) =>
    api.get<Shop>(`/shops/${uuid}`),
  
  getByOwner: (ownerUuid: string) =>
    api.get<{ shops: Shop[]; total: number }>(`/shops/owner/${ownerUuid}`),
};

export const tradeApi = {
  getRecent: (limit = 50) =>
    api.get<Trade[]>('/trades/recent', { params: { limit } }),
  
  // ADDED: Function to get available trades with item icons
  getAvailable: (skip = 0, limit = 100) =>
    api.get<AvailableTradesResponse>('/trades/available', { params: { skip, limit } }),
  
  getTopSellers: (limit = 10) =>
    api.get<TopSeller[]>('/trades/leaderboard/sellers', { params: { limit } }),
  
  getPlayerTrades: (playerUuid: string, limit = 100) =>
    api.get(`/trades/player/${playerUuid}`, { params: { limit } }),
  
  getPlayerStats: (playerUuid: string) =>
    api.get(`/trades/stats/${playerUuid}`),
};

export const playerApi = {
  getTopPlaytime: (limit = 10) =>
    api.get<PlayerPlaytime[]>('/players/playtime/top', { params: { limit } }),
  
  getProfile: (playerUuid: string) =>
    api.get(`/players/${playerUuid}`),

  // ADDED: Function to check player login and ban status
  getStatus: (playerUuid: string) =>
    api.get<PlayerStatus>(`/players/${playerUuid}/status`),
};

export const serverApi = {
  getStatus: () =>
    api.get<ServerStatus>('/server/status'),
  
  getInfo: () =>
    api.get('/server/info'),
};
