import { MeshBasicMaterial, MeshStandardMaterial, Material as ThreeMaterial } from "@three.alias";
import { Asset } from "./AssetLoader";


//==================== USER INTERFACE ====================

export const Material = {
    TRAIN: registMaterial(MeshStandardMaterial, {
        get map() {
            return Asset.TEXTURE_TRAIN;
        },
        color: 0xffffff,
    }),

    BLACK: registMaterial(MeshBasicMaterial, {
        color: 0x000000,
    }),
}

//========================================================



export async function loadMaterials() {
    for (const key of Object.keys(Material)) {
        const materialData = Material[key];
        console.log(typeof materialData.data.map === 'function');
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
