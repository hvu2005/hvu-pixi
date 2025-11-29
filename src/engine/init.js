import { world } from "./core/World";



export async function init(options = { pixi, three }) {
    await world.init(options);
}