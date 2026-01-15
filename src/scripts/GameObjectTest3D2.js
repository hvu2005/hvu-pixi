import { instantiate, GameObject3D, InstancedMeshRenderer, MonoBehaviour } from "engine";
import { Asset } from "./_load-assets/AssetLoader";
import { Material } from "./_load-assets/MaterialFactory";


export function GameObjecTest3D2() {
    const gameObject = instantiate(GameObject3D, { renderOrder: 2, tag: "GameObjectTest3D" });

    gameObject.addComponent(new InstancedMeshRenderer(Asset.MODEL_TRAIN, {
        material: Material.TRAIN, 
        count: 1000
    }));

    gameObject.addComponent(new GameObjectTest3D2Behaviour());

    const transform = gameObject.transform;
    transform.position.set(-5, -1.5, 0);
    transform.rotation.set(0, 0, 0);
    transform.scale.set(0.5, 0.5, 0.5);

    return gameObject;
}

export class GameObjectTest3D2Behaviour extends MonoBehaviour {
    start() {
        this.iMeshRenderer = this.gameObject.getComponent(InstancedMeshRenderer);

        for(let i = 0; i < 100; i++) {
            for(let j = 0; j < 10; j++) {
                this.iMeshRenderer.setInstancePosition(i * 10 + j, j*2 -10, i*2 - 150, 0);
            }
        }
    }

    
}