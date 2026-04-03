# CoinWatch - Cryptocurrency Tracker

A high-performance cryptocurrency tracking application built with React Native and Expo. Track live prices, manage your portfolio, and stay updated with market trends.

## Features

- **Live Market Data**: Real-time cryptocurrency prices from CoinGecko API
- **Portfolio Tracking**: Track your holdings with profit/loss calculations
- **Watchlist**: Save favorite coins for quick access
- **Price Alerts**: Set custom price notifications
- **Search & Filter**: Find coins quickly with real-time search
- **Multi-Currency**: Support for USD, EUR, and GBP
- **Market Statistics**: Global market cap, volume, and BTC dominance

## Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **UI Performance**: FlashList for 60fps scrolling
- **Charts**: react-native-gifted-charts
- **API**: CoinGecko Free API
- **Notifications**: expo-notifications

## Project Structure

```
CoinWatch/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens (Home, Portfolio, Watchlist, CoinDetail)
│   ├── store/          # Zustand state management
│   ├── services/       # API services (CoinGecko)
│   ├── utils/          # Helper functions
│   └── types/          # TypeScript interfaces
├── App.tsx             # App entry point
└── app.json            # Expo configuration
```

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI
- For iOS: Xcode (macOS)
- For Android: Android Studio

### Steps

1. Clone the repository:
```bash
git clone https://github.com/rishavtarway/CoinWatch.git
cd CoinWatch
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
```bash
# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android

# Or scan QR code with Expo Go app on your phone
```

### Environment Variables

Create a `.env` file if needed:
```env
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

## API Rate Limiting

The app uses a caching layer to respect CoinGecko's free tier limits (10,000 calls/month, 30 calls/minute). Data is cached for 60 seconds to minimize API calls.

## License

MIT License
