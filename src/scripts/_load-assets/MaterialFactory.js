import {
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    Material as ThreeMaterial
} from "@three.alias";
import { Asset } from "./AssetLoader";
import { ToonShadowMaterial } from "../shader/ToonShadowMaterial";

//==================== USER INTERFACE ====================

export const Material = {
    SQUID: registMaterial(ToonShadowMaterial, {
        color: 0x6bffa6,
        shadowColor: 0x007830
    }),

    SQUID_EYE: registMaterial(MeshBasicMaterial, {
        color: 0x000000,
    }),
}

//========================================================



export async function loadMaterials() {
    for (const key of Object.keys(Material)) {
        const materialData = Material[key];
        const material = new materialData.type(...materialData.data);

        Material[key] = material;
    }
}

/**
 * @template {new (...args: any[]) => ThreeMaterial} T
 *
 * @param {T} materialClass
 * @param {...ConstructorParameters<T>} materialData
 *
 * @returns {{
*   type: T,
*   data: ConstructorParameters<T>
* }}
*/
function registMaterial(materialClass, ...materialData) {
    return {
        type: materialClass,
        data: materialData
    };
}
