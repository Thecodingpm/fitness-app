const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure mp4, png, jpg, jpeg are supported in asset extensions
const extraExts = ['mp4', 'png', 'jpg', 'jpeg', 'ttf'];
extraExts.forEach(ext => {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
});

module.exports = config;

