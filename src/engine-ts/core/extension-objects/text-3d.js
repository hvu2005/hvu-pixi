import {
    Mesh,
    BufferGeometry,
    BufferAttribute,
    MeshBasicMaterial,
    DoubleSide
} from "engine/alias/three-alias";

/**
 * @typedef {Object} Text3DOptions
 * @property {number} [maxChars=999]
 * @property {number} [size=1]
 * @property {string} [align="left"]
 * @property {number} [color=0xffffff]
 * @property {number} [opacity=1]
 * @property {string} [text=""]
 */

export class Text3D extends Mesh {

    /**
     * @param {Texture} atlasTex
     * @param {Object} fontJson
     * @param {Text3DOptions} options
     */
    constructor(atlasTex, fontJson, options = {}) {

        const geometry = Text3D._buildGeometry(options.maxChars || 999);
        const material = Text3D._buildMaterial(
            atlasTex,
            options.color || 0xffffff,
            options.opacity || 1
        );
        super(geometry, material);

        this.font = fontJson;
        this.texture = atlasTex;

        this.maxChars = options.maxChars || 999;
        this.align = options.align || "left";

        this._charCount = 0;


        this.setText(options.text || "");
    }

    // ---------- STATIC BUILDERS ----------

    static _buildGeometry(maxChars) {
        const quadCount = maxChars;
        const vertCount = quadCount * 4;
        const indexCount = quadCount * 6;

        const positions = new Float32Array(vertCount * 3);
        const uvs = new Float32Array(vertCount * 2);
        const indices = new Uint16Array(indexCount);

        let ii = 0;
        for (let i = 0; i < quadCount; i++) {
            const v = i * 4;
            indices[ii++] = v;
            indices[ii++] = v + 1;
            indices[ii++] = v + 2;
            indices[ii++] = v;
            indices[ii++] = v + 2;
            indices[ii++] = v + 3;
        }

        const geo = new BufferGeometry();
        geo.setAttribute("position", new BufferAttribute(positions, 3));
        geo.setAttribute("uv", new BufferAttribute(uvs, 2));
        geo.setIndex(new BufferAttribute(indices, 1));
        geo.setDrawRange(0, 0);

        return geo;
    }

    static _buildMaterial(texture, color, opacity) {
        texture.needsUpdate = true;
        return new MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: DoubleSide,
            depthWrite: false,
            color: color,
            opacity: opacity
        });
    }

    // ---------- API ----------

    setColor(color) {
        this.material.color.set(color);
    }

    setOpacity(opacity) {
        this.material.opacity = opacity;
    }

    /**
     * @param {string} text
     */
    setText(text) {
        const chars = [...text];
        const max = Math.min(chars.length, this.maxChars);

        const pos = this.geometry.attributes.position.array;
        const uv = this.geometry.attributes.uv.array;

        const { scaleW, scaleH, lineHeight } = this.font.common;

        let totalWidth = 0;
        for (let i = 0; i < max; i++) {
            const ch = this.font.chars[chars[i]];
            if (!ch) continue;

            const kerning = i > 0
                ? this.font.kernings[chars[i - 1] + chars[i]] || 0
                : 0;

            totalWidth += (i === max - 1)
                ? kerning + ch.xoffset + ch.w
                : kerning + ch.xadvance;
        }

        let cursorX = 0;
        if (this.align === "center") cursorX = -totalWidth / 2;
        else if (this.align === "right") cursorX = -totalWidth;

        let vi = 0;
        let x = cursorX;

        for (let i = 0; i < max; i++) {
            const ch = this.font.chars[chars[i]];
            if (!ch) continue;

            if (i > 0) {
                x += this.font.kernings[chars[i - 1] + chars[i]] || 0;
            }

            const x0 = x + ch.xoffset;
            const y0 = lineHeight - ch.yoffset;
            const x1 = x0 + ch.w;
            const y1 = y0 - ch.h;

            pos.set([
                x0, y1, 0,
                x1, y1, 0,
                x1, y0, 0,
                x0, y0, 0
            ], vi * 3);

            const u0 = ch.x / scaleW;
            const v0 = 1 - ch.y / scaleH;
            const u1 = (ch.x + ch.w) / scaleW;
            const v1 = 1 - (ch.y + ch.h) / scaleH;

            uv.set([
                u0, v1,
                u1, v1,
                u1, v0,
                u0, v0
            ], vi * 2);

            vi += 4;
            x += ch.xadvance;
        }

        for (let i = vi; i < this.maxChars * 4; i++) {
            pos[i * 3] = pos[i * 3 + 1] = pos[i * 3 + 2] = 0;
        }

        this._charCount = vi / 4;
        this.geometry.setDrawRange(0, this._charCount * 6);

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.uv.needsUpdate = true;
        this.geometry.computeBoundingSphere();
    }

    dispose() {
        this.geometry.dispose();
        // this.material.dispose();
    }
}