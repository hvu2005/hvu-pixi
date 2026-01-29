

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

        this._layers = [0];              // sorted layer ids
        this._layerSet = new Set();

        this._layer2D = new Set();      // layer có pixi content
        this._layer3D = new Set();      // layer có three content

    }

    async init() {
        await this.three?.init();
        await this.pixi?.init(this.three?.renderer.getContext());
        this.pixi?.onResize(981, 1230);
        this.three?.onResize();

        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        this.pixi?.onResize(981, 1230);
        this.three?.onResize();
    }

    setCamera(camera, fov) {
        this.three?.setCamera(camera, fov);
    }
    
    resetCamera() {
        this.three?.resetCamera();
    }

    addNode2D(node, layerId) {
        if(!this.pixi) {
            console.error("[ENGINE ERROR] Pixi Renderer chưa được khởi tạo! Có module cần sử dụng Pixi Renderer!");
            return;
        }
        this.ensureLayer2D(layerId);
        this.pixi.addNode(node, layerId);
    }

    addNode3D(node, layerId) {
        if(!this.three) {
            console.error("[ENGINE ERROR] Three Renderer chưa được khởi tạo! Có module cần sử dụng Three Renderer!");
            return;
        }
        this.ensureLayer3D(layerId);
        this.three.addNode(node, layerId);
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

    ensureLayer2D(layerId) {
        if (this._layer2D.has(layerId)) return;

        const index = this._findInsertIndex(layerId);
        if (layerId !== this._layers[index]) {
            this._layers.splice(index, 0, layerId);
            this._layerSet.add(layerId);
        }

        this._layer2D.add(layerId);
        this.pixi?.createLayer(layerId);
    }

    ensureLayer3D(layerId) {
        if (this._layer3D.has(layerId)) return;

        const index = this._findInsertIndex(layerId);
        if (layerId !== this._layers[index]) {
            this._layers.splice(index, 0, layerId);
            this._layerSet.add(layerId);
        }

        this._layer3D.add(layerId);
        this.three?.createLayer(layerId);
    }


    createLayer2D(layerId) {
        const index = this._findInsertIndex(layerId);
        this._layers.splice(index, 0, layerId);
        this._layerSet.add(layerId);

        this.pixi?.createLayer(layerId);
    }

    createLayer3D(layerId) {
        const index = this._findInsertIndex(layerId);
        this._layers.splice(index, 0, layerId);
        this._layerSet.add(layerId);

        this.three?.createLayer(layerId);
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