#!/bin/bash

# Increase soft file limit on macOS
ulimit -S -n 65536 2>/dev/null || ulimit -n 65536 2>/dev/null || true

# Export Node.js binary path
export PATH="/Users/fatima/Documents/fitness/.tools/node/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ "$1" == "--tunnel" ]; then
    echo "🚀 Starting FitPulse AI in Tunnel mode..."
    npx expo start --tunnel -c --go
else
    echo "🚀 Starting FitPulse AI in Local LAN mode (No EAS login required)..."
    npx expo start -c --go --offline
fi
