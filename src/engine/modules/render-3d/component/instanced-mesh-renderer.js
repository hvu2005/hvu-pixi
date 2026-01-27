import { Renderer } from "engine/core/component/renderer";
import { 
    InstancedMesh, 
    Matrix4, 
    Quaternion, 
    Vector3, 
    GLTF,
    Color,
    Euler
} from "engine/alias/three-alias";

// Biến tạm để tính toán, tránh tạo mới Object mỗi frame (Optimization)
const _tempMatrix = new Matrix4();
const _instanceMatrix = new Matrix4();
const _position = new Vector3();
const _quaternion = new Quaternion();
const _scale = new Vector3();
const _color = new Color();

/**
 * @typedef {Object} InstancedMeshRendererOptions
 * @property {number} count
 * @property {Material} [material] - Nếu có, tất cả các mesh sẽ dùng chung material này
 */

/**
 * @typedef {Object} InstanceData
 * @property {Mesh} mesh
 * @property {Matrix4} offset
 */

export class InstancedMeshRenderer extends Renderer {
    /**
     * @param {GLTF} gltf 
     * @param {InstancedMeshRendererOptions} options 
     */
    constructor(gltf, options) {
        super();

        this.count = options.count;
        /** @type {Array<{mesh: InstancedMesh, offset: Matrix4}>} */
        this.instanceData = [];

        const sourceMesh = gltf.scene;
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

                // 4. Nếu mesh hỗ trợ, tạo mảng màu (Color) cho instancing
                if (iMesh.instanceColor) {
                    for (let j = 0; j < this.count; j++) {
                        iMesh.setColorAt(j, obj.material && obj.material.color ? obj.material.color : new Color(1, 1, 1));
                    }
                    iMesh.instanceColor.needsUpdate = true;
                }

                this.instanceData.push({
                    mesh: iMesh,
                    offset: offset
                });
            }
        });
    }

    /**
     * 
     * @returns 
     */
    getNode() {
        return this.instanceData;
    }

    /**
     * Cập nhật đầy đủ Transform cho một instance.
     * Đây là cách hiệu quả nhất để update.
     */
    setInstanceTransform(index, position, rotation, scale) {
        this._assertIndex(index);

        // Tạo ma trận transform chung cho instance từ pos, rot, scale
        _instanceMatrix.compose(
            new Vector3(position.x, position.y, position.z), 
            rotation instanceof Quaternion ? rotation : _quaternion.setFromEuler(new Euler(rotation.x, rotation.y, rotation.z)), 
            new Vector3(scale.x, scale.y, scale.z)
        );

        // Áp dụng cho từng sub-mesh kèm theo offset của nó
        for (let i = 0; i < this.instanceData.length; i++) {
            const data = this.instanceData[i];
            _tempMatrix.multiplyMatrices(_instanceMatrix, data.offset);
            data.mesh.setMatrixAt(index, _tempMatrix);
            data.mesh.instanceMatrix.needsUpdate = true;
        }
    }

    getTransformAt(index) {
        this._assertIndex(index);
    
        const mesh = this.instanceData[0].mesh;
    
        mesh.updateMatrixWorld(true);
    
        mesh.getMatrixAt(index, _tempMatrix);
        _tempMatrix.premultiply(mesh.matrixWorld);
    
        _tempMatrix.decompose(_position, _quaternion, _scale);
    
        return {
            position: {
                x: _position.x,
                y: _position.y,
                z: _position.z
            },
            rotation: {
                x: _quaternion.x,
                y: _quaternion.y,
                z: _quaternion.z,
                w: _quaternion.w
            },
            scale: {
                x: _scale.x,
                y: _scale.y,
                z: _scale.z
            }
        };
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
     * Cập nhật rotation (Euler angle, radian đơn vị) nhưng giữ nguyên position và scale hiện tại của Instance.
     * @param {number} index
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setInstanceRotation(index, x, y, z) {
        this._assertIndex(index);

        this.instanceData[0].mesh.getMatrixAt(index, _tempMatrix);

        // Loại bỏ offset
        const invOffset = new Matrix4().copy(this.instanceData[0].offset).invert();
        _instanceMatrix.multiplyMatrices(_tempMatrix, invOffset);

        _instanceMatrix.decompose(_position, _quaternion, _scale);

        // Set rotation mới (Euler; xyz in radians)
        const newQuat = _quaternion.setFromEuler(new Euler(x, y, z));

        this.setInstanceTransform(index, _position, newQuat, _scale);
    }

    /**
     * Cập nhật scale nhưng giữ nguyên position và rotation hiện tại của Instance.
     * @param {number} index
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setInstanceScale(index, x, y, z) {
        this._assertIndex(index);

        this.instanceData[0].mesh.getMatrixAt(index, _tempMatrix);

        // Loại bỏ offset
        const invOffset = new Matrix4().copy(this.instanceData[0].offset).invert();
        _instanceMatrix.multiplyMatrices(_tempMatrix, invOffset);

        _instanceMatrix.decompose(_position, _quaternion, _scale);

        // Set scale mới
        _scale.set(x, y, z);

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

    /**
     * Đặt màu cho instance thứ index trên tất cả submesh.
     * @param {number} index
     * @param {Color|number|string|Array} color - Có thể truyền Color, hex, RGB array, hoặc chuỗi màu.
     */
    setColorAt(index, color) {
        this._assertIndex(index);
        // Đảm bảo color là một instance của Color
        if (color instanceof Color) {
            _color.copy(color);
        } else if (typeof color === "number") {
            _color.setHex(color);
        } else if (Array.isArray(color)) {
            _color.setRGB(...color);
        } else if (typeof color === "string") {
            _color.set(color);
        } else if (color && typeof color === "object" && "r" in color && "g" in color && "b" in color) {
            _color.setRGB(color.r, color.g, color.b);
        } else {
            _color.set(0xffffff);
        }
        let didSet = false;
        for (let i = 0; i < this.instanceData.length; i++) {
            const mesh = this.instanceData[i].mesh;
            if (mesh.setColorAt) {
                mesh.setColorAt(index, _color);
                if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
                didSet = true;
            }
        }
        return didSet;
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