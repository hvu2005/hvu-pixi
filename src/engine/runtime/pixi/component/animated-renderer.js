import { Component } from "engine/core/component/base/component";
import { AnimatedSprite } from "engine/alias/pixi-alias";


export class AnimatedRenderer extends Component {
    /**
     * @param {import("pixi.js").Texture[]} textures
     * @param {import("pixi.js").AnimatedSpriteOptions} options
     */
    constructor(textures, options = {}) {
        super();
        defaultOptions = {
            anchor: { x: 0.5, y: 0.5 },
        }
        const mergedOptions = { ...defaultOptions, ...options };

        this.animatedSprite = new AnimatedSprite({textures, ...mergedOptions});
    }

    /**
     * 
     * @returns {AnimatedSprite}
     */
    getNode() {
        return this.animatedSprite;
    }

    _onAttach() {
        this.gameObject.transform.addRenderNode(this.animatedSprite);
    }

    _onDestroy() {
        this.gameObject.transform.removeRenderNode(this.animatedSprite);
    }

    _onEnable() {
        this.animatedSprite.visible = true;
    }

    _onDisable() {
        this.animatedSprite.visible = false;
    }
}