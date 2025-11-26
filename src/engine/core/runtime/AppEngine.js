
import { CoreEventType, eventBus } from '@engine';
import { gameInitializer } from '../GameInitializer';

import Stats from 'stats.js';


class AppEngine {

    constructor() {
        this.three = null;
        this.pixi = null;

        this._isDebugging = false;
    }

    get debug() {
        return this._isDebugging;
    }

    set debug(value) {
        this._isDebugging = value;

        if (value) {
            if (!this.stats)
                this.stats = new Stats();
            this.stats.showPanel(0); // 0: FPS, 1: ms, 2: memory
            document.body.appendChild(this.stats.dom);
        }
        else {
            this.stats?.dom.remove();
        }
    }

    async initScene(options = { pixi, three ,designWidth: 981, designHeight: 1230, fov: 70, cameraDepth: 50 }) {
        this.designWidth = options.designWidth ?? 981;
        this.designHeight = options.designHeight ?? 1230;
        this.fov = options.fov ?? 70;
        this.cameraDepth = options.cameraDepth ?? 50;
        this.pixi = options.pixi;
        this.three = options.three

        await gameInitializer.initLifecycle();
    }



    async __init() {


        if (this.three) {
            await this.three.init(this.fov, this.cameraDepth);
        }

        if (this.pixi) {
            const threeContext = this.three?.renderer.getContext();
            await this.pixi.init(threeContext);
        }

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.three?.resize();
        this.pixi?.resize();


        // --- Gửi sự kiện resize toàn hệ thống ---
        eventBus.emit(CoreEventType.ON_RESIZE, screen.width, screen.height);
    }

    render() {

        this.stats?.begin();

        this.three?.render();
        this.pixi?.render();

        this.stats?.end();
    }

    // get camera() {
    //     return this.threeRenderer?.threeCamera;
    // }

    // get light() {
    //     return this.ambientLight;
    // }

}

export const appEngine = new AppEngine();
export const camera = appEngine?.camera;
export const light = appEngine?.light;

export const screen = {
    get width() {
        return appEngine.pixi.renderer.canvas?.width ?? 0;
    },
    get height() {
        return appEngine.pixi.renderer.canvas?.height ?? 0;
    }
};
