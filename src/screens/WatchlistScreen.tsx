import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useCryptoStore } from '../store/cryptoStore';
import { formatCurrency } from '../utils/formatters';

export const WatchlistScreen: React.FC = () => {
  const { coins, watchlist, selectCoin, navigation } = useCryptoStore();

  const watchlistCoins = coins.filter(coin => watchlist.includes(coin.id));

  const handleCoinPress = (coin: any) => {
    selectCoin(coin);
    navigation?.navigate('CoinDetail');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCoinPress(item)}>
      <View style={styles.coinRow}>
        <Image source={{ uri: item.image }} style={styles.coinImage} />
        <View style={styles.coinInfo}>
          <Text style={styles.coinName}>{item.name}</Text>
          <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.priceInfo}>
        <Text style={styles.coinPrice}>{formatCurrency(item.current_price)}</Text>
        <Text style={[styles.priceChange, { color: item.price_change_percentage_24h >= 0 ? '#00C853' : '#FF5252' }]}>
          {item.price_change_percentage_24h >= 0 ? '+' : ''}{item.price_change_percentage_24h?.toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watchlist</Text>
      {watchlistCoins.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyText}>No coins in watchlist</Text>
          <Text style={styles.emptySubtext}>Tap the star icon on any coin to add it here</Text>
        </View>
      ) : (
        <FlatList data={watchlistCoins} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={styles.listContent} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E3A5F', paddingHorizontal: 16, paddingVertical: 12 },
  listContent: { paddingBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 16, marginHorizontal: 16, marginVertical: 6, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coinRow: { flexDirection: 'row', alignItems: 'center' },
  coinImage: { width: 40, height: 40, borderRadius: 20 },
  coinInfo: { marginLeft: 12 },
  coinName: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  coinSymbol: { fontSize: 13, color: '#666666', marginTop: 2 },
  priceInfo: { alignItems: 'flex-end' },
  coinPrice: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  priceChange: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666666', textAlign: 'center' },
});

export default WatchlistScreen;
