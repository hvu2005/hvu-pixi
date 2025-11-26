import { loadManager } from "engine/core/asset/LoadManager";
import { Assets, Texture, Rectangle } from "@pixi.alias";
import { AtlasAttachmentLoader, SkeletonJson, SpineTexture, TextureAtlas } from "@esotericsoftware/spine-pixi-v8";
import {
    MeshLambertMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshToonMaterial,
    MeshMatcapMaterial,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Texture as ThreeTexture
} from '@three.alias';
import { GLTFLoader } from '@three.alias';

export const Asset = {};

export class Loader {
    constructor() {
        loadManager.registLoader(this);
    }

    async loadAssets() {

    }

    async load(name, base64) {
        Assets.add({ alias: name, src: base64 });
        const tex = await Assets.load(name);
        Asset[name] = tex;
        return tex;
    }

    async loadBulk(list = []) {
        // Đăng ký tất cả trước
        for (const [name, base64] of list) {
            Assets.add({ alias: name, src: base64 });
        }

        // Load song song
        const loaded = await Assets.load(list.map(([name]) => name));

        // Ghi vào cache Asset
        Object.assign(Asset, loaded);

        return loaded;
    }

    async loadSheet(name, base64, col, row, w, h) {
        Assets.add({ alias: name, src: base64 });
        const baseTexture = await Assets.load(name)
        const frames = [];

        for (let y = 0; y < col; y++) {
            for (let x = 0; x < row; x++) {
                frames.push(
                    new Texture({
                        source: baseTexture,
                        frame: new Rectangle(x * w, y * h, w, h),
                    })
                );
            }
        }
        Asset[name] = frames;
        this.spriteSheets.set(name, frames);
        return frames;
    }

    async loadSpine(name, jsonData, atlasText, imgPath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imgPath;

            img.onload = () => {
                try {
                    const pixiTexture = Texture.from(img);
                    const spineTexture = new SpineTexture(pixiTexture.source);
                    const textureMap = new Map();
                    const atlasImageName = atlasText.trim().split('\n')[0].trim();
                    textureMap.set(atlasImageName, spineTexture);

                    const atlas = new TextureAtlas(atlasText, () => null);
                    atlas.setTextures(textureMap);

                    const attachmentLoader = new AtlasAttachmentLoader(atlas);
                    const skeletonParser = new SkeletonJson(attachmentLoader);
                    const skeletonData = skeletonParser.readSkeletonData(jsonData);
                    Asset[name] = skeletonData;
                    resolve(skeletonData);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('❌ Không thể load ảnh từ path: ' + imgPath));
        });
    }

    async loadModel(name, base64, options) {
        if (this.models.has(name)) {
            return this.models.get(name).clone(true);
        }

        let loader;
        let loadedObject = null;

        {
            loader = new GLTFLoader();

            const gltf = await loader.loadAsync(base64);
            loadedObject = gltf.scene || gltf.scenes[0];

            if (options) {
                loadedObject.traverse(async (child) => {
                    if (child.isMesh && !child.material.map) {
                        const mat = options.material ?? await this.loadMaterial(options.name || name, { ...options });
                        child.material = mat;
                        child.material.needsUpdate = true;
                    }
                });
            }


            this.models.set(name, loadedObject);

            Asset[name] = loadedObject;

            return loadedObject;
        }
    }

    async loadMaterial(name, options = {}) {
        if (this.materials.has(name)) return this.materials.get(name);

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
        Asset[name] = mat;
        return mat;
    }
}