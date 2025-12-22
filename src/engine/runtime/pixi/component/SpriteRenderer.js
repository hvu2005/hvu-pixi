import { Renderer } from "engine/core/component/Renderer";
import { Sprite } from "pixi.js";
import { Transform2D } from "./Transform2D";



export class SpriteRenderer extends Renderer {
    constructor(texture, options = {}) {
        super();

        const defaultOptions = {
            anchor: { x: 0.5, y: 0.5 },
        }

        const mergedOptions = { ...defaultOptions, ...options };

        this.sprite = new Sprite({texture, ...mergedOptions});
    }

    _onAttach() {
        this.gameObject.getComponent(Transform2D).addChild(this.sprite);
    }

    _onDestroy() {
        this.gameObject.getComponent(Transform2D).removeChild(this.sprite);
    }
    
    _onEnable() {
        this.sprite.visible = true;
    }

    _onDisable() {
        this.sprite.visible = false;
    }

}