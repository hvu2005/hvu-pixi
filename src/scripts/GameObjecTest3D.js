import { instantiate, GameObject3D, MeshRenderer } from "engine";
import { Asset } from "./_load-assets.js/AssetLoader";
import { MeshStandardMaterial } from "@three.alias";
import { Material } from "./_load-assets.js/MaterialFactory";



export function GameObjecTest3D() {
    const gameObject = instantiate(GameObject3D, { renderOrder: 2, tag: "GameObjectTest3D" });

    gameObject.addComponent(new MeshRenderer(Asset.MODEL_TRAIN, {
        material: Material.TRAIN, 
        position: [0, 0, 0], 
        scale: [1, 1, 1],
        rotation: [0, 0, 0]
    }));

    const transform = gameObject.transform;
    transform.position.set(0, 2, 0);
    transform.rotation.set(0, 0, 0);
    transform.scale.set(1, 1, 1);

    return gameObject;
}