import { loadPixiTexture } from "engine/asset/load-pixi-texture";
import { Scene } from "engine/service/scene";

import { GameObjectTest } from "./GameObjectTest";
import { GameObjectTest2 } from "./GameObjectTest2";
import { GameObjecTest3D } from "./GameObjecTest3D";
import { GameObjecTest3D2 } from "./GameObjectTest3D2";

import item from "assets/AS_1.png";

        
export const AssetTest = {}

export class GameScene extends Scene {
    constructor() {
        super({
            physic2d: true,
            pixi: true,
            three: true,
        })
    }

    async load() {
        AssetTest.ITEM = await loadPixiTexture(item);
    }

    create() {
        GameObjectTest();
        GameObjectTest2();
        GameObjecTest3D();
        GameObjecTest3D2();
    }
}