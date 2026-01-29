import { Group, Mesh, Object3D } from "three";
import { Text3D } from "../extension-objects/text-3d";
import { GameObject } from "./game-object";
import { world } from "../world";






export class GameObject3D extends GameObject {
    constructor() {
        super();

        this.node = new Group();

        this.behaviour = world?.behaviour;
        this.physics = world?.physics3d;

        const self = this;
        this.add = {
            text3D(font, options) {
                const text = new Text3D(font.texture, font.font, options);
                text.gameObject = self;
                self.node.add(text);
                return text;
            },

            mesh(geometry, material) {
                const mesh = new Mesh(geometry, material);
                mesh.gameObject = self;
                self.node.add(mesh);
                return mesh;
            },
        }
    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    _applyPosition(x, y, z) {
        this.node.position.set(x, y, z);
    }
}