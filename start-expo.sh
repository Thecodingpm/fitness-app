#!/bin/bash

# Increase soft file limit on macOS
ulimit -S -n 65536 2>/dev/null || ulimit -n 65536 2>/dev/null || true

# Locate script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Export Node.js binary path dynamically
if [ -d "$SCRIPT_DIR/.tools/node/bin" ]; then
    export PATH="$SCRIPT_DIR/.tools/node/bin:$PATH"
elif [ -d "$SCRIPT_DIR/../.tools/node/bin" ]; then
    export PATH="$SCRIPT_DIR/../.tools/node/bin:$PATH"
fi

cd "$SCRIPT_DIR/expo-app"

echo "🚀 Starting LIFT Fitness App Expo Dev Server..."
echo "📱 Open Expo Go on your mobile phone and scan the QR code!"
echo ""

export NODE_OPTIONS="--max-old-space-size=4096"

if [ "$1" == "--tunnel" ] || [ "$1" == "-t" ]; then
    node ./node_modules/expo/bin/cli start --tunnel -c --go
else
    node ./node_modules/expo/bin/cli start -c --go
fi
