/*
  Exports @solid/react and all dependencies.
*/

const extendConfig = require('./webpack.common.config');

module.exports = extendConfig('./dist/', (outputDir, common) => ({
  ...common,
  output: {
    path: outputDir,
    filename: '[name].bundle.js',
    library: ['solid', 'react'],
  },
  externals: {},
}));
