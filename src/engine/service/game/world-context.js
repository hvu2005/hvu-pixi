import { World } from "engine/core/world";

export const worldContext = {
    /**
     * @type {World}
     */
    current: null,
};

/**
 * @typedef {Object} WorldOptions
 * @property {import("engine/core/render/pixi-renderer").PixiRenderer} pixi
 * @property {import("engine/core/render/three-renderer").ThreeRenderer} three
 * @param {WorldOptions} options
 * @returns {Promise<World>}
 */
export async function createWorld({pixi, three}) {
    const world = new World({ pixi: pixi, three: three });
    await world.init();
    worldContext.current = world;

    return world;
}

