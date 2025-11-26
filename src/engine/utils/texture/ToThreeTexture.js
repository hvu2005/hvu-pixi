import { Texture } from '@three.alias';


export function toThreeTexture(pixiTex, options = {}) {
    if (!pixiTex || !pixiTex.source) {
        console.warn("Invalid PIXI texture:", pixiTex);
        return null;
    }

    const source = pixiTex.source.resource;

    if (!source) {
        console.warn("Texture has no source:", pixiTex);
        return null;
    }

    const tex = new Texture(source);
    tex.needsUpdate = true;

    // // apply options nếu có
    // tex.wrapS = options.wrapS ?? ClampToEdgeWrapping;
    // tex.wrapT = options.wrapT ?? ClampToEdgeWrapping;
    // tex.magFilter = options.magFilter ?? LinearFilter;
    // tex.minFilter = options.minFilter ?? LinearMipMapLinearFilter;
    // tex.colorSpace = SRGBColorSpace;

    return tex;
}