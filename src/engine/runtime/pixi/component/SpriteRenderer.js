import { Renderer } from "engine/core/component/Renderer";
import { Transform } from "engine/core/component/Transform";
import { Sprite } from "pixi.js";




export class SpriteRenderer extends Renderer {
    /**
     * 
     * @param {import("pixi.js").Texture} texture 
     * @param {import("pixi.js").SpriteOptions} options 
     */
    constructor(texture, options = {}) {
        super();

        const defaultOptions = {
            anchor: { x: 0.5, y: 0.5 },
        }

        const mergedOptions = { ...defaultOptions, ...options };

        this.sprite = new Sprite({texture, ...mergedOptions});
    }

    _onAttach() {
        this.gameObject.getComponent(Transform).addRenderNode(this.sprite);
    }

    _onDestroy() {
        this.gameObject.getComponent(Transform).removeRenderNode(this.sprite);
    }
    
    _onEnable() {
        this.sprite.visible = true;
    }

    _onDisable() {
        this.sprite.visible = false;
    }

}