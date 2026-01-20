import { GameObject3D, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";

export function createMapItem() {
    const go = instantiate(GameObject3D, {
        tag: "MapItem",
        components: [
            new MapItem(),
            new MeshRenderer(Asset.MODEL_PIXEL_BLOCK),
        ]
    });

    return go;
}

export class MapItem extends MonoBehaviour {
    awake() {
        this.renderer = this.getComponent(MeshRenderer);
    }

    setColor(itemColorType) {
        this.renderer.setMaterial(itemColorType);
    }
}