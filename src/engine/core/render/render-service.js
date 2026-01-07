

export class RenderService {

    constructor() {
    }

    async init() { }

    createLayer(layerId) { }

    getLayer(layerId) { }

    /**
     * @param {import("engine/core/game-object").GameObject} node 
     * @param {number} layerId 
     */
    changeLayer(node, layerId) {
        const oldLayer = node.layer;
        this.removeNode(node, oldLayer);
        this.addNode(node, layerId);
    }

    render(layerId) { }

    onResize(width, height) { }

    /**
     * @param {import("engine/core/game-object").GameObject} node 
     * @param {number} layerId 
     */
    addNode(node, layerId) { }

    /**
     * @param {import("engine/core/game-object").GameObject} node 
     * @param {number} layerId 
     */
    removeNode(node, layerId) { }
}