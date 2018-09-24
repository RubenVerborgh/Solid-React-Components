const common = require('./webpack.common.config');
const { resolve } = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDir = './dist/';

module.exports = Object.assign({
  entry: {
    'solid-react': './src/',
  },
  output: {
    path: resolve(outputDir),
    filename: '[name].bundle.js',
    library: ['solid', 'react'],
  },
  plugins: [
    new CleanWebpackPlugin([outputDir]),
  ],
}, common);
