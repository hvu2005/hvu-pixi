import { GameObject3D, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";

export function createMapItem() {
    const go = instantiate(GameObject3D);

    go.addComponent(new MeshRenderer(Asset.MODEL_PIXEL_BLOCK));
    go.addComponent(new MapItem());

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