import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { HomeScreen } from './src/screens/HomeScreen';
import { WatchlistScreen } from './src/screens/WatchlistScreen';
import { PortfolioScreen } from './src/screens/PortfolioScreen';
import { CoinDetailScreen } from './src/screens/CoinDetailScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { supabase } from './src/services/supabase';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{emoji}</Text>
  </View>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="CoinDetail" component={CoinDetailScreen} options={{ headerShown: true, title: 'Coin Details', headerStyle: { backgroundColor: '#1E3A5F' }, headerTintColor: '#FFFFFF' }} />
  </Stack.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    setLoading(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: '#1E3A5F', tabBarInactiveTintColor: '#999999', tabBarLabelStyle: styles.tabLabel }}>
          <Tab.Screen name="Market" component={HomeStack} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} /> }} />
          <Tab.Screen name="Portfolio" component={PortfolioScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💼" focused={focused} /> }} />
          <Tab.Screen name="Watchlist" component={WatchlistScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} /> }} />
        </Tab.Navigator>
      ) : (
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
  tabBar: { backgroundColor: '#FFFFFF', borderTopWidth: 0, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, height: 85, paddingTop: 8, paddingBottom: 25 },
  tabLabel: { fontSize: 12, fontWeight: '600' },
  tabIconContainer: { alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 24, opacity: 0.6 },
  tabIconFocused: { opacity: 1 },
});

export default App;
