import { GameObject } from "engine/core/scene-graph/game-object";
import { worldContext } from "./world-context";



/**
 * @template {GameObject} T
 * @param {new (...args:any[]) => T} gameObjectClass 
 * @param {{renderOrder: number, tag: string}} options 
 * @returns {T}
 */
export function instantiate(gameObjectClass, options) {
    const go = worldContext.current.createGameObject(gameObjectClass, options);

    return go;
}