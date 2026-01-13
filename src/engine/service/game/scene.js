
import { createWorld } from "./world-context";
import { System } from "engine/core/system/base/system";
import { engineModules } from "engine/service/auto-generated/stripped-modules.generated";

export class Scene {
    /**
     * 
     * @param {import("./world-context").WorldOptions} 
     */
    constructor(options = {pixi, three}) {
        this._setup(options);
    }

    /**
     * @private
     */
    async _setup(options) {
        await this.load();
        await this._setupWorld(options);
        this.create();
    }

    /**
     * @private
     */
    async _setupWorld(options) {

        const world = await createWorld(options);
        
        for (const key in engineModules) {
            if (!engineModules[key]) continue;
    
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

    async load() {}

    create() {}
}
