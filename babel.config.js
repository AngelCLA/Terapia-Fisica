module.exports = {
presets: ['babel-preset-expo'],
plugins: [
    [
    'module-resolver',
    {
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
        '@components': './src/components',
        '@screens': './src/screens',
        '@utils': './src/utils',
        '@assets': './assets',
        },
    },
    ],
    'react-native-reanimated/plugin', // Add this if you're using reanimated
],
};

