var dotenv            = require("dotenv");
var webpack           = require("@webpack-blocks/webpack2");
var babel             = require("@webpack-blocks/babel6");
var devServer         = require("@webpack-blocks/dev-server");
var HtmlWebpackPlugin = require("html-webpack-plugin");

dotenv.load({ silent: true });

module.exports = webpack.createConfig([
  webpack.entryPoint("./src/index.js"),
  webpack.setOutput("./public/app.js"),
  babel({ presets: ["env", "react"] }),
  webpack.addPlugins([
    new HtmlWebpackPlugin({
      inject: true,
      template: './index.html'
    }),
  ]),
  webpack.defineConstants({
    "process.env.NODE_ENV": process.env.NODE_ENV,
  }),
  webpack.env("development", [
    webpack.sourceMaps(),
    devServer(),
  ]),
]);