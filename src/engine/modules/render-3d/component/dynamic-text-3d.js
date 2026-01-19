import { Renderer } from "engine/core/component/renderer";
import {
    Mesh,
    BufferGeometry,
    BufferAttribute,
    MeshBasicMaterial,
    DoubleSide,
} from "engine/alias/three-alias";

/**
 * @typedef {Object} DynamicText3DOptions
 * @property {number} [maxChars=999]
 * @property {number} [size=1]
 * @property {string} [align="left"]
 * @property {number[]} [position=[0,0,0]]
 * @property {number[]} [rotation=[0,0,0]]
 * @property {number[]} [scale=[1,1,1]]
 * @property {number} [color=0xffffff]
 * @property {number} [opacity=1]
 */

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

        this.maxChars = options.maxChars || 999;
        this.size = options.size || 1;
        this.align = options.align || "left"; // left | center | right

        this.color = options.color || 0xffffff;
        this.opacity = options.opacity || 1;

        this._charCount = 0;

        this._buildGeometry();
        this._buildMaterial();

        this.mesh = new Mesh(this.geometry, this.material);

        this.mesh.position.set(...options.position || [0, 0, 0]);
        this.mesh.rotation.set(...options.rotation || [0, 0, 0]);
        this.mesh.scale.set(...options.scale || [1, 1, 1]);
    }

    /**
     * PRIVATE: Khởi tạo geometry cho text mesh
     * @private
     */
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
    }

    /**
     * PRIVATE: Khởi tạo material cho text mesh
     * @private
     */
    _buildMaterial() {
        this.material = new MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            side: DoubleSide,
            depthWrite: false,
            color: this.color,
            opacity: this.opacity,
        });
        this.texture.needsUpdate = true;
    }

    setColor(color) {
        this.material.color.set(color);
    }
    
    getColor() {
        return this.material.color.get();
    }

    setOpacity(opacity) {
        this.material.opacity = opacity;
    }
    
    getOpacity() {
        return this.material.opacity;
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
        const lineHeight = this.font.common.lineHeight;

        let cursorX = 0;

        // 1. Tính toán tổng width để thực hiện Alignment và Kerning
        let totalWidth = 0;
        for (let i = 0; i < max; i++) {
            const charStr = chars[i];
            const ch = this.font.chars[charStr];
            if (!ch) continue;

            let kerning = 0;
            if (i > 0) {
                const pair = chars[i - 1] + charStr;
                kerning = this.font.kernings[pair] || 0;
            }

            // Ở ký tự cuối cùng, ta lấy chiều ngang thực tế (w + offset) 
            // Thay vì xadvance để tránh khoảng trắng thừa phía sau
            if (i === max - 1) {
                totalWidth += kerning + ch.xoffset + ch.w;
            } else {
                totalWidth += kerning + ch.xadvance;
            }
        }

        // 2. Thiết lập điểm bắt đầu dựa trên Align
        if (this.align === "center") cursorX = -totalWidth / 2;
        else if (this.align === "right") cursorX = -totalWidth;
        else cursorX = 0;

        let vi = 0; // vertex index counter
        let currentX = cursorX;

        for (let i = 0; i < max; i++) {
            const charStr = chars[i];
            const ch = this.font.chars[charStr];
            if (!ch) continue;

            // Áp dụng Kerning
            if (i > 0) {
                currentX += this.font.kernings[chars[i - 1] + charStr] || 0;
            }

            // Tính toán tọa độ Quad (Hệ tọa độ: Y hướng lên)
            // Trong BMFont: yoffset tính từ trên đỉnh (lineHeight) xuống.
            const x0 = currentX + ch.xoffset;
            const y0 = lineHeight - ch.yoffset; // Đưa về hệ tọa độ 2D chuẩn
            const x1 = x0 + ch.w;
            const y1 = y0 - ch.h;

            // Gán Position (4 vertices cho 1 quad)
            // Thứ tự: Bottom-Left, Bottom-Right, Top-Right, Top-Left
            pos.set([
                x0, y1, 0,
                x1, y1, 0,
                x1, y0, 0,
                x0, y0, 0
            ], vi * 3);

            // Gán UV (Hệ tọa độ V trong Three.js thường là 0 ở dưới, 1 ở trên)
            const u0 = ch.x / scaleW;
            const v0 = 1 - ch.y / scaleH;
            const u1 = (ch.x + ch.w) / scaleW;
            const v1 = 1 - (ch.y + ch.h) / scaleH;

            // Thứ tự tương ứng với position: BL, BR, TR, TL
            uv.set([
                u0, v1,
                u1, v1,
                u1, v0,
                u0, v0
            ], vi * 2);

            vi += 4;
            currentX += ch.xadvance;
        }

        // 3. Reset các phần còn lại của Buffer về 0 (để không hiện chữ cũ)
        for (let i = vi; i < this.maxChars * 4; i++) {
            pos.set([0, 0, 0], i * 3);
        }

        this._charCount = vi / 4;
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.uv.needsUpdate = true;

        // Mỗi ký tự là 2 tam giác = 6 indices
        this.geometry.setDrawRange(0, this._charCount * 6);
        this.geometry.computeBoundingSphere();
    }

    /**
     * @returns {Mesh}
     */
    getNode() {
        return this.mesh;
    }

    /**
     * @protected
     */
    _onAttach() {
        this.gameObject.transform.addRenderNode(this.mesh);
    }

    /**
     * @protected
     */
    _onDestroy() {
        this.gameObject.transform.removeRenderNode(this.mesh);
        this.geometry.dispose();
        this.material.dispose();
    }
}
