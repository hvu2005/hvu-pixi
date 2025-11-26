
import { Text as PixiText, TextStyle } from "@pixi.alias";
import { Component } from "../../base/Component";

/**
 * @typedef {Object} TextOptions
 * @property {string} [text] - nội dung text
 * @property {string} [fontFamily] - tên font (VD: Arial, Verdana, Roboto…)
 * @property {number} [fontSize] - cỡ chữ (px)
 * @property {string|number} [fill] - màu chữ (hex hoặc css string)
 * @property {boolean} [bold] - in đậm
 * @property {boolean} [italic] - in nghiêng
 * @property {string|number} [stroke] - màu viền
 * @property {number} [strokeThickness] - độ dày viền
 * @property {"left"|"center"|"right"} [align] - căn lề
 */
export class GameText extends Component {
    /**
     * @param {TextOptions} options
     */
    constructor(options = {}) {
        super();
        this.options = {
            text: options.text ?? "New Text",
            fontFamily: options.fontFamily ?? "Arial",
            fontSize: options.fontSize ?? 32,
            fill: options.fill ?? "#ffffff",
            bold: options.bold ?? false,
            italic: options.italic ?? false,
            stroke: options.stroke ?? "#000000",
            strokeThickness: options.strokeThickness ?? 0,
            align: options.align ?? "left",
        };
    }

    /**
     * @override
     */
    __init() {
        const style = new TextStyle({
            fontFamily: this.options.fontFamily,
            fontSize: this.options.fontSize,
            fill: this.options.fill,
            fontWeight: this.options.bold ? "bold" : "normal",
            fontStyle: this.options.italic ? "italic" : "normal",
            stroke: this.options.stroke,
            strokeThickness: this.options.strokeThickness,
            align: this.options.align,
        });


        this.text = new PixiText({
            text: this.options.text,
            style: style,
        });

        if (this.options.align === "right") {
            this.text.anchor.set(1, 0.5);
        } else if (this.options.align === "center") {
            this.text.anchor.set(0.5, 0.5);
        } else {
            this.text.anchor.set(0, 0.5);
        }

        this.gameObject._renderer.addChild(this.text);
    }

    setText(newText) {
        if (this.text) {
            this.text.text = newText;
        }
    }

    setStyle(newStyle) {
        if (this.text) {
            this.text.style = new TextStyle({
                ...this.text.style,
                ...newStyle,
            });
        }
    }

    _onDestroy() {
        super._onDestroy();
        this.text.destroy?.();
    }

    _onDisable() {
        if (this.text) this.text.visible = false;
    }

    _onEnable() {
        if (this.text) this.text.visible = true;
    }
}

console.log("vch");