
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/engine/pixi.alias.js",
  output: {
    file: "dist/pixi.alias.min.js",
    format: "esm",
    sourcemap: false,
    inlineDynamicImports: true,
  },
  plugins: [resolve(), commonjs(), terser()],
  treeshake: { moduleSideEffects: false },
};
