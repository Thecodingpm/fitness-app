#!/bin/bash

# Increase soft file limit on macOS
ulimit -S -n 65536 2>/dev/null || ulimit -n 65536 2>/dev/null || true

# Locate script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Export Node.js binary path dynamically
if [ -d "$SCRIPT_DIR/../.tools/node/bin" ]; then
    export PATH="$SCRIPT_DIR/../.tools/node/bin:$PATH"
elif [ -d "$SCRIPT_DIR/.tools/node/bin" ]; then
    export PATH="$SCRIPT_DIR/.tools/node/bin:$PATH"
fi

cd "$SCRIPT_DIR"

export NODE_OPTIONS="--max-old-space-size=4096"

if [ "$1" == "--tunnel" ]; then
    echo "🚀 Starting FitPulse AI in Tunnel mode..."
    node ./node_modules/expo/bin/cli start --tunnel -c --go
else
    echo "🚀 Starting FitPulse AI in Local LAN mode (No EAS login required)..."
    node ./node_modules/expo/bin/cli start -c --go
fi
