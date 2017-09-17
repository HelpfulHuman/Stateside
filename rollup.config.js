import buble from "rollup-plugin-buble";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "./src/index.js",
  output: [
    { file: "./dist/index.js", format: "cjs" },
    { file: "./dist/index.es.js", format: "es" },
  ],
  plugins: [
    resolve({ jsnext: true }),
    buble(),
  ],
}