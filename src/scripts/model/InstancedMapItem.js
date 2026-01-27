import { GameObject3D, InstancedMeshRenderer, MeshRenderer, MonoBehaviour, instantiate } from "engine";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { Color, InstancedBufferAttribute } from "@three.alias";

export function createInstancedMapItem(count) {
    const go = instantiate(GameObject3D, {
        tag: "InstancedMapItem",
        components: [
            new InstancedMapItem(),
            new InstancedMeshRenderer(Asset.MODEL_PIXEL_BLOCK, {
                count: count,
                material: Material.PIXEL_BLOCK
            }),
        ]
    });

    return go;
}

export class InstancedMapItem extends MonoBehaviour {
    awake() {
        this.renderer = this.getComponent(InstancedMeshRenderer);

        /**
         * @type {MapItemObject[][]}
         */
        this.data = {}

        const mesh = this.renderer.getNode()[0].mesh;
        mesh.instanceColor = new InstancedBufferAttribute(
            new Float32Array(this.renderer.count * 3),
            3
        );

        mesh.geometry.setAttribute(
            'instanceShadowTint',
            new InstancedBufferAttribute(
                new Float32Array(this.renderer.count * 3),
                3
            )
        );
    }

    setInstanceTransfrom(index, pos, rot, scale) {
        this.renderer.setInstanceTransform(index, pos, rot, scale);
    }

    getTransformAt(index) {
        return this.renderer.getTransformAt(index);
    }

    setInstanceScale(index, ...scale) {
        this.renderer.setInstanceScale(index, ...scale);
    }

    setShadowColor(index, color) {
        const mesh = this.renderer.getNode()[0].mesh;
        const attr = mesh.geometry.getAttribute('instanceShadowTint');

        if (!attr) return;

        let r, g, b;

        if (color.isColor) {
            r = color.r;
            g = color.g;
            b = color.b;
        } else if (typeof color === 'number') {
            const c = new Color(color);
            r = c.r;
            g = c.g;
            b = c.b;
        } else {
            r = color.r;
            g = color.g;
            b = color.b;
        }

        attr.setXYZ(index, r, g, b);
        attr.needsUpdate = true;
    }

    setColorAt(index, color) {
        this.renderer.setColorAt(index, color);
        // this.renderer.getNode()[0].mesh.instanceColor.needsUpdate = true;
    }
}