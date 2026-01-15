import { Assets, Texture, Rectangle } from "engine/alias/pixi-alias.full";


export async function loadSpritesheet(src, row, col, w, h) {
    const baseTexture = await Assets.load(src)
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

    return frames;
}