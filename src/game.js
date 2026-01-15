
import { GameScene } from "scripts/_scene/GameScene";


// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    new GameScene();
}
