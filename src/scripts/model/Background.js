import { BoxGeometry } from "@three.alias";
import { GameObject3D, MeshRenderer, instantiate } from "engine";
import { Material } from "scripts/_load-assets/MaterialFactory";





export function createBackground() {
    const go = instantiate(GameObject3D, {
        components: [
            new MeshRenderer(new BoxGeometry(20, 35, 0.01), {
                material: Material.BACKGROUND,
            }),
        ],
        rotation: [-Math.PI / 3, 0, Math.PI],
        position: [0, -50, -19.3]
    })
    return go;
}