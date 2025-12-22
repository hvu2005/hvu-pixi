import { GameObject } from "engine/core/entity/GameObject";
import { worldContext } from "./worldContext";
import { Transform2D } from "./pixi/component/Transform2D";


export function create() {
    const gameObject = new GameObject();
    gameObject.addComponent(new Transform2D());
    worldContext.current.pixi.stage.addChild(gameObject.getComponent(Transform2D).group);

    return gameObject;
}