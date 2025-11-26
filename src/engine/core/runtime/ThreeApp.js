import { AmbientLight, PerspectiveCamera, Scene, WebGLRenderer } from "@three.alias";

class ThreeApp {
    constructor() {
    }

    async init(fov, depth) {
        
        this.renderer = new WebGLRenderer({ antialias: true, stencil: true });

        let WIDTH = window.innerWidth;
        let HEIGHT = window.innerHeight;

        this.camera = new PerspectiveCamera(fov, WIDTH / HEIGHT);
        this.light = new AmbientLight(0xffffff, 8);

        // === THREE.JS SETUP ===
        // Create Three.js WebGL renderer with antialiasing and stencil buffer
        const renderer = this.renderer;

        // Configure Three.js renderer size and background color
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor(0xdddddd, 1); // Light gray background
        document.body.appendChild(renderer.domElement);

        // Create Three.js scene
        this.scene = new Scene();
        const scene = this.scene;

        // Set up perspective camera with 70° FOV
        // this.camera = new PerspectiveCamera(this.fov, WIDTH / HEIGHT);

        this.camera.position.z = depth ?? 50; // Move camera back to see the scene
        scene.add(this.camera);
        scene.add(this.light);
    }

    render() {
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        // --- THREE.JS ---
        const three = this.renderer;
        const camera = this.camera;

        // Cập nhật kích thước renderer 3D theo pixel thật của cửa sổ
        three.setSize(windowW, windowH);

        // Cập nhật aspect camera để tránh méo khung hình
        if (camera) {
            camera.aspect = windowW / windowH;
            camera.updateProjectionMatrix();
        }
    }
}

export const threeApp = new ThreeApp();