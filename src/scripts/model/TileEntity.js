import { DynamicText3D, GameObject3D, MeshAnimator, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Tag } from "scripts/_config/Tag";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { PathController } from "scripts/controller/PathController";





export function createTileEntity() {
    const go = instantiate(GameObject3D, {
        tag: Tag.TILE_ENTITY,
        components: [
            new MeshRenderer(Asset.MODEL_SQUID, { 
                material: Material.SQUID,
                rotation: [0, Math.PI, 0],
            }),
            new MeshAnimator(Asset.MODEL_SQUID, { 
                // default: 'group3|idle' 
            }),
            new DynamicText3D(Asset.FONT_TEST.texture, Asset.FONT_TEST.font, {
                scale: [0.015, 0.015, 0.015],
                rotation: [-Math.PI / 2.5, 0, 0],
                position: [0, 5, 1.3],
                align: "center",
                color: 0x000000,
                opacity: 1,
                text: "40"
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

        console.log(this.animator)
    }

    start() {
        // this.animator.play('group3|attack_1'); 
    }

    onSelected() {
        this.animator.play('group3|jumb_landing');
        PathController.instance.moveToConveyor(this.gameObject, 0);
    }

    playAttackAnimation() {
        this.animator.play('group3|attack_1');
    }

    setText(text) {
        this.text.setText(text);
    }

    setTextOpacity(opacity) {
        this.text.setOpacity(opacity);
    }

    setColor(itemColorType) {
        this.renderer.setMaterial(itemColorType);
        this._setMouthColor();
        this._setEyeMaterial();
    }

    _setMouthColor() {
        this.renderer.setMaterialAt(1, Material.SQUID_MOUTH);
    }

    _setEyeMaterial() {
        this.renderer.setMaterialAt(2, Material.SQUID_EYE);
    }
}

