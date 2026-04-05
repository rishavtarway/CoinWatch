// Phase 2: Core Logic Testing (Iteration 1)

// ============================================================================
// TEST 1: Zustand Store - API Fetching with Cache Logic
// ============================================================================

import { useCryptoStore } from '../src/store/cryptoStore';

// Mock the crypto service
const mockCoins = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000, image: '', market_cap: 1000000000, market_cap_rank: 1, total_volume: 50000000000, high_24h: 51000, low_24h: 49000, price_change_24h: 1000, price_change_percentage_24h: 2, market_cap_change_24h: 0, market_cap_change_percentage_24h: 0, circulating_supply: 19000000, total_supply: 21000000, max_supply: 21000000, ath: 69000, ath_change_percentage: -27, ath_date: '2021-11-10', atl: 67, atl_change_percentage: 74000, atl_date: '2013-07-06', last_updated: '2024-01-01' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3000, image: '', market_cap: 500000000, market_cap_rank: 2, total_volume: 20000000000, high_24h: 3100, low_24h: 2900, price_change_24h: 50, price_change_percentage_24h: 1.7, market_cap_change_24h: 0, market_cap_change_percentage_24h: 0, circulating_supply: 120000000, total_supply: 120000000, max_supply: null, ath: 4891, ath_change_percentage: -38, ath_date: '2021-11-10', atl: 0.42, atl_change_percentage: 710000, atl_date: '2016-08-15', last_updated: '2024-01-01' },
];

// Mock the cryptoService module
jest.mock('../src/services/coingecko', () => ({
  cryptoService: {
    getMarketData: jest.fn().mockImplementation(async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockCoins;
    }),
    getGlobalData: jest.fn().mockResolvedValue({
      total_market_cap: { usd: 2500000000000 },
      total_volume: { usd: 100000000000 },
      market_cap_percentage: { btc: 52 },
    }),
  },
}));

describe('Crypto Store - API Fetch & Cache Logic', () => {
  beforeEach(() => {
    // Reset the store before each test
    useCryptoStore.setState({
      coins: [],
      isLoading: false,
      error: null,
      lastUpdated: null,
    });
  });

  it('should toggle loading state correctly during fetch', async () => {
    const store = useCryptoStore.getState();
    
    // Initially loading should be false
    expect(store.isLoading).toBe(false);
    expect(store.coins.length).toBe(0);
    
    // Start fetching
    const fetchPromise = store.fetchMarketData();
    
    // Loading should be true immediately after calling fetch
    expect(useCryptoStore.getState().isLoading).toBe(true);
    
    // Wait for fetch to complete
    await fetchPromise;
    
    // Loading should be false after fetch completes
    expect(useCryptoStore.getState().isLoading).toBe(false);
  });

  it('should update cache timestamp when data is fetched', async () => {
    const store = useCryptoStore.getState();
    const beforeFetch = store.lastUpdated;
    
    // Fetch data
    await store.fetchMarketData();
    
    const afterFetch = useCryptoStore.getState().lastUpdated;
    
    // Timestamp should be updated after fetch
    expect(afterFetch).not.toBe(beforeFetch);
    expect(afterFetch).toBeGreaterThan(0);
  });

  it('should cache data and not refetch within cache duration', async () => {
    const { cryptoService } = require('../src/services/coingecko');
    const store = useCryptoStore.getState();
    
    // First fetch
    await store.fetchMarketData();
    const firstCallCount = cryptoService.getMarketData.mock.calls.length;
    
    // Second fetch should use cache (within 60 seconds)
    await store.fetchMarketData();
    const secondCallCount = cryptoService.getMarketData.mock.calls.length;
    
    // Should not make another API call due to cache
    expect(firstCallCount).toBe(secondCallCount);
  });

  it('should force refresh when explicitly requested', async () => {
    const { cryptoService } = require('../src/services/coingecko');
    const store = useCryptoStore.getState();
    
    // First fetch
    await store.fetchMarketData();
    
    // Force refresh
    await store.fetchMarketData(true);
    
    // Should make a new API call
    expect(cryptoService.getMarketData).toHaveBeenCalledTimes(2);
  });

  it('should handle errors gracefully', async () => {
    // Mock an error response
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    const store = useCryptoStore.getState();
    await store.fetchMarketData();
    
    expect(useCryptoStore.getState().error).toBeTruthy();
    expect(useCryptoStore.getState().isLoading).toBe(false);
    
    // Restore original fetch
    global.fetch = originalFetch;
  });
});


