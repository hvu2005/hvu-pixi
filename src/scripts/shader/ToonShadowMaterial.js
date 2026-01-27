import { MeshToonMaterial } from "@three.alias";

export class ToonShadowMaterial extends MeshToonMaterial {
    constructor(params = {}) {
        const {
            // ===== MeshToonMaterial params =====
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

            // ===== Custom =====
            matcap,
            matcapIntensity,
            saturationBoost,
        } = params;

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

        Object.keys(toonParams).forEach(k => {
            if (toonParams[k] === undefined) delete toonParams[k];
        });

        super(toonParams);
        this.instancing = true;

        // ===== Custom properties =====
        this.matcap = matcap ?? null;
        this.matcapIntensity = matcapIntensity ?? 1.5;
        this.saturationBoost = saturationBoost ?? 1.0;

        // ===== Shader injection =====
        this.onBeforeCompile = shader => {
            // ---- uniforms ----
            shader.uniforms.uMatCap = { value: this.matcap };
            shader.uniforms.uMatCapIntensity = { value: this.matcapIntensity };
            shader.uniforms.uSaturationBoost = { value: this.saturationBoost };

            // ---- fragment header ----
            shader.fragmentShader =
                `
                uniform sampler2D uMatCap;
                uniform float uMatCapIntensity;
                uniform float uSaturationBoost;

                #ifdef USE_INSTANCING_COLOR
                    varying vec3 vInstanceColor;
                #endif
                ` + shader.fragmentShader;

            // ---- matcap normal (view space) ----
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <normal_fragment_maps>',
                `
                #include <normal_fragment_maps>

                mat3 viewNormalMatrix = mat3(viewMatrix);
                vec3 nView = normalize(viewNormalMatrix * normal);

                vec2 matcapUV = nView.xy * 0.5 + 0.5;
                vec3 matcapColor = texture2D(uMatCap, matcapUV).rgb;
                `
            );

            // ---- CORE LIGHTING (bỏ shadow, chỉ giữ matcap highlight) ----
            shader.fragmentShader = shader.fragmentShader.replace(
                /vec3 outgoingLight\s*=\s*reflectedLight\.directDiffuse[\s\S]*?totalEmissiveRadiance\s*;/,
                `
                vec3 baseLit;

                #ifdef USE_INSTANCING_COLOR
                    baseLit = reflectedLight.directDiffuse * vInstanceColor;
                #else
                    baseLit = reflectedLight.directDiffuse;
                #endif

                // ---- MatCap highlight only ----
                float coat = saturate(dot(nView, vec3(0.0, 0.0, 1.0)));
                baseLit += matcapColor * coat * uMatCapIntensity;

                // ---- Saturation boost ----
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
