import { Renderer } from "engine/core/component/Renderer";
import { TilingSprite } from "@pixi.alias";




export class TilingRenderer extends Renderer {
    constructor(texture, options = {}) {
        super();
        const defaultOptions = {
            anchor: { x: 0.5, y: 0.5 },
        }
        const mergedOptions = { ...defaultOptions, ...options };
        this.tilingSprite = new TilingSprite({texture, ...mergedOptions});
    }

    /**
     * 
     * @returns {TilingSprite}
     */
    getNode() {
        return this.tilingSprite;
    }

    _onAttach() {
        this.gameObject.transform.addRenderNode(this.tilingSprite);
    }

    _onDestroy() {
        this.gameObject.transform.removeRenderNode(this.tilingSprite);
    }
    
    _onEnable() {
        this.tilingSprite.visible = true;
    }

    _onDisable() {
        this.tilingSprite.visible = false;
    }
    
    get tileScale() {
        return this.tilingSprite.tileScale;
    }

    get tilePosition() {
        return this.tilingSprite.tilePosition;
    }

    get tileRotation() {
        return this.tilingSprite.tileRotation;
    }
}