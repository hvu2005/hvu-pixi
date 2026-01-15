import { Component } from "engine/core/component/base/component";
import { Light as ThreeLight } from "engine/alias/three-alias";

/**
 * @abstract
 */
export class Light3D extends Component {
    constructor() {
        super();
    }
    
    /**
     * @abstract
     * @returns {ThreeLight}
     */
    getNode() {
        throw new Error("Method not implemented.");
    }

    _onAttach() {
        this.gameObject.transform.addRenderNode(this.getNode());
    }

    _onDestroy() {
        this.gameObject.transform.removeRenderNode(this.getNode());
    }
}