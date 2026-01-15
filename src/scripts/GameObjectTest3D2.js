import { instantiate, GameObject3D, InstancedMeshRenderer } from "engine";
import { Asset } from "./_load-assets.js/AssetLoader";
import { Material } from "./_load-assets.js/MaterialFactory";


export function GameObjecTest3D2() {
    const gameObject = instantiate(GameObject3D, { renderOrder: 4, tag: "GameObjectTest3D" });

    const instancedMeshRenderer = gameObject.addComponent(new InstancedMeshRenderer(Asset.MODEL_TRAIN, {
        material: Material.TRAIN, 
        count: 1
    }));

    instancedMeshRenderer.setInstancePosition(0, 0, 0, 0);
    instancedMeshRenderer.setInstanceRotation(0, Math.PI / 2, 0, 0);

    const transform = gameObject.transform;
    transform.position.set(-1, -1.5, 0);
    transform.rotation.set(0, 0, 0);
    transform.scale.set(1, 1, 1);

    return gameObject;
}