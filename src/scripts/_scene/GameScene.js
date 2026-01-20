
import { Scene } from "engine/service/game/scene";
import { three } from "engine/core/render/three-renderer";

import { loadAssets } from "../_load-assets/AssetLoader";

import { AmbientLight, CameraView, DirectionalLight, GameObject3D, instantiate } from "engine";
import { loadMaterials } from "../_load-assets/MaterialFactory";
import CONFIG from "scripts/_config/Config";
import { createTileEntity } from "scripts/model/TileEntity";
import { createLevelGenerator, levelGenerator } from "scripts/controller/LevelGenerator";



export class GameScene extends Scene {
    constructor() {
        super({ three: three })
    }

    async load() {
        var itemLoading = document.getElementById("item-loading");
        if (itemLoading) itemLoading.style.display = "none";

        var itemLogo = document.getElementById("logo-falcon");
        if (itemLogo) itemLogo.style.display = "none";

        await loadAssets();
        await loadMaterials();
        CONFIG.onGameReady();
    }

    create() {
        const camera = instantiate(GameObject3D);
        camera.addComponent(new CameraView({
            isOrthor: true,
            fov: 20,
        }));
        camera.transform.rotation.set(-Math.PI / 3, 0, 0);

        const globalLight = instantiate(GameObject3D);
        globalLight.addComponent(new DirectionalLight(0xffffff, 3));
        globalLight.addComponent(new AmbientLight(0xffffff, 0.5));
        globalLight.transform.rotation.set(Math.PI * 70 / 180, Math.PI / 4, 0);
        globalLight.transform.position.set(0, 5, 2.5);


        this._game();
    }

    _game() {
        createLevelGenerator();

        createTileEntity();
    }
}