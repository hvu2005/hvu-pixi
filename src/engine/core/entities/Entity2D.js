import { Container } from "@pixi.alias";

export class Entity2D {

    constructor() {
        this.components = [];

        /**
         * @type {Container}
         */
        this.container = null;

        this.renderer = null;

        this.activeSelf = true;
    }
    
    async init() {
 
    }

    get transform() {
        return this.container ?? this.renderer;
    }

    add(component) {
        this.components.push(component);
        component.create(this);
        component.init();
    }

    get(component) {
        return this.components.find(c => c.constructor === component);
    }

    remove(component) {
        this.components = this.components.filter(c => c.constructor.name !== component);
    } 

    setActive(active) {
        if(this.activeSelf === active) return;
        this.activeSelf = active;
        
        if(active) {
            this.components.forEach(component => component._onEnable());
        }
        else {
            this.components.forEach(component => component._onDisable());
        }
    }
}