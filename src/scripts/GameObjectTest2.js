import { Asset } from "engine/asset/AssetLoader";
import { MonoBehaviour } from "engine/runtime/behaviour/MonoBehaviour";
import { instantiate } from "engine/runtime/instantiate";
import { Collider2D } from "engine/runtime/pixi/component/Collider2D";
import { SpriteRenderer } from "engine/runtime/pixi/component/SpriteRenderer";
import { GameObject2D } from "engine/runtime/pixi/entity/GameObject2D";


export function GameObjectTest2() {
    const gameObject = instantiate(GameObject2D);
    gameObject.addComponent(new SpriteRenderer(Asset.ITEM));
    gameObject.addComponent(new Collider2D({isSensor: false}));
    gameObject.transform.position.set(450,  1250, 0);
    gameObject.transform.scale.set(1);

    const child1 = instantiate(GameObject2D);
    child1.addComponent(new SpriteRenderer(Asset.ITEM));
    child1.transform.position.set(0, 0, 0);
    child1.transform.scale.set(0.5);
    gameObject.transform.addChild(child1.transform);

    return gameObject;
}

