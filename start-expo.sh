#!/bin/bash

# Increase soft file limit on macOS
ulimit -S -n 65536 2>/dev/null || ulimit -n 65536 2>/dev/null || true


echo "🚀 Starting LIFT Expo Dev Server..."
echo "📱 Open the Expo Go app on your phone and scan the QR code below!"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/expo-app"
npx expo start -c
