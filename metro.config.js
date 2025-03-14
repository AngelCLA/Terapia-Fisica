// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Configura el resolver de Metro
defaultConfig.resolver.sourceExts = [
    'js', 'jsx', 'ts', 'tsx', 'json', 'mjs', 'cjs'
];

module.exports = defaultConfig;
