import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { WatchlistScreen } from './src/screens/WatchlistScreen';
import { PortfolioScreen } from './src/screens/PortfolioScreen';
import { CoinDetailScreen } from './src/screens/CoinDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const COLORS = {
  dark: '#191c1f',
  white: '#ffffff',
  surface: '#f4f4f4',
  blue: '#494fdf',
  teal: '#00a87e',
  danger: '#e23b4a',
  warning: '#ec7e00',
  midSlate: '#505a63',
  coolGray: '#8d969e',
};

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocusedText]}>{icon}</Text>
  </View>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="CoinDetail" component={CoinDetailScreen} options={{ headerShown: true, title: 'Coin Details', headerStyle: { backgroundColor: COLORS.dark }, headerTintColor: COLORS.white, headerTitleStyle: { fontWeight: '500' } }} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: COLORS.dark, tabBarInactiveTintColor: COLORS.coolGray, tabBarLabelStyle: styles.tabLabel }}>
          <Tab.Screen name="Market" component={HomeStack} options={{ tabBarIcon: ({ focused }) => <TabIcon icon="M" focused={focused} /> }} />
          <Tab.Screen name="Portfolio" component={PortfolioScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon icon="P" focused={focused} /> }} />
          <Tab.Screen name="Watchlist" component={WatchlistScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon icon="W" focused={focused} /> }} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: COLORS.dark },
  tabBar: { backgroundColor: COLORS.white, borderTopWidth: 0, height: 85, paddingTop: 8, paddingBottom: 28 },
  tabLabel: { fontSize: 11, fontWeight: '500' },
  tabIconContainer: { width: 36, height: 36, borderRadius: 9999, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  tabIconFocused: { backgroundColor: COLORS.dark },
  tabIcon: { fontSize: 14, fontWeight: '600', color: COLORS.coolGray },
  tabIconFocusedText: { color: COLORS.white },
});

export default App;
