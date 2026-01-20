import { DynamicText3D, GameObject3D, MeshAnimator, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";





export function createTileEntity() {
    const go = instantiate(GameObject3D);

    go.addComponent(new TileEntity());
    go.addComponent(new MeshRenderer(Asset.MODEL_SQUID, { material: Material.SQUID }));
    go.addComponent(new MeshAnimator(Asset.MODEL_SQUID, { default: 'group3|idle' }));
    go.addComponent(new DynamicText3D(Asset.FONT_TEST.texture, Asset.FONT_TEST.font, {
        scale: [0.01, 0.01, 0.01],
        rotation: [-Math.PI / 3, 0, 0],
        position: [0, 5, 2],
        align: "center",
        color: 0x000000,
        opacity: 1,
        text: ""
    }))

    go.transform.position.set(0, 0, 0);

    return go;
}

export class TileEntity extends MonoBehaviour {
    start() {
        this.animator = this.getComponent(MeshAnimator);
        this.animator.play('group3|attack_1');
        this.renderer = this.getComponent(MeshRenderer);
        this.text = this.getComponent(DynamicText3D);

        this.setColor(0x60db9e);
    }

    setColor(color) {
        this.renderer.setMatAttribute('color', color);
        this.setMouthColor();
        this.setEyeMaterial();
    }

    setMouthColor() {
        this.renderer.setMatAttributeAt(1, 'color', 0xe68398);
        this.renderer.setMatAttributeAt(1, 'shadowColor', 0x660015);
    }

    setEyeMaterial() {
        this.renderer.setMaterialAt(2, Material.SQUID_EYE);
    }


}

