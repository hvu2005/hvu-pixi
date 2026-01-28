import { GameObject3D, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { BoxGeometry, RepeatWrapping } from "@three.alias";
import { TileEntity } from "scripts/model/TileEntity";


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

    const g = new TileEntity().testGO;


    return go;

    
}

export class RailBehaviour extends MonoBehaviour {
    awake() {
        this.renderer = this.getComponent(MeshRenderer);
        this.offsetX = 0;
        this.offsetY = 0;

        this._createShadow();
        this._createStart();
    }

    start() {
        this.setEndPointMaterial();
        this.setConveyorMaterial();

        this.conveyorMaterial = this.renderer.getMaterial(1);
    }

    update(dt) {
        this.conveyorMaterial.map.offset.y -= 1.15*dt;
    }

    _createShadow() {
        const go = instantiate(GameObject3D, {
            components: [
                new MeshRenderer(new BoxGeometry(19, 0.01, 19), {
                    material: Material.RAIL_SHADOW,
                }),
            ],
            position: [1, -5, 4.6],
            rotation: [Math.PI, Math.PI, 0],
            scale: [-0.95, 1, 1],
        });

        this.gameObject.transform.addChild(go.transform);

        return go;
    }

    _createStart() {
        const go = instantiate(GameObject3D, {
            components: [
                new MeshRenderer(new BoxGeometry(1.6, 0.01, 0.6), {
                    material: Material.START,
                }),
            ],
            position: [5.1, 1, -4.8],
            rotation: [Math.PI, Math.PI/2, 0],
            scale: [1, 1, 1],
        });

        this.gameObject.transform.addChild(go.transform);

        return go;
    }


    setConveyorMaterial() {
        this.renderer.setMaterialAt(1, Material.CONVEYOR);
    }

    setEndPointMaterial() {
        this.renderer.setMaterialAt(2, Material.WARNING);
    }
}
