import { GameObject3D, MeshRenderer, instantiate } from "engine";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { BoxGeometry } from "three";

export function createTileWait() {
    const go = instantiate(GameObject3D, {
        components: [
            new MeshRenderer(new BoxGeometry(2, 2, 0.01), {
                material: Material.TILE_WAIT,
                rotation: [-Math.PI/3, 0, Math.PI]
            })
        ]
    })
    
    return go;
}

