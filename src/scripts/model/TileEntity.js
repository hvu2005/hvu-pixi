import { DynamicText3D, GameObject3D, MeshAnimator, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";





export function createTileEntity() {
    const go = instantiate(GameObject3D, {
        tag: "TileEntity",
        components: [
            new MeshRenderer(Asset.MODEL_SQUID, { material: Material.SQUID }),
            new MeshAnimator(Asset.MODEL_SQUID, { default: 'group3|idle' }),
            new DynamicText3D(Asset.FONT_TEST.texture, Asset.FONT_TEST.font, {
                scale: [0.01, 0.01, 0.01],
                rotation: [-Math.PI / 3, 0, 0],
                position: [0, 5, 2],
                align: "center",
                color: 0x000000,
                opacity: 1,
                text: ""
            }),
            new TileEntity()
        ],
    });

    return go;
}

export class TileEntity extends MonoBehaviour {

    awake() {
        this.animator = this.getComponent(MeshAnimator);
        this.renderer = this.getComponent(MeshRenderer);
        this.text = this.getComponent(DynamicText3D);
    }

    start() {
        this.animator.play('group3|attack_1');
    }

    setColor(itemColorType) {
        this.renderer.setMaterial(itemColorType);
        this.setMouthColor();
        this.setEyeMaterial();
    }

    setMouthColor() {
        this.renderer.setMaterialAt(1, Material.SQUID_MOUTH);
    }

    setEyeMaterial() {
        this.renderer.setMaterialAt(2, Material.SQUID_EYE);
    }


}

