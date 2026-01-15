import { Light3D } from "./abstract/light-3d";
import { AmbientLight as ThreeAmbientLight } from "engine/alias/three-alias";


export class AmbientLight extends Light3D {
    constructor(color = 0xffffff, intensity = 1) {
        super();

        this._light = new ThreeAmbientLight(color, intensity);
    }

    /**
     * 
     * @returns {ThreeAmbientLight}
     */
    getNode() {
        return this._light;
    }

}