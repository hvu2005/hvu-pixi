
import { Scene } from "engine/service/game/scene";
import { three } from "engine/core/render/three-renderer";

import { loadAssets } from "../_load-assets/AssetLoader";

import { AmbientLight, CameraView, DirectionalLight, GameObject3D, MeshRenderer, instantiate } from "engine";
import { loadMaterials } from "../_load-assets/MaterialFactory";
import CONFIG from "scripts/_config/Config";
import { createTileEntity } from "scripts/model/TileEntity";
import { createLevelGenerator, levelGenerator } from "scripts/controller/LevelGenerator";
import { createRail } from "scripts/model/Rail";
import { createBackground } from "scripts/model/Background";
import { createTouchController } from "scripts/controller/TouchController";
import { createPathController } from "scripts/controller/PathController";
import { createTileEntityController } from "scripts/controller/TileEntityController";
import { createGameFlowController } from "scripts/controller/GameFlowController";



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
        this.camera = instantiate(GameObject3D, {
            components: [
                new CameraView({
                    isOrthor: true,
                    fov: 17,
                })
            ],
            rotation: [-Math.PI / 2.5, 0, 0],
            position: [0, 20, 3.5]
        });

        this.globalLight = instantiate(GameObject3D, {
            components: [
                new DirectionalLight(0xffffff, 3),
                new AmbientLight(0xffffff, 0.5)
            ],
            position: [0, 5, 2.5],
            rotation: [Math.PI * 70 / 180, Math.PI / 4, 0]
        });

        this._game();
    }

    _game() {
        createLevelGenerator();
        createTouchController();
        createPathController();
        createTileEntityController();
        createGameFlowController();

        createRail();
        createBackground();
    }
}