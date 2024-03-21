const CopyWebpackPlugin = require('copy-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/index.jsx',
  // externals: [nodeExternals()], // Exclude node_modules from bundling
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  output: {
    filename: 'node_modules.js',
  },
};
