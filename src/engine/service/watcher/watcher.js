import { execSync } from "child_process";


execSync("node src/engine/service/watcher/hot-loader.js", { stdio: "inherit" });