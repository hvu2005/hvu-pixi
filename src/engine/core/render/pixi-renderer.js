import { Container, Rectangle, WebGLRenderer } from "@pixi.alias";
import { RenderService } from "./render-service";



export class PixiRenderer extends RenderService {
    async init(threeContext = null) {
        this.renderer = new WebGLRenderer();
        this.stage = new Container();
        this.stage.eventMode = "static";

        /**
         * @type {Map<number, Container>}
         */
        this.stages = new Map();

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const renderer = this.renderer;

        // Initialize PixiJS renderer with shared context
        await renderer.init({
            context: threeContext,
            width: WIDTH,
            height: HEIGHT,
            clearBeforeRender: false, // Don't clear the canvas as Three.js will handle that
        });

        // Create PixiJS scene graph
        !threeContext && document.body.appendChild(renderer.canvas);
    }

    createLayer(layerId) {
        if (this.stages.has(layerId)) return;

        const stage = new Container();
        stage.eventMode = "static";
        this.stages.set(layerId, stage);
    }

    getLayer(layerId) {
        if (!this.stages.has(layerId)) this.createLayer(layerId);
        return this.stages.get(layerId);
    }

    addNode(node, layerId) {
        const stage = this.getLayer(layerId);
        stage.addChild(node);
    }

    removeNode(node, layerId) {
        if (!node || !node.parent) return;
        const stage = this.getLayer(layerId);
        if (stage && node.parent === stage) {
            stage.removeChild(node);
        }
    }

    render(layerId) {
        this.renderer.resetState();
        this.renderer.render({ container: this.stage });

        let stage = this.getLayer(layerId);
        this.renderer.resetState();
        this.renderer.render({ container: stage });
    }

    onResize(width, height) {
        const DESIGN_WIDTH = width;
        const DESIGN_HEIGHT = height;

        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        let logicWidth, logicHeight, scale;

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
        
        for(const st of this.stages.values()) {
            st.hitArea = new Rectangle(0, 0, logicWidth, logicHeight);
        }
    }
}

export const pixi = new PixiRenderer();