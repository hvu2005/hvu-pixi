



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
        this._layers = [];
        this._layerSet = new Set();
    }

    async init() {
        await this.three?.init();
        await this.pixi?.init(this.three?.renderer.getContext());
        this.pixi?.onResize(981, 1230);
    }

    render() {
        this.three?.render();
        this.pixi?.render();
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
    addLayer(layerId) {
        if (this._layerSet.has(layerId)) return;
    
        const index = this._findInsertIndex(layerId);
        this._layers.splice(index, 0, layerId);
        this._layerSet.add(layerId);
    }

    /**
     * 
     * @param {number} layerId 
     * @returns 
     */
    _findInsertIndex(layerId) {
        let low = 0;
        let high = this._layers.length;
    
        while (low < high) {
            const mid = (low + high) >> 1;
            if (this._layers[mid].order <= layerId) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
    
        return low;
    }
}