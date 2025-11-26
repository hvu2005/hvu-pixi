import { containerBootstrap, gameLifecycle, system } from "./core.d";
import { assetLoader } from "./asset/AssetLoader";
import { safeExportManager } from "./safe/SafeExportManager";
import { sceneManager } from "./sence/SceneManager";
import { appEngine } from "./runtime/AppEngine";
import { loadManager } from "./asset/LoadManager";





export class GameInitializer {
    constructor() {

    }

    async initLifecycle() {
        await appEngine.__init();
        await loadManager.__init();
        await assetLoader.loadAssets();

        await containerBootstrap.__init();

        await gameLifecycle.__init();
        await system.__init();
        await sceneManager.__init();
        await safeExportManager.__init();

    }

}

export const gameInitializer = new GameInitializer();