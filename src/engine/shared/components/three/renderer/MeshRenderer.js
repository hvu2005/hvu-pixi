
import { Mesh } from '@three.alias';
import { Component } from '../../base/Component';

/**
 * MeshRenderer
 * Dùng để hiển thị mô hình 3D (Mesh hoặc Model)
 */
export class MeshRenderer extends Component {
    /**
     * @param {Object3D|Mesh} mesh 
     * @param {object} options 
     */
    constructor(mesh, options = {}) {
        super();

        this.mesh = mesh || null;
        this.options = options;

        this.material = options.material || null;
        this.scale = options.scale || 1;
        this.position = options.position || [0, 0, 0];
        this.rotation = options.rotation || [0, 0, 0];
        this.name = options.name || "MeshRenderer";
    }

    /**
     * Gọi khi attach vào GameObject3D
     */
    async __init() {
        if (!this.mesh) {
            console.warn(`[MeshRenderer] mesh is null in ${this.name}`);
            return;
        }

        // Clone nếu là scene/model
        if (!(this.mesh instanceof Mesh)) {
            this.mesh = this.mesh.clone(true);
        }
        

        // Apply transform
        this.mesh.position.set(...this.position);
        this.mesh.rotation.set(...this.rotation);
        this.mesh.scale.set(this.scale, this.scale, this.scale);

        // // Nếu chưa có material → lấy từ materialFactory hoặc mesh sẵn có
        // if (!this.material) {
        //     const matName = this.options.materialName;
        //     if (matName && materialFactory.get(matName)) {
        //         this.material = materialFactory.get(matName);
        //     }
        // }

        // Apply material
        if (this.material) {
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    child.material = this.material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }

        // Add vào GameObject3D (cha)
        if (this.gameObject && this.mesh) {
            this.gameObject._renderer.add(this.mesh);
        }

        this.__inited = true;
    }

    /**
     * Thay đổi material runtime
     */
    setMaterial(material) {
        this.material = material;
        if (this.mesh) {
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                }
            });
        }
    }


    /**
     * Xóa renderer
     */
    _onDestroy() {
        if (this.mesh) {
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose?.();
                    if (child.material && child.material.dispose) child.material.dispose();
                }
            });
            this.mesh.removeFromParent();
            this.mesh = null;
        }
    }

    _onEnable() {
        this.mesh.visible = true;
    }

    _onDisable() {
        this.mesh.visible = false;
    }
}
