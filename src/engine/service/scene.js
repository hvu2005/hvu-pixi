import { pixi } from "engine/core/render/pixi-renderer";
import { three } from "engine/core/render/three-renderer";
import { createWorld } from "./world-context";
import { System } from "engine/core/system/base/system";
import { engineModules } from "./stripped-modules";


/**
 * @typedef {Object} SystemConfig
 * @property {boolean} [physic2d]
 * @property {boolean} [pixi]
 * @property {boolean} [three]
 */

export class Scene {
    /**
     * 
     * @param {SystemConfig} systemConfig 
     */
    constructor(systemConfig = {}) {
        this.systemConfig = {
            physic2d: false,
            pixi: false,
            three: false,
            ...systemConfig,
        };
        this._setup();
    }

    /**
     * @private
     */
    async _setup() {
        await this.load();
        await this._setupWorld();
        this.create();
    }

    /**
     * @private
     */
    async _setupWorld() {

        const world = await createWorld({ pixi: pixi, three: three });
        
        setupSystems(world, this.systemConfig);
    }

    async load() {}

    create() {}
}

export function setupSystems(world, sceneConfig) {
    for (const key in sceneConfig) {
        if (!sceneConfig[key]) continue;

        const moduleExports = engineModules[key];

        if (!moduleExports) continue; // folder bị strip → skip

        // Quét tất cả export trong module
        for (const value of Object.values(moduleExports)) {
            // ❌ Không phải function (class) → bỏ qua
            if (typeof value !== "function") continue;

            // ❌ Class không extend BaseSystem → bỏ qua
            if (!(value.prototype instanceof System)) continue;

            // ✔ Class là System → auto create
            world.createSystem(value);
        }
    }
}