import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, TextInput, Alert
} from 'react-native';
import { useCryptoStore } from '../store/cryptoStore';
import { cryptoService } from '../services/coingecko';
import { formatCurrency, formatPercentage, getCoinColor, timeAgo } from '../utils/formatters';

export const CoinDetailScreen: React.FC = () => {
  const { selectedCoin, watchlist, addToWatchlist, removeFromWatchlist, currency, portfolio, addPortfolioHolding } = useCryptoStore();
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState('7');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  useEffect(() => {
    if (selectedCoin) loadChartData();
  }, [selectedCoin, days]);

  const loadChartData = async () => {
    if (!selectedCoin) return;
    setLoading(true);
    try {
      const data = await cryptoService.getMarketChart(selectedCoin.id, currency, days);
      setChartData(data);
    } catch (error) { console.error('Failed to load chart:', error); }
    setLoading(false);
  };

  if (!selectedCoin) {
    return <View style={styles.container}><Text style={styles.noDataText}>No coin selected</Text></View>;
  }

  const isInWatchlist = watchlist.includes(selectedCoin.id);
  const priceChangeColor = getCoinColor(selectedCoin.price_change_percentage_24h);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) removeFromWatchlist(selectedCoin.id);
    else addToWatchlist(selectedCoin.id);
  };

  const handleAddTransaction = () => {
    if (!amount || !buyPrice) {
      Alert.alert('Error', 'Please enter amount and buy price');
      return;
    }
    addPortfolioHolding({
      coinId: selectedCoin.id,
      coinSymbol: selectedCoin.symbol,
      coinName: selectedCoin.name,
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      buyDate: new Date().toISOString()
    });
    setShowAddTransaction(false);
    setAmount('');
    setBuyPrice('');
    Alert.alert('Success', 'Transaction added to portfolio');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.coinHeader}>
          <Image source={{ uri: selectedCoin.image }} style={styles.coinImage} />
          <View style={styles.coinInfo}>
            <Text style={styles.coinName}>{selectedCoin.name}</Text>
            <Text style={styles.coinSymbol}>{selectedCoin.symbol.toUpperCase()} • Rank #{selectedCoin.market_cap_rank}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.watchlistButton, isInWatchlist && styles.watchlistButtonActive]} onPress={handleWatchlistToggle}>
          <Text style={[styles.watchlistButtonText, isInWatchlist && styles.watchlistButtonTextActive]}>
            {isInWatchlist ? '★ In Watchlist' : '☆ Add to Watchlist'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.currentPrice}>{formatCurrency(selectedCoin.current_price)}</Text>
        <View style={[styles.changeContainer, { backgroundColor: priceChangeColor + '20' }]}>
          <Text style={[styles.priceChange, { color: priceChangeColor }]}>{formatPercentage(selectedCoin.price_change_percentage_24h)} (24h)</Text>
        </View>
      </View>

      <View style={styles.timeRangeSection}>
        {['1', '7', '30', '365'].map(d => (
          <TouchableOpacity key={d} style={[styles.timeRangeButton, days === d && styles.timeRangeButtonActive]} onPress={() => setDays(d)}>
            <Text style={[styles.timeRangeText, days === d && styles.timeRangeTextActive]}>{d === '1' ? '24h' : d === '7' ? '7d' : d === '30' ? '30d' : '1y'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}><Text style={styles.statLabel}>Market Cap</Text><Text style={styles.statValue}>{formatCurrency(selectedCoin.market_cap)}</Text></View>
          <View style={styles.statBox}><Text style={styles.statLabel}>24h Volume</Text><Text style={styles.statValue}>{formatCurrency(selectedCoin.total_volume)}</Text></View>
          <View style={styles.statBox}><Text style={styles.statLabel}>24h High</Text><Text style={styles.statValue}>{formatCurrency(selectedCoin.high_24h)}</Text></View>
          <View style={styles.statBox}><Text style={styles.statLabel}>24h Low</Text><Text style={styles.statValue}>{formatCurrency(selectedCoin.low_24h)}</Text></View>
          <View style={styles.statBox}><Text style={styles.statLabel}>Circulating Supply</Text><Text style={styles.statValue}>{selectedCoin.circulating_supply?.toLocaleString() || 'N/A'}</Text></View>
          <View style={styles.statBox}><Text style={styles.statLabel}>Max Supply</Text><Text style={styles.statValue}>{selectedCoin.max_supply ? selectedCoin.max_supply.toLocaleString() : '∞'}</Text></View>
        </View>
      </View>

      <View style={styles.athSection}>
        <Text style={styles.sectionTitle}>All Time High / Low</Text>
        <View style={styles.athRow}>
          <View style={styles.athBox}>
            <Text style={styles.athLabel}>All Time High</Text>
            <Text style={styles.athValue}>{formatCurrency(selectedCoin.ath)}</Text>
            <Text style={[styles.athChange, { color: getCoinColor(selectedCoin.ath_change_percentage) }]}>{formatPercentage(selectedCoin.ath_change_percentage)}</Text>
            <Text style={styles.athDate}>{timeAgo(selectedCoin.ath_date)}</Text>
          </View>
          <View style={styles.athBox}>
            <Text style={styles.athLabel}>All Time Low</Text>
            <Text style={styles.athValue}>{formatCurrency(selectedCoin.atl)}</Text>
            <Text style={[styles.athChange, { color: getCoinColor(selectedCoin.atl_change_percentage) }]}>{formatPercentage(selectedCoin.atl_change_percentage)}</Text>
            <Text style={styles.athDate}>{timeAgo(selectedCoin.atl_date)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.addTransactionButton} onPress={() => setShowAddTransaction(!showAddTransaction)}>
        <Text style={styles.addTransactionText}>+ Add Transaction</Text>
      </TouchableOpacity>

      {showAddTransaction && (
        <View style={styles.transactionForm}>
          <Text style={styles.formTitle}>Add to Portfolio</Text>
          <TextInput style={styles.input} placeholder="Amount" placeholderTextColor="#999" value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Buy Price (USD)" placeholderTextColor="#999" value={buyPrice} onChangeText={setBuyPrice} keyboardType="numeric" />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddTransaction}>
            <Text style={styles.submitButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  noDataText: { fontSize: 16, color: '#666666', textAlign: 'center', marginTop: 40 },
  header: { backgroundColor: '#1E3A5F', padding: 20 },
  coinHeader: { flexDirection: 'row', alignItems: 'center' },
  coinImage: { width: 56, height: 56, borderRadius: 28 },
  coinInfo: { marginLeft: 16, flex: 1 },
  coinName: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  coinSymbol: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  watchlistButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  watchlistButtonActive: { backgroundColor: '#FFD700' },
  watchlistButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  watchlistButtonTextActive: { color: '#1A1A2E' },
  priceSection: { backgroundColor: '#FFFFFF', padding: 20, marginTop: 8 },
  currentPrice: { fontSize: 32, fontWeight: '800', color: '#1A1A2E' },
  changeContainer: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 12 },
  priceChange: { fontSize: 16, fontWeight: '700' },
  timeRangeSection: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 16, marginTop: 1 },
  timeRangeButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  timeRangeButtonActive: { backgroundColor: '#1E3A5F' },
  timeRangeText: { fontSize: 14, fontWeight: '600', color: '#666666' },
  timeRangeTextActive: { color: '#FFFFFF' },
  statsSection: { backgroundColor: '#FFFFFF', padding: 20, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  statBox: { width: '50%', paddingVertical: 12 },
  statLabel: { fontSize: 13, color: '#666666', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  athSection: { backgroundColor: '#FFFFFF', padding: 20, marginTop: 8 },
  athRow: { flexDirection: 'row', justifyContent: 'space-between' },
  athBox: { flex: 1, backgroundColor: '#F5F7FA', padding: 16, borderRadius: 12, marginHorizontal: 4 },
  athLabel: { fontSize: 12, color: '#666666', marginBottom: 8 },
  athValue: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  athChange: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  athDate: { fontSize: 11, color: '#999999', marginTop: 4 },
  addTransactionButton: { backgroundColor: '#4A90E2', marginHorizontal: 20, marginTop: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  addTransactionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  transactionForm: { backgroundColor: '#FFFFFF', marginHorizontal: 20, marginTop: 12, padding: 20, borderRadius: 12 },
  formTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  input: { backgroundColor: '#F5F7FA', padding: 14, borderRadius: 8, fontSize: 16, color: '#1A1A2E', marginBottom: 12 },
  submitButton: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default CoinDetailScreen;