// ============================================================================
// TEST 2: Utility Function - JSON Parsing with Null Safety
// ============================================================================

import { parseResumeJSON, extractKeywords, generateActionVerbSuggestions, getResumeCompleteness } from '../src/utils/helpers';

describe('Resume JSON Parser - Null Safety', () => {
  
  it('should parse valid JSON without throwing', () => {
    const validJSON = JSON.stringify({
      personalInfo: { fullName: 'John Doe', email: 'john@example.com' },
      summary: 'Experienced developer',
      experience: [{ company: 'Tech Corp', position: 'Developer' }],
      education: [{ institution: 'University', degree: 'BS' }],
      skills: ['React', 'Node.js'],
      projects: [],
      certifications: [],
    });

    const result = parseResumeJSON(validJSON);
    
    expect(result).not.toBeNull();
    expect(result.personalInfo.fullName).toBe('John Doe');
  });

  it('should handle null/missing fields gracefully', () => {
    const incompleteJSON = JSON.stringify({
      personalInfo: null,
      summary: undefined,
      experience: [],
    });

    const result = parseResumeJSON(incompleteJSON);
    
    // Should not throw and should provide defaults
    expect(result).not.toBeNull();
    expect(result.personalInfo).toEqual({});
    expect(result.summary).toBe('');
    expect(result.experience).toEqual([]);
    expect(result.skills).toEqual([]);
  });

  it('should handle completely empty string', () => {
    const result = parseResumeJSON('');
    expect(result).toBeNull();
  });

  it('should handle invalid JSON without throwing', () => {
    const invalidJSON = '{ this is not valid json }';
    
    // Should not throw, should return null
    expect(() => parseResumeJSON(invalidJSON)).not.toThrow();
    expect(parseResumeJSON(invalidJSON)).toBeNull();
  });

  it('should correctly extract keywords from resume text', () => {
    const resumeText = `
      I have experience with React, React Native, and Node.js.
      Worked with Python and Java for backend development.
      Familiar with AWS, Docker, and Kubernetes.
      Used Git for version control.
    `;
    
    const keywords = extractKeywords(resumeText);
    
    expect(keywords).toContain('React');
    expect(keywords).toContain('React Native');
    expect(keywords).toContain('Node.js');
    expect(keywords).toContain('Python');
    expect(keywords).toContain('AWS');
    expect(keywords).toContain('Docker');
  });

  it('should return empty array for text with no keywords', () => {
    const plainText = 'I am a good worker who did many things well.';
    const keywords = extractKeywords(plainText);
    expect(keywords).toEqual([]);
  });

  it('should suggest stronger action verbs', () => {
    const suggestions = generateActionVerbSuggestions('made');
    expect(suggestions).toContain('Created');
    expect(suggestions).toContain('Developed');
    expect(suggestions).not.toContain('made');
  });

  it('should calculate resume completeness correctly', () => {
    const completeResume = {
      personalInfo: { fullName: 'John', email: 'john@test.com', phone: '1234567890' },
      summary: 'Professional summary',
      experience: [{ company: 'Test', position: 'Dev' }],
      education: [{ institution: 'Uni', degree: 'BS' }],
      skills: ['React'],
      projects: [{ name: 'Test' }],
      certifications: [],
    };

    const completeness = getResumeCompleteness(completeResume);
    // 8 fields, all filled = 100%
    expect(completeness).toBe(100);
  });

  it('should handle incomplete resume with lower score', () => {
    const incompleteResume = {
      personalInfo: { fullName: 'John' },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
    };

    const completeness = getResumeCompleteness(incompleteResume);
    // Only 1 field filled out of 8
    expect(completeness).toBe(12); // 1/8 * 100 = 12.5 rounded
  });

  it('should handle null resume', () => {
    const completeness = getResumeCompleteness(null);
    expect(completeness).toBe(0);
  });
});
