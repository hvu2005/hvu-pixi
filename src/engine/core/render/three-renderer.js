import { PerspectiveCamera, Scene, WebGLRenderer } from "@three.alias";



export class ThreeRenderer {
    async init() {
        this.renderer = new WebGLRenderer({ antialias: true, stencil: true, alpha: true });
        this.scene = new Scene();

        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        this.scenes = new Map();

        let WIDTH = window.innerWidth;
        let HEIGHT = window.innerHeight;

        this.renderer.setSize(WIDTH, HEIGHT);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.autoClear = false;
        document.body.appendChild(this.renderer.domElement);
    }

    render(layerId) {
        // this.renderer.resetState();
        // this.renderer.render(this.scene, this.camera);

        let scene = this.scenes.get(layerId);

        this.renderer.resetState();
        this.renderer.render(scene, this.camera);
    }

    onResize() {
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        this.renderer.setSize(windowW, windowH);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    }
}
export const three = new ThreeRenderer();