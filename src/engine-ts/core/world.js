import Stats from 'stats.js';
import { BehaviourSystem } from "./modules/behaviour/behaviour-system";
import { Physic3DSystem } from "./modules/physic-3d/physic-3d-system";
import { RenderPipeline } from "./render/render-pipeline";

export class World {
    constructor() {
        this.behaviour = new BehaviourSystem();
        this.physics3d = new Physic3DSystem();
        
    }

    async init(options) {
        this.stats = new Stats();
        this.renderContext = new RenderPipeline(options);

        if (this._showStats) {
            this.stats.showPanel(0); // 0: FPS, 1: ms, 2: memory
            document.body.appendChild(this.stats.dom);
        }

        await this.renderContext.init();

        this.update();
    }

    update() {
        this.lastTime = 0;
        const loop = (now) => {
            const delta = (now - this.lastTime) / 1000;
            this.lastTime = now;

            this.stats.begin();

            this.behaviour.update(delta);
            this.renderContext?.render();
            this.physics3d.update(delta);

            this.stats.end();

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

}

export const world = new World();