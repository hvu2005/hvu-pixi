

export class RenderPipeline {
    /**
    * @param {{
    *   pixi?: import("engine/core/render/pixi-renderer").PixiRenderer,
    *   three?: import("engine/core/render/three-renderer").ThreeRenderer
    * }} options
    */
    constructor(options = { pixi, three }) {
        this.pixi = options.pixi;
        this.three = options.three;

        /**
         * @private
         */
        this._layers = [];

        /**
         * @private
         */
        this._layerSet = new Set();
    }

    async init() {
        await this.three?.init();
        await this.pixi?.init(this.three?.renderer.getContext());
        this.pixi?.onResize(981, 1230);
    }

    addNode2D(node, layerId) {
        this.pixi?.addNode(node, layerId);
    }

    addNode3D(node, layerId) {
        this.three?.addNode(node, layerId);
    }

    removeNode2D(node, layerId) {
        this.pixi?.removeNode(node, layerId);
    }

    removeNode3D(node, layerId) {
        this.three?.removeNode(node, layerId);
    }

    moveNode2D(node, oldLayerId, newLayerId) {
        this.removeNode2D(node, oldLayerId);
        this.addNode2D(node, newLayerId);
    }

    moveNode3D(node, oldLayerId, newLayerId) {
        this.removeNode3D(node, oldLayerId);
        this.addNode3D(node, newLayerId);
    }

    render() {
        this._layers.forEach(layerId => {
            this.three?.render(layerId);
            this.pixi?.render(layerId);
        });
    }

    /**
     * 
     * @param {number} layerId 
     * @returns 
     */
    createLayer(layerId) {    
        const index = this._findInsertIndex(layerId);
        this._layers.splice(index, 0, layerId);
        this._layerSet.add(layerId);

        this.three?.createLayer(layerId);
        this.pixi?.createLayer(layerId);
    }

    ensureLayer(layerId) {
        if (!this._layerSet.has(layerId)) {
            this.createLayer(layerId);
        }
    }
    

    /**
     * @private
     * @param {number} layerId 
     * @returns 
     */
    _findInsertIndex(layerId) {
        let low = 0;
        let high = this._layers.length - 1;

        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            if (this._layers[mid] < layerId) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return low;
    }
}