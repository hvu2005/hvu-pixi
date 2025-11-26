import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { Component } from "../../base/Component";
import { assetLoader } from "../../../core/asset/AssetLoader";


export class SpineRenderer extends Component {
    constructor(spineTex, options = {}) {
        super();

        const tex = typeof spineTex === "string"
            ? assetLoader.spines.get(spineTex)
            : spineTex;
        this.spine = new Spine(tex);
        this.spine.label = 'spine';

        this.spine.skeleton.color.set(1, 1, 1, options.alpha ?? 1);
    }

    async __init() {
        if (this.gameObject && typeof this.gameObject.addChild === "function") {
            this.gameObject._renderer.addChild(this.spine);
        }
    }

    _onDestroy() {
        super._onDestroy();
        this.spine.destroy?.();
    }

}