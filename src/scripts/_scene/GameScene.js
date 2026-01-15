
import { Scene } from "engine/service/game/scene";
// import { pixi } from "engine/core/render/pixi-renderer";
import { three } from "engine/core/render/three-renderer";

import { loadAssets } from "../_load-assets/AssetLoader";

// import { GameObjectTest } from "../GameObjectTest";
// import { GameObjectTest2 } from "../GameObjectTest2";
import { GameObjecTest3D } from "../GameObjecTest3D";
import { GameObjecTest3D2 } from "../GameObjectTest3D2";
import { AmbientLight, CameraView, GameObject3D, instantiate } from "engine";
import { loadMaterials } from "../_load-assets/MaterialFactory";
import CONFIG from "scripts/_config/Config";


export class GameScene extends Scene {
    constructor() {
        super({ three: three })
    }

    async load() {
        var itemLoading = document.getElementById("item-loading");
        if (itemLoading) itemLoading.style.display = "none";

        var itemLogo = document.getElementById("logo-falcon");
        if (itemLogo) itemLogo.style.display = "none";

        CONFIG.onGameReady();

        await loadAssets();
        await loadMaterials();
    }

    create() {
        const camera = instantiate(GameObject3D);
        camera.addComponent(new CameraView({
            isOrthor: true,
            fov: 30,
        }));

        const globalLight = instantiate(GameObject3D, { renderOrder: 2 });
        globalLight.addComponent(new AmbientLight(0xffffff, 2));

        // GameObjectTest();
        // GameObjectTest2();

        // for (let i = 0; i < 100; i++) {
        //     for (let j = 0; j < 10; j++) {
        //         const gameObject = GameObjecTest3D();

        //         gameObject.transform.position.set(j * 2 - 10, i * 2 - 150, 0);
        //     }
        // }
        GameObjecTest3D2();
    }
}