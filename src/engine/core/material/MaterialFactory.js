import { Texture } from "@pixi.alias";
import { 
    MeshLambertMaterial, 
    MeshPhongMaterial, 
    MeshPhysicalMaterial,
    MeshToonMaterial,
     MeshMatcapMaterial, 
     MeshBasicMaterial, 
     MeshStandardMaterial 
    } from '@three.alias';

import { toThreeTexture } from "engine/utils/texture/ToThreeTexture";

export const Material = {};

class MaterialFactory {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Tạo hoặc lấy material từ cache
     * @param {string} name - tên định danh material
     * @param {object} options - toàn bộ config (color, map, metalness, vv)
     */
    create(name, options = {}) {
        if (this.cache.has(name)) return this.cache.get(name);

        const { type = "standard", ...params } = options;
        let mat = null;

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

        this.cache.set(name, mat);
        Material[name] = mat;
        return mat;
    }

    /**
     * Lấy material đã có
     */
    get(name) {
        return this.cache.get(name) || Material[name] || null;
    }

    /**
     * Xóa 1 material
     */
    dispose(name) {
        const mat = this.cache.get(name);
        if (mat) {
            mat.dispose();
            this.cache.delete(name);
            delete Material[name];
        }
    }

    /**
     * Xóa tất cả materials
     */
    disposeAll() {
        for (const mat of this.cache.values()) mat.dispose();
        this.cache.clear();
        for (const key in Material) delete Material[key];
    }
}

export const materialFactory = new MaterialFactory();