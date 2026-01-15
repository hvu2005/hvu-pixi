import { Renderer } from "engine/core/component/renderer";
import { Group, Material } from "engine/alias/three-alias";


export class MeshRenderer extends Renderer {
    /**
     * 
     * @param {Group} mesh 
     * @param {*} options 
     */
    constructor(mesh, options = {}) {
        super();

        this.mesh = mesh.clone();
        this.mesh.position.set(...options.position || [0, 0, 0]);
        this.mesh.rotation.set(...options.rotation || [0, 0, 0]);
        this.mesh.scale.set(...options.scale || [1, 1, 1]);

        if(options.material) {
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
     * 
     * @param {number} index 
     * @param {Material} mat 
     */
    setMaterialAt(index, mat) {
        const mesh = this.getMeshAt(index);
        mesh.material = mat;
    }
    

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