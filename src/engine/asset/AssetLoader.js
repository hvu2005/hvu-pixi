import { Assets, Texture, Rectangle } from "engine/alias/pixi-alias";

import item from "assets/AS_1.png";

export const Asset = {}; // enum động

class AssetLoader {
    constructor() {
        this.models = new Map();
        this.spriteSheets = new Map(); // cache sprite sheet frames
        this.spines = new Map();
        this.materials = new Map();

        this.loaders = [];
    }

    async __init() {
        for (const loader of this.loaders) {
            await loader.loadAssets();
        }
    }

    registLoader(loader) {
        this.loaders.push(loaders);
    }


    //load assets ở đây
    async loadAssets() {
        await this.load("ITEM", item);
    }


    async load(name, base64) {
        Assets.add({ alias: name, src: base64 });
        const tex = await Assets.load(name);
        Asset[name] = tex;
        return tex;
    }

    async loadBulk(list = []) {
        // Đăng ký tất cả trước
        for (const [name, base64] of list) {
            Assets.add({ alias: name, src: base64 });
        }

        // Load song song
        const loaded = await Assets.load(list.map(([name]) => name));

        // Ghi vào cache Asset
        Object.assign(Asset, loaded);

        return loaded;
    }

    async loadSheet(name, base64, col, row, w, h) {
        Assets.add({ alias: name, src: base64 });
        const baseTexture = await Assets.load(name)
        const frames = [];

        for (let y = 0; y < col; y++) {
            for (let x = 0; x < row; x++) {
                frames.push(
                    new Texture({
                        source: baseTexture,
                        frame: new Rectangle(x * w, y * h, w, h),
                    })
                );
            }
        }
        Asset[name] = frames;
        this.spriteSheets.set(name, frames);
        return frames;
    }
}

export const assetLoader = new AssetLoader();