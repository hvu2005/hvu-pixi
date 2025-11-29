



export class Entity2D {
    
    async init() {
        this.components = [];
    }

    add(component) {
        this.components.push(component);
    }

    get(component) {
        return this.components.find(c => c.constructor.name === component);
    }

    remove(component) {
        this.components = this.components.filter(c => c.constructor.name !== component);
    } 
}