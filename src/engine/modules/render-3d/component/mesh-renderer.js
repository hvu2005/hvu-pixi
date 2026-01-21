import { Renderer } from "engine/core/component/renderer";
import { Material, GLTF, SkeletonUtils, Mesh } from "engine/alias/three-alias";


export class MeshRenderer extends Renderer {
    /**
     * 
     * @param {GLTF | BufferGeometry} source 
     * @param {*} options 
     */
    constructor(source, options = {}) {
        super();

        this.mesh = this._createMesh(source, options.material);

        options.position && this.mesh.position.set(...options.position);
        options.rotation && this.mesh.rotation.set(...options.rotation);
        options.scale && this.mesh.scale.set(...options.scale);
    }

    /**
     * @private
     * @param {GLTF | BufferGeometry} source 
     * @param {Material} material 
     * @returns {Mesh | Object3D}
     */
    _createMesh(source, material) {
        // GLTF
        if (source?.scene) {
            const node = SkeletonUtils.clone(source.scene);

            if(material) {
                node.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;
                    }
                });
            }
            return node;
        }
        // Geometry
        else if (source?.isBufferGeometry) {
            return new Mesh(source, material);
        }

        throw new Error("MeshRenderer: unsupported source type");
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
     * @param {string} param
     * @param {*} value
     */
    setMatAttribute(param, value) {
        this.mesh.traverse(child => {
            if (!child.isMesh) return;

            if (!(param in child.material)) {
                console.warn(`Material param ${param} not found`);
                return;
            }

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
    setMatAttributeAt(index, param, value) {
        const mesh = this.getMeshAt(index);
        if (!(param in mesh.material)) {
            console.warn(`Material param ${param} not found`);
            return;
        }

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
    getMatAttribute(param) {
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
    getMatAttributeAt(index, param) {
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

    getMaterial(index = 0) {
        return this.getMeshAt(index).material;
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