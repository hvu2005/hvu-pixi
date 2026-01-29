import { Group, Mesh, BufferGeometry, Material } from "three";
import { Text3D } from "../extension-objects/text-3d";
import { GameObject } from "./game-object";
import { world } from "../world";

type FontType = {
    texture: any;
    font: any;
};

type Text3DOptions = Record<string, any>;

export interface GameObject3DAdd {
    /**
     * Create and add a Text3D to this GameObject3D.
     * @param font The font object containing at least { texture, font }
     * @param options Additional options for Text3D
     */
    text3D(font: FontType, options?: Text3DOptions): Text3D;

    /**
     * Create and add a Mesh to this GameObject3D.
     * @param geometry The BufferGeometry for the mesh.
     * @param material The material or array of materials.
     */
    mesh(geometry: BufferGeometry, material: Material | Material[]): Mesh;
}

export class GameObject3D extends GameObject {
    public override node: Group;
    public override behaviour: any;
    public override physics: any;
    public override add: GameObject3DAdd;

    constructor() {
        super();

        this.node = new Group();

        this.behaviour = world?.behaviour;
        this.physics = world?.physics3d;

        const self = this;
        this.add = {
            text3D(font: FontType, options?: Text3DOptions): Text3D {
                const text = new Text3D(font.texture, font.font, options);
                (text as any).gameObject = self;
                self.node.add(text);
                return text;
            },

            mesh(geometry: BufferGeometry, material: Material | Material[]): Mesh {
                const mesh = new Mesh(geometry, material);
                (mesh as any).gameObject = self;
                self.node.add(mesh);
                return mesh;
            },
        };
    }

    /**
     * @protected
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    protected override _applyPosition(x: number, y: number, z: number): void {
        this.node.position.set(x, y, z);
    }
}