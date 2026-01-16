import { Transform } from "engine/core/component/transform";
import { Group } from "@three.alias";




export class Transform3D extends Transform {
        constructor() {
            super();
            this.group = new Group();
        }

        /**
         * @returns {Group}
         */
        getNode() {
            return this.group;
        }

        getRenderNode() {
            return this.group;
        }

        addRenderNode(node) {
            this.group.add(node);
        }
    
        removeRenderNode(node) {
            this.group.remove(node);
        }

        _onDestroy() {
            this.group.destroy();
            this.gameObject = null;
        }

        _onEnable() {
            this.group.visible = true;
        }

        _applyPosition(x, y, z) {
            this.group.position.set(x, y, z);
        }

        _applyRotation(x, y, z) {
            this.group.rotation.set(x, y, z);
        }

        _applyScale(x, y = x, z = x) {
            this.group.scale.set(x, y, z);
        }

        /**
         * @param {Transform3D} child 
         */
        _applyAddChild(child) {
            this.group.add(child.getNode());
        }

        /**
         * @param {Transform3D} child 
         */
        _applyRemoveChild(child) {
            this.group.remove(child.getNode());
        }

        /**
         * @param {Transform3D} parent 
         */
        _applyParentChanged(parent) {
            this.group.parent = parent.getNode();
        }
}