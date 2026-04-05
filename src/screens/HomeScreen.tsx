import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useCryptoStore } from '../store/cryptoStore';
import { CryptoCard } from '../components/CryptoCard';
import { Crypto } from '../types';
import { formatCurrency } from '../utils/formatters';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    coins, globalData, isLoading, isRefreshing, error, currency,
    fetchMarketData, fetchGlobalData, setCurrency, selectCoin, setSearchQuery, searchResults, searchQuery
  } = useCryptoStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([fetchMarketData(), fetchGlobalData()]);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleCoinPress = (coin: Crypto) => {
    selectCoin(coin);
    navigation.navigate('CoinDetail');
  };

  const currencies = [
    { code: 'usd', label: 'USD', symbol: '$' },
    { code: 'eur', label: 'EUR', symbol: '€' },
    { code: 'gbp', label: 'GBP', symbol: '£' },
  ];

  const displayCoins = searchQuery.length > 2 ? searchResults : coins;

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>CoinWatch</Text>
        <View style={styles.currencySelector}>
          {currencies.map(c => (
            <TouchableOpacity
              key={c.code}
              style={[styles.currencyBtn, currency === c.code && styles.currencyBtnActive]}
              onPress={() => setCurrency(c.code)}
            >
              <Text style={[styles.currencyBtnText, currency === c.code && styles.currencyBtnTextActive]}>
                {c.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {globalData && (
        <View style={styles.globalStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Market Cap</Text>
            <Text style={styles.statValue}>{formatCurrency(globalData.total_market_cap[currency])}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>24h Volume</Text>
            <Text style={styles.statValue}>{formatCurrency(globalData.total_volume[currency])}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>BTC Dominance</Text>
            <Text style={styles.statValue}>{globalData.market_cap_percentage.btc?.toFixed(1)}%</Text>
          </View>
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cryptocurrencies..."
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.listTitle}>Top Cryptocurrencies</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Crypto }) => (
    <CryptoCard coin={item} onPress={handleCoinPress} />
  );

  if (isLoading && coins.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text style={styles.loadingText}>Loading market data...</Text>
      </View>
    );
  }

  if (error && coins.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchMarketData(true)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={displayCoins}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        estimatedItemSize={70}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E3A5F']} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA', padding: 20 },
  errorText: { fontSize: 16, color: '#FF5252', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#1E3A5F', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  header: { paddingTop: 8 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E3A5F' },
  currencySelector: { flexDirection: 'row', backgroundColor: '#E8ECF2', borderRadius: 8, padding: 4 },
  currencyBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  currencyBtnActive: { backgroundColor: '#1E3A5F' },
  currencyBtnText: { fontSize: 14, fontWeight: '600', color: '#666666' },
  currencyBtnTextActive: { color: '#FFFFFF' },
  globalStats: { flexDirection: 'row', backgroundColor: '#1E3A5F', marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, fontSize: 16, color: '#1A1A2E' },
  listTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', paddingHorizontal: 16, paddingVertical: 8 },
  listContent: { paddingBottom: 20 },
});

export default HomeScreen;
