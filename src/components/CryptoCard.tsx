import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Crypto } from '../types';
import { formatCurrency, formatPercentage, getCoinColor } from '../utils/formatters';

interface CryptoCardProps {
  coin: Crypto;
  onPress: (coin: Crypto) => void;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ coin, onPress }) => {
  const priceChangeColor = getCoinColor(coin.price_change_percentage_24h);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(coin)} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <Image source={{ uri: coin.image }} style={styles.coinImage} />
        <View style={styles.coinInfo}>
          <Text style={styles.coinName} numberOfLines={1}>{coin.name}</Text>
          <Text style={styles.coinSymbol}>{coin.symbol.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.coinPrice}>{formatCurrency(coin.current_price)}</Text>
        <View style={[styles.changeContainer, { backgroundColor: priceChangeColor + '20' }]}>
          <Text style={[styles.priceChange, { color: priceChangeColor }]}>
            {formatPercentage(coin.price_change_percentage_24h)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinImage: { width: 36, height: 36, borderRadius: 18 },
  coinInfo: { marginLeft: 12, flex: 1 },
  coinName: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  coinSymbol: { fontSize: 12, color: '#888888', marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  coinPrice: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  changeContainer: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  priceChange: { fontSize: 12, fontWeight: '600' },
});

export default CryptoCard;
