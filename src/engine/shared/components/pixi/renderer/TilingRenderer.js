import { Texture, TilingSprite } from "@pixi.alias";
import { RendererBase } from "./RendererBase";



export class TilingRenderer extends RendererBase {
    constructor(texture, options = { alpha: 1, tint: 0xFFFFFF, width: null, height: null, anchor: { x: 0.5, y: 0.5 }, eventMode: 'none' }) {
        super();

        const tex = typeof texture === "string"
            ? Texture.from(texture)
            : texture;
        this.sprite = new TilingSprite(tex);

        const anchorX = options?.anchor?.x ?? 0.5;
        const anchorY = options?.anchor?.y ?? 0.5;
        this.sprite.label = 'tilingSprite';

        this.sprite.anchor.set(anchorX, anchorY);

        this.sprite.alpha = options.alpha ?? 1;
        this.sprite.tint = options.tint ?? 0xFFFFFF;

        if (options.width) {
            this.sprite.width = options.width;
        }

        if (options.height) {
            this.sprite.height = options.height;
        }
        this.sprite.eventMode = options.eventMode ?? "none";
    }

    __init() {
        if (this.gameObject && typeof this.gameObject.addChild === "function") {
            this.gameObject._renderer.addChild(this.sprite);
        }
    }

    _onDisable() {
        this.sprite.visible = false;
    }

    _onEnable() {
        this.sprite.visible = true;
    }
}