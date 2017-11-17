var dotenv            = require("dotenv");
var webpack           = require("webpack-blocks");
var typescript        = require("@webpack-blocks/typescript");
var HtmlWebpackPlugin = require("html-webpack-plugin");

dotenv.config({ silent: true });

module.exports = webpack.createConfig([
  webpack.entryPoint("./src/index.tsx"),
  webpack.setOutput("./public/app.js"),
  typescript(),
  webpack.addPlugins([
    new HtmlWebpackPlugin({
      inject: true,
      template: "./index.html",
    }),
  ]),
  webpack.defineConstants({
    "process.env.NODE_ENV": process.env.NODE_ENV,
  }),
  webpack.env("development", [
    webpack.sourceMaps(),
    webpack.devServer(),
  ]),
]);