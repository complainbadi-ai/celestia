
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  rewriteRequestUrl: (url) => {
    if (!url.endsWith('.bundle')) {
      return url;
    }
    // Change the dev server host to not use localhost which can be problematic in some environments.
    return url.replace(/localhost:8081/g, '127.0.0.1:8081');
  },
};

module.exports = config;
