import { create } from 'zustand';
import { Crypto, GlobalData, PortfolioHolding, PriceAlert } from '../types';
import { cryptoService } from '../services/coingecko';

interface CryptoState {
  coins: Crypto[];
  globalData: GlobalData | null;
  selectedCoin: Crypto | null;
  portfolio: PortfolioHolding[];
  priceAlerts: PriceAlert[];
  watchlist: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  currency: string;
  lastUpdated: number | null;
  searchQuery: string;
  searchResults: Crypto[];
  
  fetchMarketData: (forceRefresh?: boolean) => Promise<void>;
  fetchGlobalData: () => Promise<void>;
  selectCoin: (coin: Crypto | null) => void;
  setCurrency: (currency: string) => void;
  addToWatchlist: (coinId: string) => void;
  removeFromWatchlist: (coinId: string) => void;
  addPortfolioHolding: (holding: Omit<PortfolioHolding, 'id'>) => void;
  removePortfolioHolding: (id: string) => void;
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  removePriceAlert: (id: string) => void;
  checkPriceAlerts: () => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

const CACHE_DURATION = 60000;

export const useCryptoStore = create<CryptoState>((set, get) => ({
  coins: [],
  globalData: null,
  selectedCoin: null,
  portfolio: [],
  priceAlerts: [],
  watchlist: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  currency: 'usd',
  lastUpdated: null,
  searchQuery: '',
  searchResults: [],

  fetchMarketData: async (forceRefresh = false) => {
    const { lastUpdated, isLoading } = get();
    const now = Date.now();
    
    if (!forceRefresh && lastUpdated && now - lastUpdated < CACHE_DURATION && get().coins.length > 0) {
      return;
    }
    
    if (isLoading) return;
    
    set({ isLoading: true, error: null });
    try {
      const data = await cryptoService.getMarketData(get().currency);
      set({ coins: data, isLoading: false, lastUpdated: now });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch market data',
        isLoading: false 
      });
    }
  },

  fetchGlobalData: async () => {
    try {
      const data = await cryptoService.getGlobalData();
      set({ globalData: data });
    } catch (error) {
      console.error('Failed to fetch global data:', error);
    }
  },

  selectCoin: (coin: Crypto | null) => {
    set({ selectedCoin: coin });
  },

  setCurrency: (currency: string) => {
    set({ currency });
    get().fetchMarketData(true);
  },

  addToWatchlist: (coinId: string) => {
    const { watchlist } = get();
    if (!watchlist.includes(coinId)) {
      set({ watchlist: [...watchlist, coinId] });
    }
  },

  removeFromWatchlist: (coinId: string) => {
    const { watchlist } = get();
    set({ watchlist: watchlist.filter(id => id !== coinId) });
  },

  addPortfolioHolding: (holding: Omit<PortfolioHolding, 'id'>) => {
    const newHolding = { ...holding, id: Date.now().toString() };
    set(state => ({ portfolio: [...state.portfolio, newHolding] }));
  },

  removePortfolioHolding: (id: string) => {
    set(state => ({ portfolio: state.portfolio.filter(h => h.id !== id) }));
  },

  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert = { 
      ...alert, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    set(state => ({ priceAlerts: [...state.priceAlerts, newAlert] }));
  },

  removePriceAlert: (id: string) => {
    set(state => ({ priceAlerts: state.priceAlerts.filter(a => a.id !== id) }));
  },

  checkPriceAlerts: () => {
    const { priceAlerts, coins } = get();
    priceAlerts.forEach(alert => {
      if (!alert.isActive) return;
      const coin = coins.find(c => c.id === alert.coinId);
      if (!coin) return;
      
      const triggered = (alert.condition === 'above' && coin.current_price >= alert.targetPrice) ||
                       (alert.condition === 'below' && coin.current_price <= alert.targetPrice);
      
      if (triggered) {
        console.log(`Price alert triggered for ${coin.name}: ${coin.current_price}`);
      }
    });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    if (query.length > 2) {
      const { coins } = get();
      const results = coins.filter(
        c => c.name.toLowerCase().includes(query.toLowerCase()) ||
             c.symbol.toLowerCase().includes(query.toLowerCase())
      );
      set({ searchResults: results.slice(0, 10) });
    } else {
      set({ searchResults: [] });
    }
  },

  clearError: () => set({ error: null }),
}));
