#!/bin/bash

# Increase soft file limit on macOS
ulimit -S -n 65536 2>/dev/null || ulimit -n 65536 2>/dev/null || true

# Export Node.js binary path
export PATH="/Users/fatima/Documents/fitness/.tools/node/bin:$PATH"

echo "🚀 Starting FitPulse AI Expo Go Dev Server..."
echo "📱 Open the Expo Go app on your phone and scan the QR code below!"
echo ""

cd "/Users/fatima/Documents/fitness/expo-app"
npx expo start -c
