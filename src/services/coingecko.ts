import axios from 'axios';
import { Crypto, MarketChart, GlobalData } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export const cryptoService = {
  getMarketData: async (
    currency: string = 'usd',
    perPage: number = 100,
    page: number = 1,
    order: string = 'market_cap_desc',
    sparkline: boolean = true
  ): Promise<Crypto[]> => {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order,
        per_page: perPage,
        page,
        sparkline,
        price_change_percentage: '24h,7d',
      },
    });
    return response.data;
  },

  getCoinDetails: async (id: string): Promise<any> => {
    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: true,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true,
      },
    });
    return response.data;
  },

  getMarketChart: async (
    id: string,
    currency: string = 'usd',
    days: string = '7'
  ): Promise<MarketChart> => {
    const response = await api.get(`/coins/${id}/market_chart`, {
      params: { vs_currency: currency, days },
    });
    return response.data;
  },

  getGlobalData: async (): Promise<GlobalData> => {
    const response = await api.get('/global');
    return response.data.data;
  },

  searchCoins: async (query: string): Promise<any[]> => {
    const response = await api.get('/search', { params: { query } });
    return response.data.coins;
  },
};

export default api;
