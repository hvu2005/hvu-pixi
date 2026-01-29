import { Container, Rectangle, WebGLRenderer } from "pixi.js";
import { RenderService } from "./render-service";

export class PixiRenderer extends RenderService {
    public renderer!: WebGLRenderer;
    public stage!: Container;
    public stages!: Map<number | string, Container>;

    /**
     * Initialize the renderer and stage.
     */
    public override async init(threeContext: WebGL2RenderingContext | null = null): Promise<void> {
        this.renderer = new WebGLRenderer();
        this.stage = new Container();
        this.stage.eventMode = "static";

        this.stages = new Map<number | string, Container>();

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const renderer = this.renderer;

        // Initialize PixiJS renderer with shared context
        await renderer.init({
            context: threeContext ?? undefined,
            width: WIDTH,
            height: HEIGHT,
            clearBeforeRender: false, // Don't clear the canvas as Three.js will handle that
        });

        // Create PixiJS scene graph
        if (!threeContext) {
            document.body.appendChild(renderer.canvas);
        }
    }

    /**
     * Create a new layer (stage) with the specified ID.
     */
    public override createLayer(layerId: number | string): void {
        if (this.stages.has(layerId)) return;

        const stage = new Container();
        stage.eventMode = "static";
        this.stages.set(layerId, stage);
    }

    /**
     * Get a layer (stage) by ID, creating it if it does not exist.
     */
    public override getLayer(layerId: number | string): Container {
        if (!this.stages.has(layerId)) this.createLayer(layerId);
        return this.stages.get(layerId)!;
    }

    /**
     * Add a node (display object) to the specified layer.
     */
    public override addNode(node: Container | any, layerId: number | string): void {
        const stage = this.getLayer(layerId);
        stage.addChild(node);
    }

    /**
     * Remove a node (display object) from the specified layer.
     */
    public override removeNode(node: Container | any, layerId: number | string): void {
        if (!node || !node.parent) return;
        const stage = this.getLayer(layerId);
        if (stage && node.parent === stage) {
            stage.removeChild(node);
        }
    }

    /**
     * Render the specified layer and the main stage.
     */
    public override render(layerId: number | string): void {
        this.renderer.resetState();
        this.renderer.render({ container: this.stage });

        const stage = this.getLayer(layerId);
        this.renderer.resetState();
        this.renderer.render({ container: stage });
    }

    /**
     * Handle window or canvas resizing.
     */
    public override onResize(width: number, height: number): void {
        const DESIGN_WIDTH = width;
        const DESIGN_HEIGHT = height;

        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        let logicWidth: number, logicHeight: number, scale: number;

        // --- Tính toán scale logic ---
        if (windowW <= windowH) {
            // Portrait → fit width
            scale = windowW / DESIGN_WIDTH;
            logicWidth = DESIGN_WIDTH;
            logicHeight = windowH / scale;
        } else {
            // Landscape → fit height
            scale = windowH / DESIGN_HEIGHT;
            logicHeight = DESIGN_HEIGHT;
            logicWidth = windowW / scale;
        }

        // --- PIXI.JS ---
        const renderer = this.renderer;

        // set CSS canvas full window
        renderer.canvas.style.width = windowW + "px";
        renderer.canvas.style.height = windowH + "px";

        // resize renderer logic size
        renderer.resize(logicWidth, logicHeight);

        // stage hitArea logic
        this.stage.hitArea = new Rectangle(0, 0, logicWidth, logicHeight);

        for (const st of this.stages.values()) {
            st.hitArea = new Rectangle(0, 0, logicWidth, logicHeight);
        }
    }
}

export const pixi = new PixiRenderer();