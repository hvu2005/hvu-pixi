
import { Asset } from "engine/asset/AssetLoader";
import { World } from "engine/core/World";
import { pixi } from "engine/core/app/Pixi";
import { init } from "engine/init";import { instantiate } from "engine/runtime/instantiate";
;
import { SpriteRenderer } from "engine/runtime/pixi/component/SpriteRenderer";
import { Transform2D } from "engine/runtime/pixi/component/Transform2D";
import { GameObject2D } from "engine/runtime/pixi/entity/GameObject2D";
import { Render2DSystem } from "engine/runtime/pixi/system/Render2DSystem";
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

    const render2DSystem = world.createSystem(Render2DSystem);

    const gameObject = instantiate(GameObject2D);
    gameObject.addComponent(new SpriteRenderer(Asset.ITEM));
    
    const transform = gameObject.getComponent(Transform2D);
    transform.setPosition(500, 500);
}
