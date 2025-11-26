import { pixiApp, threeApp } from "@engine";
const { GameScene } = require("scene/GameScene");


// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    new GameScene({pixi: pixiApp, three: threeApp, designW: 981, designH: 1230 });
}
