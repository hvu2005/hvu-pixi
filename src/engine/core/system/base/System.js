



export class System {
    constructor(world, interestedComponents) {
        this.world = world;
        this.interestedComponents = interestedComponents;
    }

    update(dt) {}

    onComponentAdded(component) {}

    onComponentRemoved(component) {}
}   