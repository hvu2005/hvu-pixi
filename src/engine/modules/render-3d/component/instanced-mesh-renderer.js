import { Renderer } from "engine/core/component/renderer";
import { Group, InstancedMesh, Material, Object3D } from "engine/alias/three-alias";



/**
 * @typedef {Object} InstancedMeshRendererOptions
 * @property {number} count
 * @property {Material} [material]
 */

export class InstancedMeshRenderer extends Renderer {
    /**
     * 
     * @param {Group} sourceMesh 
     * @param {InstancedMeshRendererOptions} options 
     */
    constructor(sourceMesh, options) {
        super();

        this.groupMesh = sourceMesh.clone();
        this.count = options.count;

        let mesh = null;
        sourceMesh.traverse(obj => { 
            if (obj.isMesh && !mesh) mesh = obj;
        });
        this.instancedMesh = new InstancedMesh(mesh.geometry, options.material, this.count);
        this.instancedMesh.frustumCulled = false;

        this._dummy = new Object3D();

        // init identity matrix
        for (let i = 0; i < this.count; i++) {
            this._dummy.position.set(0, 0, 0);
            this._dummy.rotation.set(0, 0, 0);
            this._dummy.scale.set(1, 1, 1);
            this._dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, this._dummy.matrix);
        }
        this.instancedMesh.instanceMatrix.needsUpdate = true;
        // this.instancedMesh.material.needsUpdate = true;
    }

    /**
     * Sets the position of an instance.
     * @param {number} index - The index of the instance.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} z - Z position.
     */
    setInstancePosition(index, x, y, z) {
        this._assertIndex(index);

        this.instancedMesh.getMatrixAt(index, this._dummy.matrix);
        this._dummy.matrix.decompose(
            this._dummy.position,
            this._dummy.quaternion,
            this._dummy.scale
        );

        this._dummy.position.set(x, y, z);
        this._dummy.updateMatrix();

        this.instancedMesh.setMatrixAt(index, this._dummy.matrix);
        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    /**
     * Sets the rotation (Euler angles) of an instance.
     * @param {number} index - The index of the instance.
     * @param {number} x - Rotation around X axis (radians).
     * @param {number} y - Rotation around Y axis (radians).
     * @param {number} z - Rotation around Z axis (radians).
     */
    setInstanceRotation(index, x, y, z) {
        this._assertIndex(index);

        // lấy matrix hiện tại
        this.instancedMesh.getMatrixAt(index, this._dummy.matrix);

        // tách transform cũ
        this._dummy.matrix.decompose(
            this._dummy.position,
            this._dummy.quaternion,
            this._dummy.scale
        );

        // set rotation mới (Euler)
        this._dummy.rotation.set(x, y, z);
        this._dummy.updateMatrix();

        // ghi lại
        this.instancedMesh.setMatrixAt(index, this._dummy.matrix);
        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    /**
     * Sets the scale of an instance.
     * @param {number} index - The index of the instance.
     * @param {number} sx - Scale on X axis.
     * @param {number} [sy=sx] - Scale on Y axis.
     * @param {number} [sz=sx] - Scale on Z axis.
     */
    setInstanceScale(index, sx, sy = sx, sz = sx) {
        this._assertIndex(index);

        this.instancedMesh.getMatrixAt(index, this._dummy.matrix);
        this._dummy.matrix.decompose(
            this._dummy.position,
            this._dummy.quaternion,
            this._dummy.scale
        );

        this._dummy.scale.set(sx, sy, sz);
        this._dummy.updateMatrix();

        this.instancedMesh.setMatrixAt(index, this._dummy.matrix);
        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    /**
     * @param {Material} material
     */
    setMaterial(material) {
        this.instancedMesh.material = material;
    }

    /**
     * 
     * @returns {InstancedMesh}
     */
    getNode() {
        return this.instancedMesh;
    }

    _onAttach() {
        this.gameObject.transform.addRenderNode(this.instancedMesh);
    }

    _onDestroy() {
        this.gameObject.transform.removeRenderNode(this.instancedMesh);
        this.instancedMesh.dispose();
    }


    /**
     * @private
     * @param {number} index 
     */
    _assertIndex(index) {
        if (index < 0 || index >= this.count) {
            throw new Error(
                `[InstancedMeshRenderer] instance index out of range: ${index}`
            );
        }
    }
}