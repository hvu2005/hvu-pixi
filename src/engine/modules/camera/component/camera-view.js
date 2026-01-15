import { Component } from "engine/core/component/base/component";
import { Camera, OrthographicCamera, PerspectiveCamera } from "engine/alias/three-alias";



/**
 * @typedef {Object} CameraOptions
 * @property {boolean} [isOrthor]
 * @property {number} [fov]
 * @property {number} [aspect]
 * @property {number} [near]
 * @property {number} [far]
 * @property {number[]} [lookAt]
 * @property {number[]} [position]
 */

export class CameraView extends Component {
    /**
     * 
     * @param {CameraOptions} options 
     */
    constructor(options) {
        super();

        /**
         * @private
         * @type {Camera}
         */
        this._camera;


        if (options.isOrthor) {
            const aspect = options.aspect || window.innerWidth / window.innerHeight;
            const fov = options.fov || 75;

            const defaultOptions = [
                options.left || -fov * aspect,
                options.right || fov * aspect,
                options.top || fov,
                options.bottom || -fov,
                options.near || 0.1,
                options.far || 1000,
            ];
            this._camera = new OrthographicCamera(...defaultOptions);
        }
        else {
            const defaultOptions = [
                options.fov || 75,
                options.aspect || window.innerWidth / window.innerHeight,
                options.near || 0.1,
                options.far || 1000,
            ];
            this._camera = new PerspectiveCamera(...defaultOptions);
        }
        this._camera.lookAt(...(options.lookAt ?? [0, 0, 0]));
        this._camera.position.set(...(options.position ?? [0, 0, 10]));
    }

    _onAttach() {
        this.gameObject.transform.addRenderNode(this._camera);
    }

    /**
     * 
     * @returns {Camera}
     */
    getNode() {
        return this._camera;
    }
}