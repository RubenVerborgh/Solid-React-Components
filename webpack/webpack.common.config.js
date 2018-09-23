const { resolve } = require('path');

module.exports = {
  mode: 'none',
  context: resolve(__dirname, '..'),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
  },
  externals: {
    'solid-auth-client': ['solid', 'auth'],
    '@solid/query-ldflex': ['solid', 'data'],
  },
  devtool: 'source-map',
};
