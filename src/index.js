
import { GameScene } from "scripts/GameScene";


// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    new GameScene();
}
