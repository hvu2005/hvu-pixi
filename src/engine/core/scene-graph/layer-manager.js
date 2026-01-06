


export class LayerManager {
    constructor() {
        this.layers = new Set();
    }

    addLayer(layer) {
        this.layers.add(layer);
    }
}