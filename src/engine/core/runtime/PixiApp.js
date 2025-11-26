import { Container, Rectangle, WebGLRenderer } from "@pixi.alias";





class PixiApp {
    constructor() {

    }

    async init(threeContext = null) {
        this.renderer = new WebGLRenderer();
        this.stage = new Container();

        let WIDTH = window.innerWidth;
        let HEIGHT = window.innerHeight;

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

    render() {
        this.renderer.resetState();
        this.renderer.render({ container: this.stage });
    }

    resize() {
        console.log("PixiApp resize");
        // const DESIGN_WIDTH = this.designWidth;   // logic chiều ngang gốc
        // const DESIGN_HEIGHT = this.designHeight; // logic chiều dọc gốc

        const DESIGN_WIDTH = 981;   // logic chiều ngang gốc
        const DESIGN_HEIGHT = 1230; // logic chiều dọc gốc

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
        if (this.stage) {
            this.stage.hitArea = new Rectangle(0, 0, logicWidth, logicHeight);
        }
    }
}

export const pixiApp = new PixiApp();