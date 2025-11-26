
//[Demo] not finish yet


class LoadManager {
    constructor() {
        this.loaders = [];

        this.models = new Map();
        this.spriteSheets = new Map();
        this.spines = new Map();
        this.materials = new Map();
    }

    async __init() {
        for (const loader of this.loaders) {
            await loader.loadAssets();
        }
    }

    registLoader(loader) {
        this.loaders.push(loader);
    }

}


export const AssetX = {}; // enum động
export const loadManager = new LoadManager();