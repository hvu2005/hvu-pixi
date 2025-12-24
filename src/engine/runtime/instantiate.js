import { worldContext } from "./worldContext";




export function instantiate(gameObjectClass) {
    const go = worldContext.current.createGameObject(gameObjectClass);
    go.init();

    return go;
}