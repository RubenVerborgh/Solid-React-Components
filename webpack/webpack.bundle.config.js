/*
  Exports @solid/react and all dependencies.
*/

const applyCommonSettings = require('./webpack.common.config');

module.exports = applyCommonSettings('./dist/', ({ outputDir }) => ({
  output: {
    path: outputDir,
    filename: '[name].bundle.js',
    library: ['solid', 'react'],
  },
  externals: {
    'node-fetch': 'fetch',
    'text-encoding': 'TextEncoder',
    'whatwg-url': 'window',
    'isomorphic-fetch': 'fetch',
    '@trust/webcrypto': 'crypto',
  },
}));
