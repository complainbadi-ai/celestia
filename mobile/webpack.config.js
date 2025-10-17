const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.devServer.historyApiFallback = true;
  config.devServer.host = '0.0.0.0';
  config.devServer.allowedHosts = 'all';

  return config;
};
