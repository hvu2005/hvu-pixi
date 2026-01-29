import Stats from 'stats.js';
import { BehaviourSystem } from "./modules/behaviour/behaviour-system";
import { Physic3DSystem } from "./modules/physic-3d/physic-3d-system";
import { RenderPipeline, RenderPipelineOptions } from "./render/render-pipeline";

export class World {
    public behaviour: BehaviourSystem;
    public physics3d: Physic3DSystem;
    public renderContext!: RenderPipeline;
    public stats!: Stats;
    public lastTime: number = 0;
    private _showStats: boolean;

    constructor(showStats: boolean = false) {
        this.behaviour = new BehaviourSystem();
        this.physics3d = new Physic3DSystem();
        this._showStats = showStats;
    }

    async init(options: RenderPipelineOptions): Promise<void> {
        this.stats = new Stats();
        this.renderContext = new RenderPipeline(options);

        if (this._showStats) {
            this.stats.showPanel(0); // 0: FPS, 1: ms, 2: memory
            document.body.appendChild(this.stats.dom);
        }

        await this.renderContext.init();

        this.update();
    }

    update(): void {
        this.lastTime = performance.now();
        const loop = (now: number) => {
            const delta = (now - this.lastTime) / 1000;
            this.lastTime = now;

            this.stats.begin();

            this.behaviour.update(delta);
            if (typeof this.renderContext?.render === 'function') {
                // Assuming a .render() signature; otherwise adapt as needed
                this.renderContext.render();
            }
            this.physics3d.update(delta);

            this.stats.end();

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

export const world = new World();