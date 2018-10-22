/*
  Exports only @solid/react itself, expecting:
  - global.solid.auth to be solid-auth-client
  - global.solid.data to be @solid/query-ldflex
*/

const applyCommonSettings = require('./webpack.common.config');

module.exports = applyCommonSettings('./dist', ({ outputDir }) => ({
  output: {
    path: outputDir,
    filename: '[name].js',
    library: ['solid', 'react'],
  },
}));
