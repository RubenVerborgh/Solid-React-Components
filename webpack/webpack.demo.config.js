const common = require('./webpack.common.config');
const { resolve } = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const outputDir = './dist/demo/';

const localAssets = [
  'index.css',
];
const externalAssets = [
  'solid-auth-client/dist-popup/popup.html',
  'solid-auth-client/dist-lib/solid-auth-client.bundle.js',
  'solid-auth-client/dist-lib/solid-auth-client.bundle.js.map',
];

module.exports = Object.assign({
  entry: {
    demo: './demo/index.jsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(outputDir),
  },
  plugins: [
    new CleanWebpackPlugin([outputDir]),
    new CopyWebpackPlugin(localAssets, { context: 'demo' }),
    new CopyWebpackPlugin(externalAssets.map(a => require.resolve(a))),
    new HtmlWebpackPlugin({
      title: 'Solid React Components Demo',
      filename: 'index.html',
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [
        ...localAssets,
        ...externalAssets
          .filter(a => /\.js$/.test(a))
          .map(a => a.replace(/.*\//, '')),
      ],
      append: false,
    }),
  ],
}, common);
