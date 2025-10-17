const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Get the origin of the development server
const origin = new URL(process.env.EXPO_DEV_SERVER_ORIGIN || 'http://localhost:8081');

config.server = {
  ...config.server,
  // Remap the origin of the development server to allow requests from the cloud environment
  remapCDN: [
    {
      origin: origin.origin,
      cdn: process.env.EXPO_PUBLIC_DEV_URL,
    },
  ],
  rewriteRequestUrl: (url) => {
    if (!url.endsWith('.bundle')) {
      return url;
    }
    return url + '&platform=web&dev=true&minify=false&modulesOnly=false&runModule=true';
  },
};

module.exports = config;
