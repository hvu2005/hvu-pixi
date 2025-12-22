import Stats from 'stats.js';

export class World {
    constructor() {
        this.systems = [];
        this.entities = [];
        this.components = new Map();
    }

    /**
     * 
     * @param {Pixi} options.pixi 
     * @param {Three} options.three 
     */
    async init(options = { pixi, three }) {
        this.pixi = options.pixi;

        this.three = options.three;

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: FPS, 1: ms, 2: memory
        document.body.appendChild(this.stats.dom);

        await this.pixi?.init();
        await this.initSystems();

        this.pixi?.onResize(981, 1230);

        this.run();
    }

    run() {
        this.lastTime = 0;
        const loop = (now) => {
            const delta = (now - this.lastTime) / 1000;
            this.lastTime = now;

            this.update(delta);
            this.render();

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    addToPixiStage(pixiNode) {
        this.pixi.stage.addChild(pixiNode);
    }

    addToThreeScene(threeNode) {
        this.three.scene.add(threeNode);
    }

    render() {
        this.stats.begin();
        this.pixi?.render();
        this.three?.render();
        this.stats.end();
    }

    update(dt) {
        for (const system of this.systems) {
            system.update(dt);
        }
    }

    async initSystems() {
        for (const system of this.systems) {
            try {
                await system.init(this);
            } catch (e) {
                console.error(`Error initializing system ${system.constructor?.name || ''}:`, e);
            }
        }
    }

    /**
     * @Template T
     * @param {new (...args:any[]) => T} system 
     * @returns {T}
     */
    addSystem(system) {
        this.systems.push(system);
        return system;
    }

    removeSystem(system) {
        this.systems = this.systems.filter(s => s !== system);
    }

    /** 
     * @Template T
     * @param {new (...args:any[]) => T} SystemClass 
     * @returns {T}
     */
    getSystem(SystemClass) {
        return this.systems.find(s => s.constructor === SystemClass);
    }

    destroy() {
        WorldContext.current = null;
    }
}
