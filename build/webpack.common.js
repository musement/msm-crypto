const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: "./index.js",
  output: {
    filename: "msmCrypto.bundle.umd.js",
    path: path.resolve(__dirname, "../dist"),
    library: "msmCrypto"
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
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(["dist"])
  ]
};