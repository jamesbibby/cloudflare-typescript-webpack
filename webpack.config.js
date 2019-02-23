const path = require('path');

module.exports = {
  target: 'webworker',
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'dist')
  }
};
