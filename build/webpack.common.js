const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: "./index.js",
  output: {
    filename: 'msm-crypto.bundle.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'msmCrypto'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ]
};