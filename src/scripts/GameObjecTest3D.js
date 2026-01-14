import { instantiate, GameObject3D, MeshRenderer } from "engine";
import * as THREE from "three";
import { Asset } from "./AssetLoader";



export function GameObjecTest3D() {
    const gameObject = instantiate(GameObject3D, { renderOrder: 2, tag: "GameObjectTest3D" });

    const material = new THREE.MeshBasicMaterial({ 
        map: Asset.TEXTURE_TRAIN,
    });
    gameObject.addComponent(new MeshRenderer(Asset.MODEL_TRAIN, {
        material: material, 
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