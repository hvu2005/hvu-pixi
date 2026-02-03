import { Object3D } from "three";
import { GameObject } from "./game-object";

declare module "three" {
    interface Object3D {
        gameObject?: GameObject;
    }
}
