// Phase 3: UI Integration Testing (Iteration 2)

// ============================================================================
// UI Integration Test - HomeScreen with List and Navigation
// ============================================================================

import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react-native';
import { HomeScreen } from '../src/screens/HomeScreen';
import { useCryptoStore } from '../src/store/cryptoStore';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockCoins = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000, image: 'https://example.com/btc.png', market_cap: 1000000000, market_cap_rank: 1, total_volume: 50000000000, high_24h: 51000, low_24h: 49000, price_change_24h: 1000, price_change_percentage_24h: 2, market_cap_change_24h: 0, market_cap_change_percentage_24h: 0, circulating_supply: 19000000, total_supply: 21000000, max_supply: 21000000, ath: 69000, ath_change_percentage: -27, ath_date: '2021-11-10', atl: 67, atl_change_percentage: 74000, atl_date: '2013-07-06', last_updated: '2024-01-01', sparkline_in_7d: { price: [45000, 46000, 47000, 48000, 49000, 50000, 51000] } },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3000, image: 'https://example.com/eth.png', market_cap: 500000000, market_cap_rank: 2, total_volume: 20000000000, high_24h: 3100, low_24h: 2900, price_change_24h: 50, price_change_percentage_24h: 1.7, market_cap_change_24h: 0, market_cap_change_percentage_24h: 0, circulating_supply: 120000000, total_supply: 120000000, max_supply: null, ath: 4891, ath_change_percentage: -38, ath_date: '2021-11-10', atl: 0.42, atl_change_percentage: 710000, atl_date: '2016-08-15', last_updated: '2024-01-01', sparkline_in_7d: { price: [2800, 2850, 2900, 2950, 3000] } },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 100, image: 'https://example.com/sol.png', market_cap: 40000000, market_cap_rank: 3, total_volume: 2000000000, high_24h: 105, low_24h: 95, price_change_24h: 5, price_change_percentage_24h: 5, market_cap_change_24h: 0, market_cap_change_percentage_24h: 0, circulating_supply: 400000000, total_supply: 500000000, max_supply: null, ath: 260, ath_change_percentage: -61, ath_date: '2021-11-06', atl: 0.5, atl_change_percentage: 19000, atl_date: '2020-05-09', last_updated: '2024-01-01', sparkline_in_7d: { price: [90, 92, 95, 98, 100] } },
];

// Mock the crypto service
jest.mock('../src/services/coingecko', () => ({
  cryptoService: {
    getMarketData: jest.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCoins;
    }),
    getGlobalData: jest.fn().mockResolvedValue({
      total_market_cap: { usd: 2500000000000 },
      total_volume: { usd: 100000000000 },
      market_cap_percentage: { btc: 52 },
    }),
  },
}));

// Mock the gifted-charts LineChart component
jest.mock('react-native-gifted-charts', () => ({
  LineChart: 'LineChart',
}));

// Mock expo-image to prevent image loading issues in tests
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

describe('HomeScreen - UI Integration Tests', () => {
  
  beforeEach(() => {
    // Reset store state
    useCryptoStore.setState({
      coins: [],
      globalData: null,
      isLoading: false,
      isRefreshing: false,
      error: null,
      currency: 'usd',
      searchQuery: '',
      searchResults: [],
    });
    
    // Clear mocks
    jest.clearAllMocks();
  });

  it('should render loading spinner initially', () => {
    // Set loading state
    useCryptoStore.setState({ isLoading: true });
    
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    expect(getByText('Loading market data...')).toBeTruthy();
  });

  it('should wait for mocked data to resolve', async () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    // Initially should show loading
    expect(getByText('Loading market data...')).toBeTruthy();
    
    // Wait for data to load
    await waitFor(() => {
      expect(queryByText('Loading market data...')).toBeNull();
    }, { timeout: 3000 });
    
    // Now coins should be rendered
    await waitFor(() => {
      expect(getByText('Top Cryptocurrencies')).toBeTruthy();
    });
  });

  it('should render list items after data loads', async () => {
    const { getByText, findByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    // Wait for data to resolve
    await waitFor(() => {
      expect(getByText('Bitcoin')).toBeTruthy();
    }, { timeout: 3000 });
    
    // Verify all coins are rendered
    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
    expect(getByText('ETH')).toBeTruthy();
  });

  it('should trigger navigation when list item is pressed', async () => {
    const { getByText, findByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Bitcoin')).toBeTruthy();
    }, { timeout: 3000 });
    
    // Simulate press on Bitcoin
    const bitcoinCard = getByText('Bitcoin');
    fireEvent.press(bitcoinCard);
    
    // Verify navigation was called with correct route
    expect(mockNavigation.navigate).toHaveBeenCalledWith('CoinDetail');
    
    // Verify selected coin was set in store
    const selectedCoin = useCryptoStore.getState().selectedCoin;
    expect(selectedCoin?.id).toBe('bitcoin');
    expect(selectedCoin?.name).toBe('Bitcoin');
  });

  it('should render global market stats', async () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('Market Cap')).toBeTruthy();
      expect(getByText('24h Volume')).toBeTruthy();
      expect(getByText('BTC Dominance')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('should allow currency switching', async () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('€')).toBeTruthy();
    }, { timeout: 3000 });
    
    // Tap on EUR currency
    const eurButton = getByText('€');
    fireEvent.press(eurButton);
    
    // Verify currency was changed
    expect(useCryptoStore.getState().currency).toBe('eur');
  });

  it('should filter coins based on search query', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('Bitcoin')).toBeTruthy();
    }, { timeout: 3000 });
    
    // Type in search
    const searchInput = getByPlaceholderText('Search cryptocurrencies...');
    fireEvent.changeText(searchInput, 'Ethereum');
    
    // Verify search results
    expect(useCryptoStore.getState().searchQuery).toBe('Ethereum');
    
    // Should show Ethereum, hide Bitcoin
    await waitFor(() => {
      expect(getByText('Ethereum')).toBeTruthy();
    });
  });

  it('should render price changes with correct colors', async () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      // Bitcoin has +2% change
      expect(getByText('+2.00%')).toBeTruthy();
      // Ethereum has +1.7% change
      expect(getByText('+1.70%')).toBeTruthy();
    }, { timeout: 3000 });
  });
});
