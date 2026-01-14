import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: [
    path.join(__dirname, "engine.js"),
  ],
  outbase: __dirname,
  outdir: path.join(__dirname, "dist"),
  bundle: true,
  format: "esm",
  platform: "browser",
  sourcemap: true,
});