import { Assets } from "@pixi.alias";


export async function loadPixiTexture(base64Img) {
    const tex = await Assets.load(base64Img);
    return tex;
}