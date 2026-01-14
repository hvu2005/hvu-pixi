import { Renderer } from "engine/core/component/renderer";
import { Mesh } from "engine/alias/three-alias";


export class MeshRenderer extends Renderer {
    /**
     * 
     * @param {Mesh} mesh 
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