import { Transform } from "engine/core/component/transform";
import { Container } from "@pixi.alias";


export class Transform2D extends Transform {
    /**
     * @param {import("pixi.js").ContainerOptions} options 
     */
    constructor(options = {}) {
        super();
        const defaultOptions = {
            sortableChildren: true,
        }
        const mergedOptions = { ...defaultOptions, ...options };

        this.group = new Container(mergedOptions);
    }

    /**
     * @returns {Container}
     */
    getNode() {
        return this.group;
    }

    _onDestroy() {
        this.group.destroy();
        this.gameObject = null;
    }

    _onEnable() {
        this.group.visible = true;
    }

    _onDisable() {
        this.group.visible = false;
    }

    _applyPosition(x, y, z) 
    {
        this.group.position.set(x, y);
    }

    _applyRotation(x, y, z) {
        this.group.rotation = z;
    }

    _applyScale(x, y = x, z = x) {
        this.group.scale.set(x, y);
    }

    addRenderNode(node) {
        this.group.addChild(node);
    }

    removeRenderNode(node) {
        this.group.removeChild(node);
    }

    /**
     * @param {Transform2D} child 
     */
    _applyAddChild(child) {
        this.group.addChild(child.getNode());
    }

    /**
     * @param {Transform2D} child 
     */
    _applyRemoveChild(child) {
        this.group.removeChild(child.getNode());
    }

    /**
     * @param {Transform2D} parent 
     */
    _applyParentChanged(parent) {
        parent.getNode().addChild(this.group);
    }
}