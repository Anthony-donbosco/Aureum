const webpack = require('webpack');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Solo si existe `resolve.fallback`
  if (config.resolve && config.resolve.fallback !== undefined) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "process": require.resolve("process/browser"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "util": require.resolve("util"),
      "buffer": require.resolve("buffer"),
      "assert": require.resolve("assert"),
    };
  }

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};
