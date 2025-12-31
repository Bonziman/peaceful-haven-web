import axios from 'axios';
import { config } from '../config';

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API response types
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

export interface ShopOffer {
  id: string;
  result: ItemData | null;
  cost1: ItemData | null;
  cost2: ItemData | null;
}

export interface ItemData {
  type: string;
  amount: number;
  display_name: string | null;
  lore: string[] | null;
  custom_model_data: number | null;
}

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

// API functions
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
};

export const serverApi = {
  getStatus: () =>
    api.get<ServerStatus>('/server/status'),
  
  getInfo: () =>
    api.get('/server/info'),
};
