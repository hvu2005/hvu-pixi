import { worldContext } from "./world-context";

/**
 * @template T
 * @param {new (...args:any[]) => T} gameObjectClass 
 * @param {{layer: number, tag: string}} options 
 * @returns {T}
 */
export function instantiate(gameObjectClass, options = {renderOrder: 0, tag: ""}) {
    const go = worldContext.current.createGameObject(gameObjectClass, options);
    go.init();

    return go;
}