import { DisplayObject } from "pixi.js";
import { GameObject } from "./game-object";

export declare module "pixi.js" {
    interface DisplayObject {
        gameObject?: GameObject;
    }
}