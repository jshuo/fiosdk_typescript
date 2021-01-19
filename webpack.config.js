const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: { "crypto": require.resolve("crypto-browserify"), "stream": require.resolve("stream-browserify") }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  module: {
    rules: [
      {
        test: /node_modules\/util\/util\.js/,
        use: [{
          loader: 'imports-loader',
          options: {
            type: 'commonjs',
            imports: ['single process/browser process'],
          },
        }],
      },
    ],
  },
  output: {
      library: 'FIOSDK'
  }
}

