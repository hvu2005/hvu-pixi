import { Assets } from "engine/alias/pixi-alias.full";

export async function loadPixiTexture(src) {
    const tex = await Assets.load(src);
    return tex;
}