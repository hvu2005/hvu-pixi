import { Rectangle, Texture } from "@pixi.alias";


export function SliceTexture(imageName, x, y, w, h) {
    const baseTexture = Texture.from(imageName).source;
    const frame = new Rectangle(x, y, w, h);
    const newTex = new Texture({ source: baseTexture, frame: frame });

    return newTex;
}