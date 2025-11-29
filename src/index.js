const { pixi } = require("engine/core/app/Pixi");
const { init } = require("engine/init");


// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    await init({pixi: pixi});
}
