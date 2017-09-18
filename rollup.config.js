import buble from "rollup-plugin-buble";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/index.js", format: "cjs" },
    { file: "dist/index.es.js", format: "es" },
  ],
  exports: "named",
  external: [
    "react",
    "object.omit",
    "path-to-regexp",
    "history/createBrowserHistory",
  ],
  plugins: [
    resolve({ jsnext: true }),
    buble({
      objectAssign: "Object.assign",
    }),
  ],
}