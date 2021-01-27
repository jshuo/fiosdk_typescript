const webpack = require('webpack');

module.exports = {
  target: "web",
  entry: {
    index: './lib/FIOSDK.js'
  },
  output: {
    library: 'FIOSDK',
    filename: 'fiosdk.bundle.js'
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
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
  }
}

