
import { sceneManager } from "../../core/sence/SceneManager";
import { appEngine } from "engine/core/runtime/AppEngine";


export class Scene {
    constructor(options = { pixi, three,designWidth: 981, designHeight: 1230, fov: 70, cameraDepth: 50 }) {
        sceneManager.addScene(this);
        
        appEngine.initScene(options);

    }

    async init() {
        this.sceneTree?.();
    }

    sceneTree() { }


}
