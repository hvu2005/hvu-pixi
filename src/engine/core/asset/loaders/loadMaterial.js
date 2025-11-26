import {
    MeshPhysicalMaterial,
    MeshPhongMaterial,
    MeshLambertMaterial,
    MeshToonMaterial,
    MeshMatcapMaterial,
    MeshBasicMaterial,
    MeshStandardMaterial
    , Texture as ThreeTexture
} from "@three.alias";
import { Texture } from "@pixi.alias";
import { AssetX, loadManager } from "../LoadManager";

export async function loadMaterial(name, options = {}) {
    if (loadManager.materials.has(name)) return loadManager.materials.get(name);

    const { type = "standard", ...params } = options;
    let mat = null;

    const toThreeTexture = (pixiTex) => {
        if (!pixiTex || !pixiTex.source) {
            console.warn("Invalid PIXI texture:", pixiTex);
            return null;
        }

        const source = pixiTex.source.resource;

        if (!source) {
            console.warn("Texture has no source:", pixiTex);
            return null;
        }

        const tex = new ThreeTexture(source);
        tex.needsUpdate = true;

        // // apply options nếu có
        // tex.wrapS = options.wrapS ?? ClampToEdgeWrapping;
        // tex.wrapT = options.wrapT ?? ClampToEdgeWrapping;
        // tex.magFilter = options.magFilter ?? LinearFilter;
        // tex.minFilter = options.minFilter ?? LinearMipMapLinearFilter;
        // tex.colorSpace = SRGBColorSpace;

        return tex;
    };

    // --- Convert Pixi Texture sang Three Texture ---
    if (params.map instanceof Texture) {
        params.map = toThreeTexture(params.map);
    }
    if (params.normalMap instanceof Texture) {
        params.normalMap = toThreeTexture(params.normalMap);
    }
    if (params.roughnessMap instanceof Texture) {
        params.roughnessMap = toThreeTexture(params.roughnessMap);
    }
    if (params.metalnessMap instanceof Texture) {
        params.metalnessMap = toThreeTexture(params.metalnessMap);
    }
    if (params.emissiveMap instanceof Texture) {
        params.emissiveMap = toThreeTexture(params.emissiveMap);
    }

    switch (type) {
        case "physical":
            mat = new MeshPhysicalMaterial({ ...params });
            break;
        case "phong":
            mat = new MeshPhongMaterial({ ...params });
            break;
        case "lambert":
            mat = new MeshLambertMaterial({ ...params });
            break;
        case "toon":
            mat = new MeshToonMaterial({ ...params });
            break;
        case "matcap":
            mat = new MeshMatcapMaterial({ ...params });
            break;
        case "basic":
            mat = new MeshBasicMaterial({ ...params });
            break;
        default:
            mat = new MeshStandardMaterial({ ...params });
            break;
    }


    // --- 🌟 Thêm setter động cho các map ---
    for (const key of ["map", "normalMap", "emissiveMap"]) {
        let _tex = mat[key];
        Object.defineProperty(mat, key, {
            get() {
                return _tex;
            },
            set(value) {
                let tex = value;
                // nếu là PIXI.Texture → convert sang Three.Texture
                if (value?.source) tex = toThreeTexture(value);

                _tex = tex;
                mat[key] = tex;
                if (tex) tex.needsUpdate = true;
                mat.needsUpdate = true;
            }
        });
    }

    this.materials.set(name, mat);
    AssetX[name] = mat;
    return mat;
}