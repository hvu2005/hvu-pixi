
import { Asset } from "engine/asset/AssetLoader";
import { World } from "engine/core/World";
import { pixi } from "engine/core/app/Pixi";
import { init } from "engine/init";
import { MonoBehaviour } from "engine/runtime/behaviour/MonoBehaviour";
import { MonoBehaviourSystem } from "engine/runtime/behaviour/MonoBehaviourSystem";
import { instantiate } from "engine/runtime/instantiate";
import { SpriteRenderer } from "engine/runtime/pixi/component/SpriteRenderer";
import { Transform2D } from "engine/runtime/pixi/component/Transform2D";
import { GameObject2D } from "engine/runtime/pixi/entity/GameObject2D";
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

    // const gameObject = instantiate(GameObject2D);
    // gameObject.addComponent(new MonoBehaviour());
    // gameObject.addComponent(new SpriteRenderer(Asset.ITEM));
    
    // const transform = gameObject.getComponent(Transform2D);
    // transform.setPosition(150, 150);

    GameObjectTest();

}
