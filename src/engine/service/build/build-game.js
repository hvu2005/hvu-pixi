import { execSync } from "child_process";

const PLUGIN_PATH = "src/engine/service/build/";

execSync("node " + PLUGIN_PATH + "auto-modules", { stdio: "inherit" });
execSync("node " + PLUGIN_PATH + "auto-validate-components", { stdio: "inherit" });
execSync("node esbuild.config.js", { stdio: "inherit" });
execSync("npx open http://localhost:8080/index.html", { stdio: "inherit" });