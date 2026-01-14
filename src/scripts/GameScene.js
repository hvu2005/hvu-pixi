
import { Scene } from "engine/service/game/scene";
import { pixi } from "engine/core/render/pixi-renderer";
import { three } from "engine/core/render/three-renderer";

import { loadAssets } from "./AssetLoader";

import { GameObjectTest } from "./GameObjectTest";
import { GameObjectTest2 } from "./GameObjectTest2";
import { GameObjecTest3D } from "./GameObjecTest3D";
import { GameObjecTest3D2 } from "./GameObjectTest3D2";


export class GameScene extends Scene {
    constructor() {
        super({pixi: pixi, three: three})
    }

    async load() {
        await loadAssets();
    }

    create() {
        GameObjectTest();
        GameObjectTest2();
        GameObjecTest3D();
        GameObjecTest3D2();
    }
}