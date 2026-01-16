import Stats from 'stats.js';
import { RenderPipeline } from './render/render-pipeline';
import { GameObject } from './scene-graph/game-object';
import { Component } from './component/base/component';
import { System } from './system/base/system';

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
        this.renderContext = new RenderPipeline({ pixi: pixi, three: three });

        this._showStats = true;
    }

    async init() {

        this.stats = new Stats();

        if (this._showStats) {
            this.stats.showPanel(0); // 0: FPS, 1: ms, 2: memory
            document.body.appendChild(this.stats.dom);
        }

        await this.renderContext.init();

        this.run();
    }

    run() {
        this.lastTime = 0;
        const loop = (now) => {
            const delta = (now - this.lastTime) / 1000;
            this.lastTime = now;

            this.stats.begin();

            this.update(delta);
            this.renderContext?.render();

            this.stats.end();


            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    //#region Systems
    update(dt) {
        for (const system of this.systems) {
            system.update(dt);
        }
    }

    /**
     * @template {System} T
     * @param {new (...args:any[]) => T} systemClass 
     * @returns {T}
     */
    createSystem(systemClass) {
        const system = new systemClass(this);

        this.systems.push(system);

        this.systems.sort((a, b) => {
            const ao = a.constructor.executeOrder ?? 0;
            const bo = b.constructor.executeOrder ?? 0;
            return ao - bo;
        });

        const interests = systemClass.interestedComponents || [];
        for (const componentType of interests) {
            if (!this.componentToSystems.has(componentType)) {
                this.componentToSystems.set(componentType, []);
            }
            this.componentToSystems.get(componentType).push(system);
        }

        return system;
    }

    /**
     * 
     * @param {System} system 
     */
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

    /**
     * 
     * @param {Component} component 
     */
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

    /**
     * 
     * @param {Component} component 
     */
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
     * @template {GameObject} T
     * @param {new (...args:any[]) => T} gameObjectClass 
     * @returns {T}
     */
    createGameObject(gameObjectClass, options) {
        const gameObject = new gameObjectClass(this, options);
        this.entities.push(gameObject);

        return gameObject;
    }
}
