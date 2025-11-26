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

export { default as item1 } from "../../../assets/Items/AS_6.png";

//item
import item_1 from "../../../assets/Items/AS_6.png";
import item_2 from "../../../assets/Items/AS_9.png";
import item_3 from "../../../assets/Items/AS_13.png";
import item_4 from "../../../assets/Items/AS_17.png";
import item_5 from "../../../assets/Items/AS_19.png";
import item_6 from "../../../assets/Items/AS_22.png";
import item_7 from "../../../assets/Items/AS_24.png";
import item_8 from "../../../assets/Items/AS_26.png";
import item_9 from "../../../assets/Items/AS_34.png";
import item_10 from "../../../assets/Items/AS_38.png";
import item_11 from "../../../assets/Items/AS_41.png";
import item_12 from "../../../assets/Items/AS_43.png";
import item_13 from "../../../assets/Items/AS_46.png";
import item_14 from "../../../assets/Items/AS_59.png";
import item_15 from "../../../assets/Items/AS_62.png";
import item_16 from "../../../assets/Items/AS_66.png";
import item_17 from "../../../assets/Items/AS_69.png";
import item_18 from "../../../assets/Items/AS_75.png";
import item_19 from "../../../assets/Items/AS_83.png";
import item_20 from "../../../assets/Items/AS_84.png";
import item_21 from "../../../assets/Items/AS_110.png";

//box
import box from "../../../assets/box/box.png";
import cover from "../../../assets/box/cover.png";

//tutHand
import tutHand from "../../../assets/tutorial/tay.png";
import tutHandShadow from "../../../assets/tutorial/tay2.png";

//match
import like from "../../../assets/match/like.png";
import matchEmoji from "../../../assets/match/matcuoi.png";
import amazingText from "../../../assets/match/Amazing.png";
import greatText from "../../../assets/match/Great.png";
import perfectText from "../../../assets/match/Perfect.png";
import goodText from "../../../assets/match/Good.png";
import coolText from "../../../assets/match/Cool.png";
import excellentText from "../../../assets/match/Excellent.png";
import saoSheet from "../../../assets/match/sao_sheet.png";
import star from "../../../assets/match/star.png";

//bg
import bg from "../../../assets/bg2.png";

import skinCake from "../../../assets/skin_cake_13.png";
import cake from "../../../assets/cake_01.glb";
import cam from "../../../assets/cam.glb";
import { GLTFLoader } from '@three.alias';

export const Asset = {}; // enum động

class AssetLoader {
    constructor() {
        this.models = new Map();
        this.spriteSheets = new Map(); // cache sprite sheet frames
        this.spines = new Map();
        this.materials = new Map();

        this.loaders = [];
    }

    async __init() {
        for (const loader of this.loaders) {
            await loader.loadAssets();
        }
    }

    registLoader(loader) {
        this.loaders.push(loaders);
    }


    //load assets ở đây
    async loadAssets() {

        //item
        await this.loadBulk([
            ["ITEM_1", item_1],
            ["ITEM_2", item_2],
            ["ITEM_3", item_3],
            ["ITEM_4", item_4],
            ["ITEM_5", item_5],
            ["ITEM_6", item_6],
            ["ITEM_7", item_7],
            ["ITEM_8", item_8],
            ["ITEM_9", item_9],
            ["ITEM_10", item_10],
            ["ITEM_11", item_11],
            ["ITEM_12", item_12],
            ["ITEM_13", item_13],
            ["ITEM_14", item_14],
            ["ITEM_15", item_15],
            ["ITEM_16", item_16],
            ["ITEM_17", item_17],
            ["ITEM_18", item_18],
            ["ITEM_19", item_19],
            ["ITEM_20", item_20],
            ["ITEM_21", item_21],
            ["SKIN_CAKE", skinCake]
        ])

        //box
        await this.loadBulk([
            ["BOX", box],
            ["COVER", cover]
        ])

        //tutHand
        await this.loadBulk([
            ["TUT_HAND", tutHand],
            ["TUT_HAND_SHADOW", tutHandShadow],
        ])

        //match
        await this.loadBulk([
            ["LIKE", like],
            ["MATCH_EMOJI", matchEmoji],
            ["AMAZING_TEXT", amazingText],
            ["GREAT_TEXT", greatText],
            ["PERFECT_TEXT", perfectText],
            ["GOOD_TEXT", goodText],
            ["COOL_TEXT", coolText],
            ["EXCELLENT_TEXT", excellentText],
            ["STAR", star],
        ])
        await this.loadSheet("SAO_ANIM", saoSheet, 4, 5, 271, 310);

        //bg
        await this.load("BG", bg);

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

export const assetLoader = new AssetLoader();