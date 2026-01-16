import { Renderer } from "engine/core/component/renderer";
import { Material, GLTF, SkeletonUtils, Mesh } from "engine/alias/three-alias";


export class MeshRenderer extends Renderer {
    /**
     * 
     * @param {GLTF} gltf 
     * @param {*} options 
     */
    constructor(gltf, options = {}) {
        super();

        this.mesh = SkeletonUtils.clone(gltf.scene);

        this.mesh.position.set(...options.position || [0, 0, 0]);
        this.mesh.rotation.set(...options.rotation || [0, 0, 0]);
        this.mesh.scale.set(...options.scale || [1, 1, 1]);

        if (options.material) {
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    child.material = options.material;
                }
            });
        }
    }

    /**
     * 
     * @param {Material} material 
     */
    setMaterial(material) {
        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
            }
        });
    }

    /**
     * 
     * @param {number} index 
     * @returns {Mesh}
     */
    getMeshAt(index) {
        let i = 0;
        let found = null;

        this.mesh.traverse(node => {
            if (found) return;
            if (node.isMesh) {
                if (i === index) found = node;
                i++;
            }
        });

        return found;
    }

    /**
     * @private
     * @param {Mesh} mesh 
     * @returns 
     */
    _ensureLocalMaterial(mesh) {
        if (!mesh.material) return;

        if (!mesh.material.__isLocal) {
            const local = mesh.material.clone();
            local.__isLocal = true;
            mesh.material = local;
        }
    }

    /**
     * @param {string} param
     * @param {*} value
     */
    setMatParam(param, value) {
        this.mesh.traverse(child => {
            if (!child.isMesh || child.material?.__isLocal) return;

            if (!(param in child.material)) {
                console.warn(`Material param ${param} not found`);
                return;
            }

            this._ensureLocalMaterial(child);

            const target = child.material[param];

            // color / vector
            if (target?.set) {
                target.set(value);
            }
            // scalar (opacity, roughness, metalness…)
            else {
                child.material[param] = value;
            }
        });
    }

    /**
     * @param {number} index
     * @param {string} param
     * @param {*} value
     */
    setMatParamAt(index, param, value) {
        const mesh = this.getMeshAt(index);
        if (!(param in mesh.material)) {
            console.warn(`Material param ${param} not found`);
            return;
        }

        this._ensureLocalMaterial(mesh);

        const target = mesh.material[param];

        // color / vector
        if (target?.set) {
            target.set(value);
        }
        // scalar (opacity, roughness, metalness…)
        else {
            mesh.material[param] = value;
        }
    }

    /**
     * @param {string} param
     * @returns {*|null}
     */
    getMatParam(param) {
        let result = null;

        this.mesh.traverse(child => {
            if (result !== null) return;
            if (!child.isMesh || !child.material) return;
            if (!(param in child.material)) return;

            const value = child.material[param];

            // Color / Vector → trả clone để tránh mutate ngoài ý muốn
            if (value?.clone) {
                result = value.clone();
            }
            // scalar / boolean / number
            else {
                result = value;
            }
        });

        return result;
    }

    /**
     * @param {number} index
     * @param {string} param
     * @returns {*|null}
     */
    getMatParamAt(index, param) {
        const mesh = this.getMeshAt(index);
        if (!mesh || !mesh.isMesh || !mesh.material) return null;
        if (!(param in mesh.material)) return null;

        const value = mesh.material[param];

        // Color / Vector → clone để tránh mutate ngoài
        if (value?.clone) {
            return value.clone();
        }

        return value;
    }



    /**
     * 
     * @param {number} index 
     * @param {Material} mat 
     */
    setMaterialAt(index, mat) {
        const mesh = this.getMeshAt(index);
        mesh.material = mat;
    }

    /**
     * 
     * @returns {Mesh}
     */
    getNode() {
        return this.mesh;
    }

    _onAttach() {
        this.gameObject.transform.addRenderNode(this.mesh);
    }

    _onDestroy() {
        this.gameObject.transform.removeRenderNode(this.mesh);
    }
}