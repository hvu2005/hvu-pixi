import { Renderer } from "engine/core/component/renderer";


export class MeshRenderer extends Renderer {
    constructor(mesh, options = {}) {
        super();

        this.mesh = mesh.clone();
    }

    _onAttach() {
        this.gameObject.transform.addRenderNode(this.mesh);
    }

    _onDestroy() {
        this.gameObject.transform.removeRenderNode(this.mesh);
    }
}