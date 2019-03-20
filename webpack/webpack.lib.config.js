/*
  Exports only @solid/react itself, expecting:
  - global.React to be react
  - global.PropTypes to be prop-types
  - global.solid.auth to be solid-auth-client
  - global.solid.data to be @solid/query-ldflex
*/

const extendConfig = require('./webpack.common.config');

module.exports = extendConfig('./dist', (outputDir, { externals, ...common }) => ({
  ...common,
  output: {
    path: outputDir,
    filename: '[name].js',
    library: ['solid', 'react'],
  },
  externals: {
    ...externals,
    'react': 'React',
    'prop-types': 'PropTypes',
  },
}));
