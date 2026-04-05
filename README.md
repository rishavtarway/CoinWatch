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
- **User Authentication**: Sign up/login with email or Google OAuth
- **Cloud Sync**: Your portfolio and watchlist synced across devices via Supabase
- **Sparkline Charts**: 7-day price trend visualization

## Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **UI Performance**: FlashList for 60fps scrolling
- **Charts**: react-native-gifted-charts
- **API**: CoinGecko Free API
- **Backend**: Supabase (PostgreSQL + Auth)
- **Notifications**: expo-notifications

## Project Structure

```
CoinWatch/
├── src/
│   ├── components/           # Reusable UI components (CryptoCard)
│   ├── screens/              # App screens
│   │   ├── HomeScreen.tsx    # Main market list
│   │   ├── CoinDetailScreen.tsx
│   │   ├── PortfolioScreen.tsx
│   │   ├── WatchlistScreen.tsx
│   │   └── AuthScreen.tsx    # Login/signup
│   ├── store/
│   │   └── cryptoStore.ts    # Zustand state management
│   ├── services/
│   │   ├── coingecko.ts      # CoinGecko API service
│   │   └── supabase.ts       # Supabase client
│   ├── utils/
│   │   └── formatters.ts    # Currency formatting utilities
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── App.tsx                    # App entry point
├── app.json                   # Expo configuration
└── package.json               # Dependencies
```

---

## Developer Setup Guide

### Prerequisites

Install these on your computer:

1. **Node.js 18+**: https://nodejs.org
   ```bash
   node --version  # Should show v18.x or higher
   ```

2. **npm or yarn**: Comes with Node.js

3. **Expo CLI**:
   ```bash
   npm install -g expo-cli
   ```

4. **Git**: For version control

### For Android Development

1. **Android Studio**: https://developer.android.com/studio
   - During install, check "Android SDK"
   - Open Android Studio > SDK Manager > SDK Platforms > Check "Android 14"

2. **Java Development Kit (JDK) 17**:
   ```bash
   # macOS
   brew install openjdk@17
   # Add to ~/.zshrc: export JAVA_HOME=$(brew --prefix)/opt/openjdk@17
   
   # Windows: Download from https://adoptium.net/
   ```

### For iOS Development (macOS only)

1. **Xcode**: From Mac App Store
2. **Command Line Tools**: 
   ```bash
   xcode-select --install
   ```

---

## How to Run the App

### Option 1: Expo Go (Fastest - Recommended for Development)

1. Install **Expo Go** app on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Clone and run:
   ```bash
   cd CoinWatch
   npm install
   npx expo start
   ```

3. Scan QR code with Expo Go app on your phone

---

### Option 2: Android Emulator

1. Open Android Studio
2. Start an emulator (e.g., Pixel 5, API 34)
3. Run:
   ```bash
   cd CoinWatch
   npx expo start
   # Press 'a' to run on Android
   ```

---

### Option 3: Build APK (Standalone - Works Without Computer)

1. Generate native Android files:
   ```bash
   cd CoinWatch
   npx expo prebuild --platform android
   ```

2. Build debug APK:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`
4. Transfer to phone and install - works completely offline!

---

### Option 4: Run on Physical Android Device via USB

1. Enable Developer Mode on phone:
   - Settings > About Phone > Tap "Build Number" 7 times
   
2. Enable USB Debugging:
   - Settings > Developer Options > USB Debugging

3. Connect phone via USB
4. Run:
   ```bash
   npx expo run:android
   ```

---

## Backend Setup (Required for Full Features)

### 1. Create Supabase Account

Go to https://supabase.com and create a free account.

### 2. Get API Credentials

1. Create new project in Supabase
2. Go to Settings > API
3. Copy **Project URL** and **anon public key**

### 3. Set Up Environment Variables

Create a `.env` file in the CoinWatch root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Database

In Supabase Dashboard > SQL Editor, run:

```sql
-- Portfolio holdings table
CREATE TABLE public.portfolio_holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  coin_id TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  coin_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  buy_price NUMERIC NOT NULL,
  buy_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Watchlist table
CREATE TABLE public.watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  coin_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, coin_id)
);

-- Price alerts table
CREATE TABLE public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  coin_id TEXT NOT NULL,
  target_price NUMERIC NOT NULL,
  condition TEXT CHECK (condition IN ('above', 'below')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Policies (users see only their own data)
CREATE POLICY "Users manage own holdings" ON public.portfolio_holdings 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own watchlist" ON public.watchlist 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own alerts" ON public.price_alerts 
  FOR ALL USING (auth.uid() = user_id);
```

### 5. Set Up Google OAuth (Optional)

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add package name: `com.coinwatch.app`
4. Update `app.json` with your client ID

---

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache and restart
npx react-native start --reset-cache
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit
```

### Build Errors
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
```

### Port Issues
```bash
# Kill process on port 8081
lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## API Rate Limits

The app uses CoinGecko's free tier:
- 10,000 calls/month
- 30 calls/minute

The app includes caching (60 seconds) to minimize API usage.

---

## License

MIT License
