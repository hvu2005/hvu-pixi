
import { Asset } from "engine/asset/AssetLoader";
import { World } from "engine/core/World";
import { pixi } from "engine/core/app/Pixi";
import { init } from "engine/init";
import { create } from "engine/runtime/create";
import { SpriteRenderer } from "engine/runtime/pixi/component/SpriteRenderer";
import { Transform2D } from "engine/runtime/pixi/component/Transform2D";
import { worldContext } from "engine/runtime/worldContext";


// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    await init();

    const world = new World();
    await world.init({ pixi: pixi });
    worldContext.current = world;

    const gameObject = create();
    gameObject.addComponent(new SpriteRenderer(Asset.ITEM));
    
    const transform = gameObject.getComponent(Transform2D);
    transform.setPosition(500, 500);
}
