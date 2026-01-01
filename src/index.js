
import { Asset } from "engine/asset/AssetLoader";
import { World } from "engine/core/World";
import { pixi } from "engine/core/app/Pixi";
import { init } from "engine/init";
import { MonoBehaviourSystem } from "engine/runtime/behaviour/MonoBehaviourSystem";
import { Physic2DSystem } from "engine/runtime/pixi/system/Physic2DSystem";
import { Render2DSystem } from "engine/runtime/pixi/system/Render2DSystem";
import { worldContext } from "engine/runtime/worldContext";
import { GameObjectTest } from "scripts/GameObjectTest";


// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    await init();

    const world = new World();
    await world.init({ pixi: pixi });
    worldContext.current = world;

    world.createSystem(Render2DSystem);
    world.createSystem(MonoBehaviourSystem);
    world.createSystem(Physic2DSystem);

    GameObjectTest();
}
