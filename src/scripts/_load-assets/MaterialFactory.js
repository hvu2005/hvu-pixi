import {
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    RepeatWrapping,
    Material as ThreeMaterial,
    Vector2
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

    SQUID_MOUTH: registMaterial(ToonShadowMaterial, {
        color: 0xe68398,
        shadowColor: 0x660015
    }),

    RAIL: registMaterial(MeshPhongMaterial, {
        color: 0x414d7d,
        shininess: 150,
        specular: 0x9fb4ff
    }),

    CONVEYOR: registMaterial(MeshPhongMaterial, {
        color: 0x37374d,
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
    }),

    BLACK: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x23262b,
        // shadowColor: 0x1b1f1b,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    BLUE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x418DFC,
        shadowColor: 0x1f4eab,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    BROWN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x734c39,
        shadowColor: 0x462C1F,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    DARK_BLUE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x4245C6,
        shadowColor: 0x082866,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    DARK_GREEN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x6F8B2D,
        shadowColor: 0x1b4712,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    DARK_YELLOW: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xe3aa27,
        shadowColor: 0x6e4a18,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    GRAY: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x829CA7,
        shadowColor: 0x363E4D,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    GREEN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x36B588,
        shadowColor: 0x196C4C,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    LIGHT_BLUE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x53DBEE,
        shadowColor: 0x297ea3,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    LIGHT_BROWN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xA48256,
        shadowColor: 0x543d1f,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    LIGHT_GREEN: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x5ede45,
        shadowColor: 0x206912,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    LIGHT_PINK: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xFF9BB0,
        shadowColor: 0x913a44,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    NUDE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xf7dab2,
        shadowColor: 0x8a5a30,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    ORANGE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xfa8b25,
        shadowColor: 0x8c3f0d,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    PINK: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xFF52B0,
        shadowColor: 0x69235f,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    PURPLE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x9974FD,
        shadowColor: 0x442d73,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    RED: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xF8454A,
        shadowColor: 0x6e151a,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    VIOLET: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0x540d8f,
        shadowColor: 0x270747,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    WHITE: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xFFFBEF,
        shadowColor: 0xa19795,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
    }),

    YELLOW: registMaterial(ToonShadowMaterial, {
        get map() { return Asset.TEXTURE_PIXEL_BLOCK },

        get matcap() { return Asset.TEXTURE_MATCAP },
        matcapIntensity: 5,

        color: 0xF8E020,
        shadowColor: 0xab6a20,

        clearcoatSharpness: 0.6,
        shadowContrast: 1.3,
        saturationBoost: 1.3,
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
