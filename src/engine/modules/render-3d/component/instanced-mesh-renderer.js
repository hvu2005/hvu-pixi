import { Renderer } from "engine/core/component/renderer";
import { 
    InstancedMesh, 
    Matrix4, 
    Quaternion, 
    Vector3, 
    Object3D, 
    Group 
} from "engine/alias/three-alias";

// Biến tạm để tính toán, tránh tạo mới Object mỗi frame (Optimization)
const _tempMatrix = new Matrix4();
const _instanceMatrix = new Matrix4();
const _position = new Vector3();
const _quaternion = new Quaternion();
const _scale = new Vector3();

/**
 * @typedef {Object} InstancedMeshRendererOptions
 * @property {number} count
 * @property {Material} [material] - Nếu có, tất cả các mesh sẽ dùng chung material này
 */

export class InstancedMeshRenderer extends Renderer {
    /**
     * @param {Group} sourceMesh 
     * @param {InstancedMeshRendererOptions} options 
     */
    constructor(sourceMesh, options) {
        super();

        this.count = options.count;
        /** @type {Array<{mesh: InstancedMesh, offset: Matrix4}>} */
        this.instanceData = [];

        // Đảm bảo ma trận của sourceMesh và các con đã được cập nhật
        sourceMesh.updateMatrixWorld(true);

        // Lấy ma trận nghịch đảo của root để tính toán offset chính xác
        const inverseRootMatrix = new Matrix4().copy(sourceMesh.matrixWorld).invert();

        sourceMesh.traverse(obj => {
            if (obj.isMesh) {
                // 1. Tính toán offset matrix của mesh con so với root
                // Offset = Inverse(RootWorldMatrix) * MeshWorldMatrix
                const offset = obj.matrixWorld.clone().premultiply(inverseRootMatrix);

                // 2. Tạo InstancedMesh cho mesh con này
                const iMesh = new InstancedMesh(
                    obj.geometry,
                    options.material || obj.material,
                    this.count
                );
                iMesh.frustumCulled = false;

                // 3. Khởi tạo vị trí ban đầu (tại gốc tọa độ nhưng giữ offset)
                for (let i = 0; i < this.count; i++) {
                    iMesh.setMatrixAt(i, offset);
                }
                iMesh.instanceMatrix.needsUpdate = true;

                this.instanceData.push({
                    mesh: iMesh,
                    offset: offset
                });
            }
        });
    }

    /**
     * Cập nhật đầy đủ Transform cho một instance.
     * Đây là cách hiệu quả nhất để update.
     */
    setInstanceTransform(index, position, rotation, scale) {
        this._assertIndex(index);

        // Tạo ma trận transform chung cho instance từ pos, rot, scale
        _instanceMatrix.compose(
            position, 
            rotation instanceof Quaternion ? rotation : _quaternion.setFromEuler(rotation), 
            scale || _scale.set(1, 1, 1)
        );

        // Áp dụng cho từng sub-mesh kèm theo offset của nó
        for (let i = 0; i < this.instanceData.length; i++) {
            const data = this.instanceData[i];
            _tempMatrix.multiplyMatrices(_instanceMatrix, data.offset);
            data.mesh.setMatrixAt(index, _tempMatrix);
            data.mesh.instanceMatrix.needsUpdate = true;
        }
    }

    /**
     * Cập nhật vị trí nhưng vẫn giữ nguyên Rotation và Scale hiện tại của Instance
     */
    setInstancePosition(index, x, y, z) {
        this._assertIndex(index);

        // Lấy matrix hiện tại của mesh đầu tiên để decompose lấy rot/scale
        this.instanceData[0].mesh.getMatrixAt(index, _tempMatrix);
        
        // Loại bỏ offset của mesh đầu tiên để lấy transform gốc của instance
        const invOffset = new Matrix4().copy(this.instanceData[0].offset).invert();
        _instanceMatrix.multiplyMatrices(_tempMatrix, invOffset);
        
        _instanceMatrix.decompose(_position, _quaternion, _scale);

        // Set vị trí mới và giữ các thông số cũ
        _position.set(x, y, z);
        this.setInstanceTransform(index, _position, _quaternion, _scale);
    }

    /**
     * @param {Material} material
     */
    setMaterial(material) {
        for (let i = 0; i < this.instanceData.length; i++) {
            this.instanceData[i].mesh.material = material;
        }
    }

    _onAttach() {
        for (let i = 0; i < this.instanceData.length; i++) {
            this.gameObject.transform.addRenderNode(this.instanceData[i].mesh);
        }
    }

    _onDestroy() {
        for (let i = 0; i < this.instanceData.length; i++) {
            const iMesh = this.instanceData[i].mesh;
            this.gameObject.transform.removeRenderNode(iMesh);
            iMesh.dispose();
        }
        this.instanceData = [];
    }

    _assertIndex(index) {
        if (index < 0 || index >= this.count) {
            throw new Error(`[InstancedMeshRenderer] index out of range: ${index}`);
        }
    }
}