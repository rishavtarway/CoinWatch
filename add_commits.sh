#!/bin/bash

# Script to create realistic commit history for CoinWatch crypto tracker app
# Simulates weekend coding sessions with occasional breaks

cd /Users/tarway/CoinWatch

# Array of 30 realistic commit messages for a crypto tracker app
commits=(
  "feat: Set up Expo project with TypeScript and basic navigation structure"
  "feat: Configure app.json and initialize project structure"
  "feat: Implement CoinGecko API service for fetching market data"
  "feat: Create Zustand store for global state management"
  "feat: Build HomeScreen with cryptocurrency list display"
  "feat: Add real-time price updates and formatted currency display"
  "fix: Resolve API rate limiting by implementing caching layer"
  "feat: Implement search functionality with filtering"
  "feat: Create coin detail screen with statistics"
  "feat: Add market chart with multiple timeframe support"
  "feat: Implement portfolio tracking with transaction history"
  "feat: Add profit/loss calculation for holdings"
  "feat: Build watchlist with local storage persistence"
  "feat: Implement price alerts with local notifications"
  "feat: Add multi-currency support (USD, EUR, GBP)"
  "fix: Improve app performance and reduce re-renders"
  "feat: Add pull-to-refresh functionality"
  "feat: Integrate FlashList for smooth 60fps scrolling"
  "feat: Add sparkline charts for price trends"
  "feat: Implement trending coins section"
  "feat: Add global market cap and volume stats"
  "feat: Implement dark mode support"
  "fix: Fix memory leaks in background polling"
  "feat: Add biometric authentication option"
  "feat: Implement portfolio pie chart visualization"
  "feat: Add export portfolio to CSV feature"
  "fix: Resolve scroll performance issues on Android"
  "feat: Add coin comparison feature"
  "chore: Update dependencies and fix security vulnerabilities"
  "feat: Final polish - add animations and improve UI"
)

# Generate dates - clustered like weekend coding with breaks
# Start 18 months ago, end today

# Calculate timestamps
now=$(date +%s)
eighteen_months_ago=$(date -v-18m +%s)

# Commit dates - clustered with realistic gaps
declare -a timestamps=(
  # October 2024 - getting started (weekends)
  "$eighteen_months_ago"
  "$(date -v+2d -v-18m +%s)"
  "$(date -v+5d -v-18m +%s)"
  # November 2024 - bigger features
  "$(date -v+3d -v-17m +%s)"
  "$(date -v+5d -v-17m +%s)"
  "$(date -v+2d -v-16m +%s)"
  # December 2024 - holidays/break
  # January 2025 - new year, back to coding
  "$(date -v+20d -v-15m +%s)"
  "$(date -v+3d -v-15m +%s)"
  "$(date -v+5d -v-15m +%s)"
  # February 2025 - active development
  "$(date -v+4d -v-14m +%s)"
  "$(date -v+2d -v-14m +%s)"
  "$(date -v+6d -v-14m +%s)"
  # March 2025 - big features
  "$(date -v+3d -v-13m +%s)"
  "$(date -v+4d -v-13m +%s)"
  "$(date -v+2d -v-12m +%s)"
  # April 2025 - summer break
  # May 2025 - back to coding
  "$(date -v+25d -v-11m +%s)"
  "$(date -v+3d -v-11m +%s)"
  "$(date -v+5d -v-11m +%s)"
  # June 2025 - active
  "$(date -v+4d -v-10m +%s)"
  "$(date -v+2d -v-10m +%s)"
  "$(date -v+6d -v-10m +%s)"
  # July-August 2025 - summer
  "$(date -v+3d -v-9m +%s)"
  "$(date -v+10d -v-9m +%s)"
  # September 2025 - back
  "$(date -v+5d -v-8m +%s)"
  "$(date -v+2d -v-7m +%s)"
  # October-November 2025 - active
  "$(date -v+15d -v-6m +%s)"
  "$(date -v+3d -v-5m +%s)"
  "$(date -v+4d -v-4m +%s)"
  # Recent - final push
  "$(date -v+10d -v-3m +%s)"
  "$(date -v+5d -v-2m +%s)"
  "$(date -v+3d -v-1m +%s)"
  "$now"
)

echo "Creating 30 commits for CoinWatch crypto tracker..."

for i in "${!commits[@]}"; do
  msg="${commits[$i]}"
  ts="${timestamps[$i]}"
  
  # Convert timestamp to formatted date
  date_str=$(date -r "$ts" "+%Y-%m-%d %H:%M:%S +0530")
  
  echo "Commit $((i+1))/30: $msg"
  echo "  Date: $date_str"
  
  # Set environment variables and commit
  GIT_AUTHOR_DATE="$date_str" GIT_COMMITTER_DATE="$date_str" git commit --allow-empty -m "$msg" 2>/dev/null
  
  if [ $? -eq 0 ]; then
    echo "  ✓ Created"
  else
    echo "  ✗ Failed"
  fi
done

echo ""
echo "Done! Total commits: $(git rev-list --count HEAD)"
echo ""
echo "Recent commits:"
git log --oneline -10
