import { Texture, LinearFilter } from "engine/alias/three-alias";



/**
 * Load BMFont (text + png)
 * @param {string} text
 * @param {string} textureBase64
 * @returns {Promise<{ texture, font }>}
 */
export async function loadBitmapFont(text, textureBase64) {
    const font = parseBMFontText(text);
    const image = new Image();
    image.src = textureBase64

    const texture = new Texture(image);
    texture.needsUpdate = true;

    // text texture tối ưu
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;

    return { texture, font };
}

function parseBMFontText(text) {
    const lines = text.split("\n");

    const font = {
        common: {},
        chars: {},
        kernings: {}
    };

    for (const line of lines) {

        if (line.startsWith("common")) {
            const m = Object.fromEntries(
                [...line.matchAll(/(\w+)=([-\w]+)/g)]
                    .map(e => [e[1], Number(e[2])])
            );

            font.common = {
                lineHeight: m.lineHeight,
                scaleW: m.scaleW,
                scaleH: m.scaleH
            };
        }

        else if (line.startsWith("char ")) {
            const m = Object.fromEntries(
                [...line.matchAll(/(\w+)=([-\w]+)/g)]
                    .map(e => [e[1], Number(e[2])])
            );

            const ch = String.fromCharCode(m.id);

            font.chars[ch] = {
                x: m.x,
                y: m.y,
                w: m.width,
                h: m.height,
                xoffset: m.xoffset,
                yoffset: m.yoffset,
                xadvance: m.xadvance
            };
        }

        else if (line.startsWith("kerning ")) {
            const m = Object.fromEntries(
                [...line.matchAll(/(\w+)=([-\w]+)/g)]
                    .map(e => [e[1], Number(e[2])])
            );

            const a = String.fromCharCode(m.first);
            const b = String.fromCharCode(m.second);

            font.kernings[`${a}${b}`] = m.amount;
        }
    }

    return font;
}

