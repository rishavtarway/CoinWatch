import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useCryptoStore } from '../store/cryptoStore';
import { formatCurrency, formatPercentage, getCoinColor } from '../utils/formatters';

interface PortfolioScreenProps {
  navigation: any;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ navigation }) => {
  const { portfolio, coins, removePortfolioHolding, currency } = useCryptoStore();

  const holdingsWithPrices = portfolio.map(holding => {
    const coin = coins.find(c => c.id === holding.coinId);
    const currentPrice = coin?.current_price || 0;
    const currentValue = holding.amount * currentPrice;
    const costBasis = holding.amount * holding.buyPrice;
    const profitLoss = currentValue - costBasis;
    const profitLossPercentage = costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0;
    
    return { ...holding, currentPrice, currentValue, profitLoss, profitLossPercentage, coinImage: coin?.image };
  });

  const totalValue = holdingsWithPrices.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCost = portfolio.reduce((sum, h) => sum + (h.amount * h.buyPrice), 0);
  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercentage = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  const handleRemove = (id: string) => {
    Alert.alert('Remove Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removePortfolioHolding(id) }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onLongPress={() => handleRemove(item.id)}>
      <View style={styles.coinRow}>
        {item.coinImage && <Image source={{ uri: item.coinImage }} style={styles.coinImage} />}
        <View style={styles.coinInfo}>
          <Text style={styles.coinName}>{item.coinName}</Text>
          <Text style={styles.coinSymbol}>{item.coinSymbol.toUpperCase()} • {item.amount} coins</Text>
        </View>
      </View>
      <View style={styles.priceInfo}>
        <Text style={styles.coinPrice}>{formatCurrency(item.currentValue)}</Text>
        <Text style={[styles.profitLoss, { color: getCoinColor(item.profitLoss) }]}>
          {formatPercentage(item.profitLossPercentage)} ({formatCurrency(item.profitLoss)})
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>
      
      {portfolio.length > 0 && (
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Total Balance</Text>
          <Text style={styles.overviewValue}>{formatCurrency(totalValue)}</Text>
          <View style={[styles.profitContainer, { backgroundColor: getCoinColor(totalProfitLoss) + '20' }]}>
            <Text style={[styles.profitText, { color: getCoinColor(totalProfitLoss) }]}>
              {formatPercentage(totalProfitLossPercentage)} ({formatCurrency(totalProfitLoss)})
            </Text>
          </View>
        </View>
      )}

      {portfolio.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No holdings yet</Text>
          <Text style={styles.emptySubtext}>Add transactions from coin details to track your portfolio</Text>
        </View>
      ) : (
        <FlatList
          data={holdingsWithPrices}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E3A5F', paddingHorizontal: 16, paddingVertical: 12 },
  overviewCard: { backgroundColor: '#1E3A5F', marginHorizontal: 16, padding: 20, borderRadius: 16, marginBottom: 16 },
  overviewLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  overviewValue: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  profitContainer: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 12 },
  profitText: { fontSize: 14, fontWeight: '700' },
  listContent: { paddingBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 16, marginHorizontal: 16, marginVertical: 6, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coinRow: { flexDirection: 'row', alignItems: 'center' },
  coinImage: { width: 40, height: 40, borderRadius: 20 },
  coinInfo: { marginLeft: 12 },
  coinName: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  coinSymbol: { fontSize: 13, color: '#666666', marginTop: 2 },
  priceInfo: { alignItems: 'flex-end' },
  coinPrice: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  profitLoss: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666666', textAlign: 'center' },
});

export default PortfolioScreen;
