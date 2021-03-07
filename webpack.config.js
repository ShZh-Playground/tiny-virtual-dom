const { join } = require('path');

module.exports = [{
  entry: './src/index.ts',
  module: {
    rules: [{
      test: /\*.tsx?$/,
      use: 'ts-loader',
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: join(__dirname, 'dist')
  }
}, {
  entry: './example/index.js',
  output: {
    filename: 'bundle.js',
    path: join(__dirname, 'dist')
  }
}]