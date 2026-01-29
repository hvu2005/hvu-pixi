import { OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer, Camera, Object3D } from "three";
import { RenderService } from "./render-service";

export class ThreeRenderer extends RenderService {
    public renderer!: WebGLRenderer;
    public scene!: Scene;
    public fov!: number;
    public camera!: OrthographicCamera | PerspectiveCamera;
    public defaultCamera!: OrthographicCamera | PerspectiveCamera;
    public scenes!: Map<number | string, Scene>;
    public cameras!: Map<number | string, Camera>;

    async init(): Promise<void> {
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

        this.scenes = new Map<number | string, Scene>();
        this.cameras = new Map<number | string, Camera>();

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;

        this.renderer.setSize(WIDTH, HEIGHT);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.autoClear = false;
        document.body.appendChild(this.renderer.domElement);
    }

    public setCamera(camera: OrthographicCamera | PerspectiveCamera, fov: number): void {
        if (this.camera) {
            this.camera.visible = false;
        }
        this.camera = camera;
        this.fov = fov;

        // Update camera projection matrix when FOV changes
        if (camera) {
            if ((camera as OrthographicCamera).isOrthographicCamera) {
                const windowW = window.innerWidth;
                const windowH = window.innerHeight;
                const aspect = windowW / windowH;
                const viewSize = fov;

                (camera as OrthographicCamera).left = -viewSize * aspect;
                (camera as OrthographicCamera).right = viewSize * aspect;
                (camera as OrthographicCamera).top = viewSize;
                (camera as OrthographicCamera).bottom = -viewSize;

                camera.updateProjectionMatrix();
            } else if ((camera as PerspectiveCamera).isPerspectiveCamera) {
                (camera as PerspectiveCamera).fov = fov;
                camera.updateProjectionMatrix();
            }
        }
    }

    public resetCamera(): void {
        this.fov = 75;
        this.camera = this.defaultCamera;

        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        const cam = this.camera;

        if (cam) {
            if ((cam as OrthographicCamera).isOrthographicCamera) {
                const aspect = windowW / windowH;
                const viewSize = this.fov;

                (cam as OrthographicCamera).left = -viewSize * aspect;
                (cam as OrthographicCamera).right = viewSize * aspect;
                (cam as OrthographicCamera).top = viewSize;
                (cam as OrthographicCamera).bottom = -viewSize;
                cam.updateProjectionMatrix();
            } else if ((cam as PerspectiveCamera).isPerspectiveCamera) {
                (cam as PerspectiveCamera).aspect = windowW / windowH;
                (cam as PerspectiveCamera).fov = this.fov;
                cam.updateProjectionMatrix();
            }
        }
    }

    public override createLayer(layerId: number | string): void {
        if (this.scenes.has(layerId)) return;

        const scene = new Scene();
        this.scenes.set(layerId, scene);
    }

    /**
     * Lấy một layer (scene) với id, tạo scene mới nếu chưa tồn tại.
     * @param layerId Số hoặc string id của layer
     * @returns Scene
     */
    public override getLayer(layerId: number | string): Scene {
        if (!this.scenes.has(layerId)) this.createLayer(layerId);
        return this.scenes.get(layerId)!;
    }

    public override addNode(node: Object3D | any, layerId: number | string): void {
        const scene = this.getLayer(layerId);
        scene.add(node);
    }

    public override removeNode(node: Object3D | any, layerId: number | string): void {
        if (!node || !node.parent) return;
        const scene = this.getLayer(layerId);
        if (scene && node.parent === scene) {
            scene.remove(node);
        }
    }

    public override render(layerId: number | string): void {
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

    public override onResize(): void {
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        this.renderer.setSize(windowW, windowH);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

        const cam = this.camera;

        if (cam) {
            if ((cam as OrthographicCamera).isOrthographicCamera) {
                const aspect = windowW / windowH;
                const viewSize = this.fov;

                (cam as OrthographicCamera).left = -viewSize * aspect;
                (cam as OrthographicCamera).right = viewSize * aspect;
                (cam as OrthographicCamera).top = viewSize;
                (cam as OrthographicCamera).bottom = -viewSize;
                cam.updateProjectionMatrix();
            } else if ((cam as PerspectiveCamera).isPerspectiveCamera) {
                (cam as PerspectiveCamera).aspect = windowW / windowH;
                (cam as PerspectiveCamera).fov = this.fov;
                cam.updateProjectionMatrix();
            }
        }
    }
}
export const three = new ThreeRenderer();