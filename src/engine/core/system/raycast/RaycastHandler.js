
import { PostSystem } from '../base/PostSystem';
import { appEngine, camera } from 'engine/core/runtime/AppEngine';
import { container3D } from '@engine';
import { PreSystem } from '../base/PreSystem';
import { Raycaster, Vector2 } from '@three.alias';


class RaycastHandler extends PreSystem {

    async init() {

        this.camera = appEngine.three.camera;
        this.scene = appEngine.three.scene;
        this.renderer = appEngine.three.renderer;

        this.raycaster = new Raycaster();
        this.mouse = new Vector2();

        // debug line (optional)
        this.debugLine = null;

        // Gắn listener click
        this.renderer.domElement.addEventListener('click', (e) => this.handleClick(e));
    }

    normalizeMouse(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;


    }

    handleClick(event) {
        this.normalizeMouse(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.intersect();
    }

    intersect(targets = container3D.root.children) {
        const result = this.raycaster.intersectObjects(targets, true);

        return result;
    }

}

export const raycast = new RaycastHandler();