import { GameObject3D, MeshRenderer, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";



export function createProjectile() {
    const go = instantiate(GameObject3D, {
        components: [
            new MeshRenderer(Asset.MODEL_PROJECTILE, {
                material: Material.PROJECTILE,
                scale: [0.2, 0.2, 0.2]
            }),
        ]
    })

    return go;
}