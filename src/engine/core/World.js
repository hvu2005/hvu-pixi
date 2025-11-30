


class World {
    constructor() {
        this.systems = [];
        this.entities = [];
    }

    /**
     * 
     * @param {Pixi} options.pixi 
     * @param {Three} options.three 
     */
    async init(options = { pixi, three }) {
  
        this.pixi = options.pixi;
 
        this.three = options.three;

        await this.pixi?.init();
        await this.initSystems();

        this.pixi?.onResize(981,1230);

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

    render() {
        this.pixi?.render();
        this.three?.render();
    }

    update(dt) {
        for (const system of this.systems) {
            system.update(dt);
        }
    }

    async initSystems() {
        for (const system of this.systems) {
            await system.init();
        }
    }

    addSystem(system) {
        this.systems.push(system);
    }

    removeSystem(system) {
        this.systems = this.systems.filter(s => s !== system);
    }

}

export const world = new World();