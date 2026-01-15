import { Light3D } from "./abstract/light-3d";
import { DirectionalLight as ThreeDirectionalLight } from "engine/alias/three-alias";


export class DirectionalLight extends Light3D {
    constructor(color = 0xffffff, intensity = 1) {
        super();

        this._light = new ThreeDirectionalLight(color, intensity);
    }

    /**
     * 
     * @returns {ThreeDirectionalLight}
     */
    getNode() {
        return this._light;
    }
}