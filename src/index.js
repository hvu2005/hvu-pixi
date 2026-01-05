
import { Asset } from "engine/asset/AssetLoader";
import { pixi } from "engine/core/app/pixi-app";
import { World } from "engine/core/world";
import { init } from "engine/init";
import { MonoBehaviourSystem } from "engine/runtime/behaviour/mono-behaviour-system";
import { Physic2DSystem } from "engine/runtime/pixi/system/physic-2d-system";
import { Render2DSystem } from "engine/runtime/pixi/system/render-2d-system";
import { worldContext } from "engine/runtime/world-context";
import { GameObjectTest } from "scripts/GameObjectTest";
import { GameObjectTest2 } from "scripts/GameObjectTest2";


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
    GameObjectTest2();
}
