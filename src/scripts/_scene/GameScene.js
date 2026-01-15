
import { Scene } from "engine/service/game/scene";
import { pixi } from "engine/core/render/pixi-renderer";
import { three } from "engine/core/render/three-renderer";

import { loadAssets } from "../_load-assets.js/AssetLoader";

import { GameObjectTest } from "../GameObjectTest";
import { GameObjectTest2 } from "../GameObjectTest2";
import { GameObjecTest3D } from "../GameObjecTest3D";
import { GameObjecTest3D2 } from "../GameObjectTest3D2";
import { AmbientLight, CameraView, GameObject3D, instantiate } from "engine";
import { loadMaterials } from "../_load-assets.js/MaterialFactory";


export class GameScene extends Scene {
    constructor() {
        super({pixi: pixi, three: three})
    }

    async load() {
        await loadAssets();
        await loadMaterials();
    }

    create() {
        const camera = instantiate(GameObject3D);
        camera.addComponent(new CameraView({
            isOrthor: true,
            fov: 5,
        }));

        const globalLight = instantiate(GameObject3D, {renderOrder: 2});
        globalLight.addComponent(new AmbientLight(0xffffff, 2));

        GameObjectTest();
        GameObjectTest2();
        GameObjecTest3D();
        GameObjecTest3D2();
    }
}