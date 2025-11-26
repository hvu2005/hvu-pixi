
import { AnimatedSprite, Texture } from "@pixi.alias";
import { Coroutine } from "../../../../utils/utils.d";
import { RendererBase } from "./RendererBase";
import { assetLoader } from "../../../../core/asset/AssetLoader";

export class AnimatedRenderer extends RendererBase {
    /**
     * 
     * @param {string | [Texture]} texture 
     * @param {{ 
     *    animationSpeed?: number, 
     *    loop?: boolean, 
     *    delay?: number, 
     *    alpha?: number, 
     *    tint?: number, 
     *    width?: number|null, 
     *    height?: number|null, 
     *    anchor?: {x: number, y: number} 
     * }} options 
     */
    constructor(texture, options = { animationSpeed: 0.3, loop: true, delay: 0, alpha: 1, tint: 0xFFFFFF, width: null, height: null, anchor: { x: 0.5, y: 0.5 }, eventMode: 'none' }) {
        super();
        const frames = typeof texture === "string"
            ? assetLoader.spriteSheets.get(texture)
            : texture;
        this.sprite = new AnimatedSprite(frames, options.loop);
        const anchorX = options?.anchor?.x ?? 0.5;
        const anchorY = options?.anchor?.y ?? 0.5;
        
        if (options.width !== null) {
            this.sprite.width = options.width;
        }

        if (options.height !== null) {
            this.sprite.height = options.height;
        }

        this.defaultAnimation = texture;
        this.options = options;
        this.sprite.label = 'animatedSprite';
        this.sprite.anchor.set(anchorX, anchorY);
        this.sprite.animationSpeed = options.animationSpeed ?? 0.3;
        this.sprite.loop = options.loop ?? true;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.alpha = options.alpha ?? 1;
        this.sprite.tint = options.tint ?? 0xFFFFFF;
        this.sprite.onComplete = this.onAnimationComplete.bind(this);
        this.sprite.gotoAndPlay(0);
        this.sprite.eventMode = options.eventMode ?? 'none';
    }

    /**
     * @override
     */
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
        this.sprite.gotoAndPlay(0);
    }

    /**
     * Phát animation mới
     * @param {string | [Texture]} newTexture - tên spriteSheet đã load hoặc mảng frames
     * @param {{ animationSpeed?: number, loop?: boolean, delay?: number }} options 
     */
    async playAnimation(newTexture, options = { animationSpeed: 0.1, loop: false, delay: 0 }) {
        await Coroutine.waitForSeconds(options.delay);

        try {
            let newFrames;

            if (typeof newTexture === "string") {
                newFrames = assetLoader.spriteSheets.get(newTexture);
                if (!newFrames) {
                    throw new Error(`❌ Không tìm thấy sprite sheet: ${newTexture}`);
                }
            } else if (Array.isArray(newTexture)) {
                newFrames = newTexture;
            } else {
                throw new Error("❌ newTexture phải là string hoặc mảng frames");
            }

            this.sprite.textures = newFrames;
            this.sprite.animationSpeed = options.animationSpeed ?? this.sprite.animationSpeed;
            this.sprite.loop = options.loop ?? this.sprite.loop;
            this.sprite.gotoAndPlay(0);

        } catch (e) {
            console.warn("Animation texture not found:", newTexture, e);
        }
    }

    onAnimationComplete() {
        if (!this.sprite.loop) {
            this.playAnimation(this.defaultAnimation, this.options);
        }
    }
}