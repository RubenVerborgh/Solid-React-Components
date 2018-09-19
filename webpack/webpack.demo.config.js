const common = require('./webpack.common.config');
const { resolve } = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const outputDir = './dist/demo/';

const assets = [
  'index.css',
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
    new CopyWebpackPlugin(assets, { context: 'demo' }),
    new HtmlWebpackPlugin({
      title: 'Solid React Components Demo',
      filename: 'index.html',
    }),
    new HtmlWebpackIncludeAssetsPlugin({ assets, append: true }),
  ],
}, common);
