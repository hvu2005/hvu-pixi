const { pixi } = require("engine/core/app/Pixi");
const { init } = require("engine/init");

import { Asset } from "engine/asset/AssetLoader";
import { Behaviour } from "engine/core/components/behaviour/Behaviour";
import { SpriteRenderer } from "engine/core/components/renderer/SpriteRenderer";
import { Entity2D } from "engine/core/entities/Entity2D";
import { createEntityTest } from "scripts/EntityTest";

// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    await init({pixi: pixi});   

    createEntityTest();

}
