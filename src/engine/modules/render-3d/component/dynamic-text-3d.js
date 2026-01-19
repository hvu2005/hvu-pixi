import { Renderer } from "engine/core/component/renderer";
import {
    Mesh,
    BufferGeometry,
    BufferAttribute,
    MeshBasicMaterial,
    DoubleSide,
    PlaneGeometry
} from "engine/alias/three-alias";

export class DynamicText3D extends Renderer {

    /**
     * @param {Texture} atlasTex
     * @param {Object} fontJson
     * @param {Object} options
     */
    constructor(atlasTex, fontJson, options = {}) {
        super();

        this.font = fontJson;
        this.texture = atlasTex;

        this.maxChars = options.maxChars || 32;
        this.size = options.size || 1;
        this.align = options.align || "left"; // left | center | right

        this._charCount = 0;

        this._buildGeometry();
        this._buildMaterial();

        this.mesh = new Mesh(this.geometry, this.material);

        this.mesh.position.set(...options.position || [0, 0, 0]);
        this.mesh.rotation.set(...options.rotation || [0, 0, 0]);
        this.mesh.scale.set(...options.scale || [1, 1, 1]);
    }

    _buildGeometry() {
        const quadCount = this.maxChars;
        const vertCount = quadCount * 4;
        const indexCount = quadCount * 6;

        const positions = new Float32Array(vertCount * 3);
        const uvs = new Float32Array(vertCount * 2);
        const indices = new Uint16Array(indexCount);

        let vi = 0;
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

        this.geometry = new BufferGeometry();
        this.geometry.setAttribute("position", new BufferAttribute(positions, 3));
        this.geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
        this.geometry.setIndex(new BufferAttribute(indices, 1));

        this.geometry.setDrawRange(0, 0);

        // console.log(this.geometry);
        // this.geometry = new PlaneGeometry(1, 1);

    }

    _buildMaterial() {
        this.material = new MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            side: DoubleSide,
            depthWrite: false,
            color: 0xffffff
        });
        this.texture.needsUpdate = true;

    }

    /**
     * @param {string} text
     */
    setText(text) {
        const chars = [...text];
        const max = Math.min(chars.length, this.maxChars);

        const pos = this.geometry.attributes.position.array;
        const uv = this.geometry.attributes.uv.array;

        const scaleW = this.font.common.scaleW;
        const scaleH = this.font.common.scaleH;

        let cursorX = 0;

        // đo width để align
        let totalWidth = 0;
        for (let i = 0; i < max; i++) {
            const ch = this.font.chars[chars[i]];
            if (!ch) continue;
            totalWidth += ch.xadvance;
        }

        if (this.align === "center") cursorX = -totalWidth / 2;
        if (this.align === "right") cursorX = -totalWidth;

        let vi = 0;

        let count = 0;
        
        for (let i = 0; i < max; i++) {
            const c = chars[i];
            const ch = this.font.chars[c];
            if (!ch) continue;

            const x0 = cursorX + ch.xoffset;
            const y0 = -ch.yoffset;
            const x1 = x0 + ch.w;
            const y1 = y0 - ch.h;

            const y = ch.w / ch.h;
            const x = ch.h / ch.w;

            console.log(x, y);

            const b = count;
            count += x;
            // position
            pos.set([
                b, 0, 0,
                y, 0, 0,
                y, 1, 0,
                b, 1, 0
            ], vi * 3);
            
            console.log([x0, y0, 0, x1, y0, 0, x1, y1, 0, x0, y1, 0]);
            // uv
            const u0 = ch.x / scaleW;
            const v0 = 1 - ch.y / scaleH;
            const u1 = (ch.x + ch.w) / scaleW;
            const v1 = 1 - (ch.y + ch.h) / scaleH;

            uv.set([u0, v0, u1, v0, u1, v1, u0, v1], vi * 2);

            vi += 4;
            cursorX += ch.xadvance;
        }

        this._charCount = vi / 4;

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.uv.needsUpdate = true;
        this.geometry.setDrawRange(0, max * 6);
        this.geometry.computeBoundingSphere();

        // const poss = this.geometry.attributes.position.array;

        // // quad 1
        // poss.set([
        //     0, 0, 0,
        //     1, 0, 0,
        //     1, 1, 0,
        //     0, 1, 0,
        // ], 0);

        // // quad 2 (dịch sang phải)
        // poss.set([
        //     1.2, 0, 0,
        //     1.9, 0, 0,
        //     1.9, 1, 0,
        //     1.2, 1, 0,
        // ], 12); // ⚠️ 4 vertex * 3 = offset 12

        // this.geometry.attributes.position.needsUpdate = true;

        // // ⚠️ 2 quad = 12 indices
        // this.geometry.setDrawRange(0, 12);

        // this.geometry.computeBoundingSphere();
        // console.log("chars keys:", Object.keys(this.font.chars).slice(0, 999));
        // console.log("glyph A:", this.font.chars["B"]);
        // console.log("text:", text);
    }

    /**
     * @returns {Mesh}
     */
    getNode() {
        return this.mesh;
    }

    _onAttach() {
        this.gameObject.transform.addRenderNode(this.mesh);
    }

    _onDestroy() {
        this.gameObject.transform.removeRenderNode(this.mesh);
        this.geometry.dispose();
        this.material.dispose();
    }
}
