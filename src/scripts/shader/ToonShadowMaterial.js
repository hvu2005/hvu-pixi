import { MeshToonMaterial, Color } from "@three.alias";

/**
 * @typedef {Object} ToonShadowMaterialParams
 * @property {import("@three.alias").Color | number | string} [color]
 * @property {import("@three.alias").Texture} [gradientMap]
 * @property {import("@three.alias").Texture} [map]
 * @property {import("@three.alias").Texture} [lightMap]
 * @property {number} [lightMapIntensity]
 * @property {import("@three.alias").Texture} [aoMap]
 * @property {number} [aoMapIntensity]
 * @property {import("@three.alias").Color | number | string} [emissive]
 * @property {number} [emissiveIntensity]
 * @property {import("@three.alias").Texture} [emissiveMap]
 * @property {import("@three.alias").Texture} [bumpMap]
 * @property {number} [bumpScale]
 * @property {import("@three.alias").Texture} [normalMap]
 * @property {number} [normalMapType]
 * @property {import("@three.alias").Vector2} [normalScale]
 * @property {import("@three.alias").Texture} [displacementMap]
 * @property {number} [displacementScale]
 * @property {number} [displacementBias]
 * @property {import("@three.alias").Texture} [alphaMap]
 * @property {boolean} [wireframe]
 * @property {number} [wireframeLinewidth]
 * @property {boolean} [fog]
 * // ToonShadowMaterial custom parameters:
 * @property {import("@three.alias").Color | number | string} [shadowColor]
 * @property {import("@three.alias").Color | number | string} [highlightColor]
 * @property {import("@three.alias").Texture} [matcap]
 * @property {number} [matcapIntensity]
 * @property {number} [clearcoatSharpness]
 * @property {number} [shadowContrast]
 * @property {number} [saturationBoost]
 */

export class ToonShadowMaterial extends MeshToonMaterial {
    /**
     * @param {ToonShadowMaterialParams} params
     */
    constructor(params = {}) {
        // Lọc params chỉ chứa các thuộc tính hợp lệ của MeshToonMaterial
        const {
            color,
            gradientMap,
            map,
            lightMap,
            lightMapIntensity,
            aoMap,
            aoMapIntensity,
            emissive,
            emissiveIntensity,
            emissiveMap,
            bumpMap,
            bumpScale,
            normalMap,
            normalMapType,
            normalScale,
            displacementMap,
            displacementScale,
            displacementBias,
            alphaMap,
            wireframe,
            wireframeLinewidth,
            fog,
            // Custom toon-shadow attributes
            shadowColor,
            highlightColor,
            matcap,
            matcapIntensity,
            clearcoatSharpness,
            shadowContrast,
            saturationBoost,
            ...rest // ignore any other unknown keys (future-proof)
        } = params;

        // Các thuộc tính chuẩn cho MeshToonMaterial
        const toonParams = {
            color,
            gradientMap,
            map,
            lightMap,
            lightMapIntensity,
            aoMap,
            aoMapIntensity,
            emissive,
            emissiveIntensity,
            emissiveMap,
            bumpMap,
            bumpScale,
            normalMap,
            normalMapType,
            normalScale,
            displacementMap,
            displacementScale,
            displacementBias,
            alphaMap,
            wireframe,
            wireframeLinewidth,
            fog,
        };

        // Remove undefined attributes (để không truyền undefined vào constructor gốc)
        Object.keys(toonParams).forEach(key => {
            if (toonParams[key] === undefined) delete toonParams[key];
        });

        // super chỉ truyền vào các thuộc tính của MeshToonMaterial
        super(toonParams);

        // Shadow & Highlight
        this.shadowColor = new Color(shadowColor ?? 0x222222);
        this.highlightColor = new Color(highlightColor ?? 0xffffff);

        // MatCap (dùng làm clearcoat)
        this.matcap = matcap ?? null;
        this.matcapIntensity = matcapIntensity ?? 1.5;
        this.clearcoatSharpness = clearcoatSharpness ?? 0.35; // giống clearcoatRoughness thấp

        // Color boosters
        this.shadowContrast = shadowContrast ?? 1;
        this.saturationBoost = saturationBoost ?? 1;

        this.onBeforeCompile = shader => {

            shader.uniforms.uShadowColor = { value: this.shadowColor };
            shader.uniforms.uHighlightColor = { value: this.highlightColor };

            shader.uniforms.uMatCap = { value: this.matcap };
            shader.uniforms.uMatCapIntensity = { value: this.matcapIntensity };
            shader.uniforms.uClearcoatSharpness = { value: this.clearcoatSharpness };

            shader.uniforms.uShadowContrast = { value: this.shadowContrast };
            shader.uniforms.uSaturationBoost = { value: this.saturationBoost };

            shader.fragmentShader =
            `
            uniform vec3 uShadowColor;
            uniform vec3 uHighlightColor;

            uniform sampler2D uMatCap;
            uniform float uMatCapIntensity;
            uniform float uClearcoatSharpness;

            uniform float uShadowContrast;
            uniform float uSaturationBoost;
            ` + shader.fragmentShader;

            // MatCap calculation
            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <normal_fragment_maps>`,
                `
                #include <normal_fragment_maps>

                // View space normal (giống Unity matcap)
                mat3 viewNormalMatrix = mat3(viewMatrix);
                vec3 nView = normalize(viewNormalMatrix * normal);

                vec2 matcapUV = nView.xy * 0.5 + 0.5;
                vec3 matcapColor = texture2D(uMatCap, matcapUV).rgb;
                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                /vec3 outgoingLight\s*=\s*reflectedLight\.directDiffuse[\s\S]*?totalEmissiveRadiance\s*;/,
                `               
                float NL = clamp(dot(normal, directionalLights[0].direction), 0.0, 1.0);
                float ramp = pow(NL, uShadowContrast);

                // Shadow ramp
                vec3 baseLit = mix(uShadowColor, reflectedLight.directDiffuse, ramp);

                // == Clearcoat-like highlight (PhysicalMaterial style) ==
                // === MatCap highlight (independent from light) ===
                float coat = pow(
                    saturate(dot(nView, vec3(0.0, 0.0, 1.0))),
                    uClearcoatSharpness * 10.0
                );

                vec3 coatHighlight = matcapColor * coat * uMatCapIntensity;

                baseLit += coatHighlight;

                // Saturation enhancement (cho màu đậm đẹp dạng lego)
                float gray = dot(baseLit, vec3(0.299, 0.587, 0.114));
                baseLit = mix(vec3(gray), baseLit, uSaturationBoost);

                vec3 outgoingLight =
                    baseLit +
                    reflectedLight.indirectDiffuse +
                    totalEmissiveRadiance;
                `
            );

            this.userShader = shader;
        };

        this.needsUpdate = true;
    }
}
