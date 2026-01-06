import Stats from 'stats.js';
import { RenderPipeline } from './render/render-pipeline';

export class World {
    /**
    * @param {{
    *   pixi?: import("engine/core/render/pixi-renderer").PixiRenderer,
    *   three?: import("engine/core/render/three-renderer").ThreeRenderer
    * }} options
    */
    constructor({ pixi, three }) {
        this.systems = [];
        this.entities = [];
        this.components = new Map();

        this.componentToSystems = new Map();
        this.pixi = pixi;
        this.three = three;
        this.renderPipeline = new RenderPipeline({ pixi: this.pixi, three: this.three });
    }

    async init() {

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: FPS, 1: ms, 2: memory
        document.body.appendChild(this.stats.dom);

        await this.renderPipeline.init();
        await this.initSystems();

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
        this.stats.begin();
        this.renderPipeline.render();
        this.stats.end();
    }

    //#region Systems
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

    //#endregion

    //#region Events
    onComponentAdded(component) {
        let ctor = component.constructor;

        while (ctor) {
            const systems = this.componentToSystems.get(ctor);
            if (systems) {
                for (const system of systems) {
                    system.onComponentAdded(component);
                }
            }
            ctor = Object.getPrototypeOf(ctor);
        }
    }

    onComponentRemoved(component) {
        let ctor = component.constructor;

        while (ctor) {
            const systems = this.componentToSystems.get(ctor);
            if (systems) {
                for (const system of systems) {
                    system.onComponentRemoved(component);
                }
            }
            ctor = Object.getPrototypeOf(ctor);
        }
    }
    //#endregion

    /**
     * @template T
     * @param {new (...args:any[]) => T} gameObjectClass 
     * @returns {T}
     */
    createGameObject(gameObjectClass, options = {layer: 0}) {
        this.renderPipeline.addLayer(options.layer || 0);
        const gameObject = new gameObjectClass(this, options);

        this.entities.push(gameObject);
        return gameObject;
    }

    /**
     * @template T
     * @param {new (...args:any[]) => T} systemClass 
     * @returns {T}
     */
    createSystem(systemClass) {
        const system = new systemClass(this);
        this.systems.push(system);

        const interests = system.interestedComponents || [];
        for (const componentType of interests) {
            if (!this.componentToSystems.has(componentType)) {
                this.componentToSystems.set(componentType, []);
            }
            this.componentToSystems.get(componentType).push(system);
        }

        return system;
    }
}
