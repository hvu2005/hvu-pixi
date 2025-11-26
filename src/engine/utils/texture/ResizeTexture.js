import { RenderTexture, Sprite } from "@pixi.alias";
import { appEngine } from "engine/core/runtime/AppEngine";

export function ResizeTexture(texture, w, h) {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0, 0);
    sprite.width = w;
    sprite.height = h;

    const renderTexture = RenderTexture.create({ width: w, height: h });
    appEngine.pixi.renderer.renderToTexture(sprite, { renderTexture });

    return renderTexture;
}