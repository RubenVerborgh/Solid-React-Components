const { resolve } = require('path');

module.exports = function extendConfig(outputDir, customize) {
  return customize(resolve(outputDir), {
    mode: 'none',
    context: resolve(__dirname, '..'),
    entry: {
      'solid-react': './src/',
    },
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
  });
};
