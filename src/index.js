
import { pixi } from "engine/core/render/pixi-renderer";
import { three } from "engine/core/render/three-renderer";
import { init } from "engine/init";
import { MonoBehaviourSystem } from "engine/runtime/behaviour/mono-behaviour-system";
import { Physic2DSystem } from "engine/runtime/physic-2d/physic-2d-system";
import { Render2DSystem } from "engine/runtime/pixi/system/render-2d-system";
import { Render3DSystem } from "engine/runtime/three/system/render-3d-system";
import { createWorld } from "engine/service/world-context";
import { GameObjecTest3D } from "scripts/GameObjecTest3D";
import { GameObjectTest } from "scripts/GameObjectTest";
import { GameObjectTest2 } from "scripts/GameObjectTest2";
import { GameObjecTest3D2 } from "scripts/GameObjectTest3D2";
import { GameScene } from "scripts/GameScene";


// Asynchronous IIFE
(async () => {
    await startGame();

})();

async function startGame() {
    new GameScene();

}
