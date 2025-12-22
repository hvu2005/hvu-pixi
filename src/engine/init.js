import { assetLoader } from "./asset/AssetLoader";



export async function init() {
    await assetLoader.loadAssets();

}