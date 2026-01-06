
import { pixi } from "engine/core/render/pixi-renderer";
import { three } from "engine/core/render/three-renderer";
import { World } from "engine/core/world";
import { init } from "engine/init";
import { MonoBehaviourSystem } from "engine/runtime/behaviour/mono-behaviour-system";
import { Physic2DSystem } from "engine/runtime/pixi/system/physic-2d-system";
import { Render2DSystem } from "engine/runtime/pixi/system/render-2d-system";
import { Render3DSystem } from "engine/runtime/three/system/render-3d-system";
import { worldContext } from "engine/runtime/world-context";
import { GameObjecTest3D } from "scripts/GameObjecTest3D";
import { GameObjectTest } from "scripts/GameObjectTest";
import { GameObjectTest2 } from "scripts/GameObjectTest2";
import { GameObjecTest3D2 } from "scripts/GameObjectTest3D2";


// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    await init();

    const world = new World({ pixi: pixi, three: three });
    await world.init();
    worldContext.current = world;

    world.createSystem(Render2DSystem);
    world.createSystem(Render3DSystem);
    world.createSystem(MonoBehaviourSystem);
    world.createSystem(Physic2DSystem);

    GameObjectTest();
    GameObjectTest2();
    GameObjecTest3D();
    GameObjecTest3D2();

}
