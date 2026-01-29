import { OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from "@three.alias";
import { RenderService } from "./render-service";



export class ThreeRenderer extends RenderService {
    async init() {
        this.renderer = new WebGLRenderer({ antialias: true, stencil: true, alpha: true });
        this.scene = new Scene();

        this.fov = 5;
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = this.fov;
        this.camera = new OrthographicCamera(
            -viewSize * aspect,
            viewSize * aspect,
            viewSize,
            -viewSize,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        this.defaultCamera = this.camera;

        this.scenes = new Map();
        this.cameras = new Map();

        let WIDTH = window.innerWidth;
        let HEIGHT = window.innerHeight;

        this.renderer.setSize(WIDTH, HEIGHT);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.autoClear = false;
        document.body.appendChild(this.renderer.domElement);
    }

    setCamera(camera, fov) {
        if (this.camera) {
            this.camera.visible = false;
        }
        this.camera = camera;
        this.fov = fov;

        // Update camera projection matrix when FOV changes
        if (camera) {
            if (camera.isOrthographicCamera) {
                const windowW = window.innerWidth;
                const windowH = window.innerHeight;
                let aspect = windowW / windowH;
                let viewSize = fov;

                camera.left = -viewSize * aspect;
                camera.right = viewSize * aspect;
                camera.top = viewSize;
                camera.bottom = -viewSize;

                camera.updateProjectionMatrix();
            } else if (camera.isPerspectiveCamera) {
                camera.fov = fov;
                camera.updateProjectionMatrix();
            }
        }
    }

    resetCamera() {
        this.fov = 75;
        this.camera = this.defaultCamera;

        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        const cam = this.camera;

        if (cam) {
            if (cam.isOrthographicCamera) {
                let aspect = windowW / windowH;
                let viewSize = this.fov;

                cam.left = -viewSize * aspect;
                cam.right = viewSize * aspect;
                cam.top = viewSize;
                cam.bottom = -viewSize;
                cam.updateProjectionMatrix();
            } else if (cam.isPerspectiveCamera) {
                cam.aspect = windowW / windowH;
                cam.fov = this.fov;
                cam.updateProjectionMatrix();
            }
        }
    }

    createLayer(layerId) {
        if (this.scenes.has(layerId)) return;

        const scene = new Scene();
        this.scenes.set(layerId, scene);
    }

    /**
     * 
     * @param {Scene} layerId 
     * @returns 
     */
    getLayer(layerId) {
        if (!this.scenes.has(layerId)) this.createLayer(layerId);
        return this.scenes.get(layerId);
    }

    addNode(node, layerId) {
        const scene = this.getLayer(layerId);
        scene.add(node);
    }

    removeNode(node, layerId) {
        if (!node || !node.parent) return;
        const scene = this.getLayer(layerId);
        if (scene && node.parent === scene) {
            scene.remove(node);
        }
    }

    render(layerId) {

        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);


        // const camera = this.cameras.get(layerId);
        // if(!camera) {
        //     console.error("[ENGINE ERROR] No Camera for layer was found: ", layerId);
        //     return;
        // }

        const scene = this.getLayer(layerId);
        this.renderer.resetState();
        this.renderer.render(scene, this.camera);
    }

    onResize() {
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        this.renderer.setSize(windowW, windowH);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

        const cam = this.camera;

        if (cam) {
            if (cam.isOrthographicCamera) {
                let aspect = windowW / windowH;
                let viewSize = this.fov;

                cam.left = -viewSize * aspect;
                cam.right = viewSize * aspect;
                cam.top = viewSize;
                cam.bottom = -viewSize;
                cam.updateProjectionMatrix();
            } else if (cam.isPerspectiveCamera) {
                cam.aspect = windowW / windowH;
                cam.fov = this.fov;
                cam.updateProjectionMatrix();
            }
        }
    }
}
export const three = new ThreeRenderer();