import { BufferGeometry, Material, Mesh, Object3D } from "three";
import { BehaviourSystem } from "./behaviour-system";
import { Scene } from "./scene";

type AddFacade = {
    mesh: (geometry: BufferGeometry, material: Material) => Object3D;
}

export class GameObject {
    private scene!: Scene;
    public add: AddFacade;

    public constructor() {
        this.add = {
            mesh: (geometry: BufferGeometry, material: Material) => {
                const mesh = new Mesh(geometry, material);
                mesh.gameObject = this;
                return mesh;
            }
        }
    }

    public setScene(scene: Scene): void {
        this.scene = scene;
    }

    get behaviour(): BehaviourSystem {
        return this.scene.behaviour;
    }

}