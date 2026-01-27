import { GameObject3D, MeshRenderer, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { BoxGeometry } from "three";



export function createInkSplash() {
    const go = instantiate(GameObject3D, {
        components: [
            new MeshRenderer(new BoxGeometry(2, 0.01, 2), {
                material: Material.INK,
                scale: [1, 1, 1],
                rotation: [Math.PI / 2.5, 0, 0]
            }),
        ]
    })

    return go;
}