const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Restrict Metro to only watch the expo-app directory
config.watchFolders = [__dirname];

config.resolver = {
  ...config.resolver,
  assetExts: Array.from(new Set([...config.resolver.assetExts, 'mp4', 'png', 'jpg', 'jpeg'])),
  blockList: [
    /.*\/android\/.*/,
    /.*\/ios\/.*/,
    /.*\/\.tools\/.*/,
    /.*\/\.gradle\/.*/,
    /.*\/app\/build\/.*/,
  ],
};

module.exports = config;
