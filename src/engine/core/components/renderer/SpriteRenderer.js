import { Sprite } from "@pixi.alias";
import { Component } from "../base/Component";
import { pixi } from "engine/core/app/Pixi";



export class SpriteRenderer extends Component {
    constructor(texture, options = {}) {
        super();

        const defaultOptions = {
            anchor: { x: 0.5, y: 0.5 },
        };
        // merge options mặc định với options truyền vào

        const finalOptions = { ...defaultOptions, ...options };

        this.sprite = new Sprite({texture, ...finalOptions});
    }

    async init() {
        this.entity.renderer = this.sprite;
        if(this.entity.container) {
            this.entity.container.addChild(this.sprite);
        }
        else {
            pixi.stage.addChild(this.sprite);
        }
    }
    
    _onEnable() {
        this.sprite.visible = true;
    }

    _onDisable() {
        this.sprite.visible = false;
    }

    _onDestroy() {
        this.entity.renderer = null;
        this.sprite.destroy();
    }
}