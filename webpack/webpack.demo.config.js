/*
  Exports the demo application.
*/

const applyCommonSettings = require('./webpack.common.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const localAssets = [
  'index.css',
  'profile.svg',
];
const externalAssets = [
  'solid-auth-client/dist-popup/popup.html',
  'solid-auth-client/dist-lib/solid-auth-client.bundle.js',
  'solid-auth-client/dist-lib/solid-auth-client.bundle.js.map',
  '@solid/query-ldflex/dist/solid-query-ldflex.bundle.js',
  '@solid/query-ldflex/dist/solid-query-ldflex.bundle.js.map',
];

module.exports = applyCommonSettings('./dist/demo/', ({ outputDir }) => ({
  entry: {
    demo: './demo/index.jsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: outputDir,
  },
  plugins: [
    new CopyWebpackPlugin(localAssets, { context: 'demo' }),
    new CopyWebpackPlugin(externalAssets.map(a => require.resolve(a))),
    new HtmlWebpackPlugin({
      title: 'Solid React Components Demo',
      filename: 'index.html',
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [
        ...localAssets,
        ...externalAssets.map(f => f.replace(/.*\//, '')),
      ].filter(f => /\.(js|css)$/.test(f)),
      append: false,
    }),
  ],
}));
