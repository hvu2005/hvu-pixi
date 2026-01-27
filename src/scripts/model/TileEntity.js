import { DynamicText3D, GameObject3D, MeshAnimator, MeshRenderer, MonoBehaviour, Transform3D, instantiate } from "engine";
import { Tag } from "scripts/_config/Tag";
import { eventEmitter } from "scripts/_core/EventEmitter";
import { Asset } from "scripts/_load-assets/AssetLoader";
import { Material } from "scripts/_load-assets/MaterialFactory";
import { PathController } from "scripts/controller/PathController";
import { BoxGeometry, Euler, Quaternion, SphereGeometry, Vector3 } from "@three.alias";
import { property } from "engine/core/decorator/property";





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
            new TileEntity({testNumber: 1})
        ],
    });

    const shadow = instantiate(GameObject3D, {
        tag: "Trail",
        components: [
            new MeshRenderer(new BoxGeometry(3, 0.01, 2.5), {
                material: Material.SQUID_SHADOW,
            }),
        ],
        position: [0.1, -4, -1.1],
        rotation: [Math.PI, Math.PI, 0],
        scale: [-0.95, 1.2, 1],
    });

    go.transform.addChild(shadow.transform);


    return go;
}

export class TileEntityTest extends GameObject3D {
    components() {
        this.add.mesh(Asset.MODEL_SQUID);
        this.add.text3D(Asset.FONT_TEST);
        this.add.animator(Asset.MODEL_SQUID);
        this.add.behaviour(new TileEntity());
    }

    hierarchy() {
        const shadow = instantiate(GameObject3D);
        this.add.child(shadow);
    }
}




export class TileEntity extends MonoBehaviour {

    @property(GameObject3D) testGO;
    @property('number') testNumber;

    awake() {
        this.animator = this.getComponent(MeshAnimator);
        this.renderer = this.getComponent(MeshRenderer);
        this.text = this.getComponent(DynamicText3D);
        this.isSelectable = false;

        this.mouthPoint = this._createMouthPoint();
        /**
         * @type {TileObject}
         */
        this.data = {}

        this.mouthPosition = new Vector3();

        this.shadow = this._createShadow();
    }

    _createShadow() {
        const go = instantiate(GameObject3D, {
            tag: "Trail",
            components: [
                new MeshRenderer(new BoxGeometry(3, 0.01, 2.5), {
                    material: Material.SQUID_SHADOW,
                }),
            ],
            position: [0.1, -4, -1.1],
            rotation: [Math.PI, Math.PI, 0],
            scale: [-0.95, 1.2, 1],
        });

        this.gameObject.transform.addChild(go.transform);

        return go;
    }

    hideShadow() {
        this.shadow.setActive(false);
    }

    setData(data) {
        this.data = data;

        this.maxCountColorFill = data.countColorFill;
        this.count = data.countColorFill;
    }

    setFirst() {
        this.isSelectable = true;
    }

    start() {
        // this.animator.play('group3|attack_1'); 
        this.gameObject.transform.on(Transform3D.ROTATION_CHANGED, this.onRotationChanged.bind(this));

        // this.gameObject.transform.rotation.set(0, Math.PI, Math.PI/2);


    }

    onRotationChanged() {
        if (!this.text?.getNode()) return;

        const node = this.text.getNode();
        const parent = node.parent;
        if (!parent) return;

        // ===== 1️⃣ OFFSET mong muốn theo TRỤC BAN ĐẦU (world axis)
        const worldOffset = new Vector3(0, 5, 1.3);

        // ===== 2️⃣ Chuyển world offset → local offset
        const parentWorldQuat = parent.getWorldQuaternion(new Quaternion());
        const invParentQuat = parentWorldQuat.clone().invert();

        const localOffset = worldOffset.clone().applyQuaternion(invParentQuat);
        node.position.copy(localOffset);

        // ===== 3️⃣ WORLD rotation X cố định cho text
        const targetWorldQuat = new Quaternion().setFromEuler(
            new Euler(-Math.PI / 2, 0, 0)
        );

        const localRot = invParentQuat.multiply(targetWorldQuat);
        node.quaternion.copy(localRot);
    }

    _createMouthPoint() {
        const go = instantiate(GameObject3D, {
            tag: "MouthPoint",
            position: [0, 1.05, -1],
            components: [
                // new MeshRenderer(new SphereGeometry(0.2), {
                //     material: Material.RED,
                // }),
            ]
        });
        this.gameObject.transform.addChild(go.transform);

        return go;
    }

    getMouthPosition() {
        const node = this.mouthPoint.transform.getNode();
        node.updateMatrixWorld(true);


        // offset +2 theo trục Z LOCAL của node
        // this.mouthPosition.set(0, 0, 2);


        // convert sang world (rotation + scale + parent đều áp)
        node.getWorldPosition(this.mouthPosition);

        return this.mouthPosition;
    }

    playAttackAnimation() {
        this.animator.play('group3|attack_loop');
    }

    playLandingAnimation() {
        this.animator.play('group3|jumb_landing');
    }

    playInvalidClickAnimation() {
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

