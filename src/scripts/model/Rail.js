import { GameObject3D, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { RepeatWrapping } from "@three.alias";


export function createRail() {
    const go = instantiate(GameObject3D, {
        tag: "Trail",
        components: [
            new MeshRenderer(Asset.MODEL_RAIL, { 
                material: Material.RAIL,
            }),
            new RailBehaviour(),
        ],
        position: [-0.3, 0, -7],
        rotation: [0, Math.PI, 0],
    });
    return go;
}

export class RailBehaviour extends MonoBehaviour {
    awake() {
        this.renderer = this.getComponent(MeshRenderer);
        this.offsetX = 0;
        this.offsetY = 0;
    }

    start() {
        this.setEndPointMaterial();
        this.setConveyorMaterial()
    }


    setConveyorMaterial() {
        this.renderer.setMaterialAt(1, Material.CONVEYOR);
    }

    setEndPointMaterial() {
        this.renderer.setMaterialAt(2, Material.WARNING);
    }
}
