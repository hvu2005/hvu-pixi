import { Asset } from "engine/asset/AssetLoader";
import { MonoBehaviour } from "engine/runtime/behaviour/mono-behaviour";
import { instantiate } from "engine/runtime/instantiate";
import { Collider2D } from "engine/runtime/pixi/component/collider-2d";
import { SpriteRenderer } from "engine/runtime/pixi/component/sprite-renderer";
import { GameObject2D } from "engine/runtime/pixi/entity/game-object-2d";


export function GameObjectTest2() {
    const gameObject = instantiate(GameObject2D, {renderOrder: 3, tag: "GameObjectTest2"});
    gameObject.addComponent(new SpriteRenderer(Asset.ITEM));
    gameObject.addComponent(new Collider2D({isSensor: true})); 
    gameObject.transform.position.set(450,  1250, 0);
    gameObject.transform.scale.set(1);

    const child1 = instantiate(GameObject2D);
    child1.addComponent(new SpriteRenderer(Asset.ITEM));
    child1.transform.position.set(0, 0, 0);
    child1.transform.scale.set(0.5);
    gameObject.transform.addChild(child1.transform);

    return gameObject;
}

