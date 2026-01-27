import {
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    MeshToonMaterial,
    RepeatWrapping,
    Material as ThreeMaterial,
    Vector2
} from "@three.alias";
import { Asset } from "./AssetLoader";
import { ToonShadowMaterial } from "../shader/ToonShadowMaterial";
import { ColorType } from "scripts/_config/ColorType";

//==================== USER INTERFACE ====================

export const Material = {
    SQUID: registMaterial(ToonShadowMaterial, {
        color: 0x6bffa6,
        shadowColor: 0x007830
    }),

    SQUID_EYE: registMaterial(MeshBasicMaterial, {
        color: 0x000000,
    }),

    SQUID_MOUTH: registMaterial(ToonShadowMaterial, {
        color: 0xe68398,
    }),

    RAIL: registMaterial(MeshPhongMaterial, {
        color: 0x414d7d,
        shininess: 150,
        specular: 0x9fb4ff
    }),

    TUT_HAND: registMaterial(MeshBasicMaterial, {
        get map() { return Asset.TEXTURE_TUT_HAND },
        transparent: true,
    }),

    CONVEYOR: registMaterial(MeshBasicMaterial, {
        get map() { 
            const texture = Asset.TEXTURE_GROUND_LINE;
            texture.wrapS = texture.wrapT = RepeatWrapping;

            // ===== OFFSET =====
            texture.repeat.set(15, 15);
            texture.needsUpdate = true;

            return texture;
        },
        // color: 0x37374d,
        // shadowColor: 0x21212e,
    }),

    WARNING: registMaterial(ToonShadowMaterial, {
        get map() {
            const texture = Asset.TEXTURE_WARNING;
            texture.wrapS = texture.wrapT = RepeatWrapping;

            // ===== OFFSET =====
            texture.repeat.set(4, 3);
            texture.needsUpdate = true;

            return texture;
        }

    }),

    RAIL_SHADOW: registMaterial(MeshBasicMaterial, {
        get map() { return Asset.TEXTURE_RAIL_SHADOW },
        color: 0x000000,
        transparent: true,
        opacity: 0.5,
    }),

    START: registMaterial(MeshBasicMaterial, {
        get map() { return Asset.TEXTURE_START },
        transparent: true,
        // opacity: 0.5,
    }),

    SQUID_SHADOW: registMaterial(MeshBasicMaterial, {
        get map() { return Asset.TEXTURE_SQUID_SHADOW },
        color: 0x000000,
        transparent: true,
        opacity: 0.5,
    }),


    PROJECTILE: registMaterial(MeshBasicMaterial, {
        // get map() { return Asset.TEXTURE_INK },
        color: 0x77b5fc,
        transparent: true,
        opacity: 0.5
    }),

    INK: registMaterial(MeshBasicMaterial, {
        get map() { return Asset.TEXTURE_INK },
        // color: 0x2b2e2c,
        transparent: true,
        opacity: 0.8
    }),

    TILE_WAIT: registMaterial(MeshBasicMaterial, {
        get map() { return Asset.TEXTURE_TILE_WAIT },
        transparent: true,
    }),

    BACKGROUND: registMaterial(MeshBasicMaterial, {
        get map() {
            const texture = Asset.TEXTURE_BACKGROUND;
            // texture.wrapS = texture.wrapT = RepeatWrapping;

            // // ===== OFFSET =====
            // texture.repeat.set(20, 20);
            // texture.needsUpdate = true;

            return texture;
        },
        color: 0x553e82,
    }),

    PIXEL_BLOCK: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },
        // get gradientMap() { return Asset.TEXTURE_TOON_RAMP },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,
        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    BLACK: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Black,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    BLUE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Blue,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    BROWN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Brown,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    DARK_BLUE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.DarkBlue,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    DARK_GREEN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.DarkGreen,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    DARK_YELLOW: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.DarkYellow,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    GRAY: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Gray,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    GREEN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Green,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    LIGHT_BLUE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.LightBlue,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    LIGHT_BROWN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.LightBrown,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    LIGHT_GREEN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.LightGreen,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    LIGHT_PINK: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.LightPink,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    NUDE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Nude,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    ORANGE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Orange,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    PINK: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Pink,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    PURPLE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Purple,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    RED: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Red,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    VIOLET: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Violet,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    WHITE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.White,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
    }),

    YELLOW: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 1,

        color: ColorType.Yellow,

        clearcoatSharpness: 0.8,
        saturationBoost: 1.0,
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
