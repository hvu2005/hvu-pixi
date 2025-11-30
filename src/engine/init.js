import { assetLoader } from "./asset/AssetLoader";
import { world } from "./core/World";



export async function init(options = { pixi, three }) {
    await assetLoader.loadAssets();
    await world.init(options);
}