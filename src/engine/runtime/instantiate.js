import { worldContext } from "./worldContext";

/**
 * @template T
 * @param {new (...args:any[]) => T} gameObjectClass 
 * @returns {T}
 */
export function instantiate(gameObjectClass) {
    const go = worldContext.current.createGameObject(gameObjectClass);
    go.init();

    return go;
}