/*
  Exports only @solid/react itself, expecting:
  - global.solid.auth to be solid-auth-client
  - global.solid.data to be @solid/query-ldflex
*/

const extendConfig = require('./webpack.common.config');

module.exports = extendConfig('./dist', (outputDir, common) => ({
  ...common,
  output: {
    path: outputDir,
    filename: '[name].js',
    library: ['solid', 'react'],
  },
}));
