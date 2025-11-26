import { Loader } from "@three.alias";

import item_1 from "../assets/Items/AS_6.png";
import skinCake from "../assets/skin_cake_13.png";
import cake from "../assets/cake_01.glb";
import cam from "../assets/cam.glb";
import { Asset } from "@engine";

export class loadAssets extends Loader {
    async loadAssets() {
        await this.loadBulk(
            ["ITEM_1", item_1],
            ["SKIN_CAKE", skinCake]
        );

        await this.loadModel("CAM", cam);

        await this.loadMaterial("PINK_HEART_MAT", {
            type: "physical",
            metalness: 0.25,
            roughness: 0.3,
            emissive: 0x330033,
            emissiveIntensity: 0.25,
            transmission: 0.5,
            thickness: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            map: Asset.SKIN_CAKE
        })

        await this.loadModel("CAKE", cake, {
            name: "PinkHeart",
            type: "physical",
            metalness: 0.25,
            roughness: 0.3,
            emissive: 0x330033,
            emissiveIntensity: 0.25,
            transmission: 0.5,
            thickness: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            map: Asset.SKIN_CAKE
        });
    }
}