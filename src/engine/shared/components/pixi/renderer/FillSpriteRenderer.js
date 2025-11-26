import { Texture, Graphics } from "@pixi.alias";
import { SpriteRenderer } from "./SpriteRenderer";

/**
 * LoadFillSprite - Sprite có hiệu ứng filled (Radial/Bar) như Cocos/Unity
 */
export class FillSpriteRenderer extends SpriteRenderer {
    /**
     * 
     * @param {Texture} texture 
     * @param {Object} options 
     *   options = {
     *      fillType: "radial" | "barH" | "barV",
     *      fillStart: 0,       // (radial) offset bắt đầu (0=trên, 0.25=phải, 0.5=dưới, 0.75=trái)
     *      fillRange: 1,       // tỉ lệ lấp đầy (0-1)
     *      barReverse: false   // (bar) có đảo chiều không
     *   }
     */
    constructor(texture, options = {}) {
        super(texture, options);

        // Option mặc định
        this.options = {
            fillType: options.fillType || "barH",  // "radial", "barH", "barV"
            fillStart: options.fillStart ?? null,       // 0=trên (radial); 0=trái (barH)
            fillRange: options.fillRange ?? 1,
            barReverse: options.barReverse ?? false
        };
        const anchorX = options?.anchor?.x ?? 0.5;
        const anchorY = options?.anchor?.y ?? 0.5;
        this.sprite.anchor.set(anchorX, anchorY);
        this.sprite.label = 'fillSprite';
        this.sprite._maskGraphics = new Graphics();
        this.sprite.eventMode = options.eventMode ?? 'none';
    }

    __init() {
        if (this.gameObject && typeof this.gameObject.addChild === "function") {
            this.gameObject._renderer.addChild(this.sprite);
            this.gameObject._renderer.addChild(this.sprite._maskGraphics);

            // Update mask lần đầu
            this.sprite.mask = this.sprite._maskGraphics;
            this.sprite.drawFill = this.setUpdrawFillType();
            const fill = this.options.fillStart ?? 1;
            this.setFill(fill);
        }
    }

    _onDisable() {
        this.sprite.visible = false;
    }

    _onEnable() {
        this.sprite.visible = true;
    }

    /**
     * Set phần trăm filled (0-1)
     */
    setFill(percent) {
        this.options.fillRange = percent;
        this.sprite.drawFill();
    }

    /**
     * Vẽ lại mask dựa vào fillType.
     */
    setUpdrawFillType() {
        const self = this;

        // Lấy anchor hiện tại (mặc định 0.5 nếu chưa set)
        function getAnchorX() {
            return self.sprite.anchor.x;
        }
        function getAnchorY() {
            return self.sprite.anchor.y;
        }

        const drawFuncs = {
            radial: function () {
                const g = self.sprite._maskGraphics;
                g.clear();
                const w = self.sprite.width, h = self.sprite.height;
                const fill = Math.max(0, Math.min(1, self.options.fillRange));
                const radius = Math.max(w, h) / 2;
                // Tâm là (0,0) trong local của sprite, đã được anchor căn chỉnh
                const cx = 0, cy = 0;
                const startAngle = -Math.PI / 2 + self.options.fillStart * Math.PI * 2;
                const endAngle = startAngle + fill * Math.PI * 2;

                g.fill({color: 0xffffff});
                g.moveTo(cx, cy);
                g.arc(cx, cy, radius, startAngle, endAngle, false);
                g.lineTo(cx, cy);
                g.fill();
            },
            barH: function () {
                const g = self.sprite._maskGraphics;
                g.clear();
                const w = self.sprite.width, h = self.sprite.height;
                const fill = Math.max(0, Math.min(1, self.options.fillRange));

                // anchorX xác định điểm bắt đầu fill: 0 (trái), 0.5 (giữa), 1 (phải)
                const ax = getAnchorX();
                const ay = getAnchorY();
                let x0 = -w * ax;
                let y0 = -h * ay;

                g.fill({color: 0xffffff});
                if (self.options.barReverse) {
                    // Vẽ từ phải sang trái
                    g.rect(x0 + (w - fill * w), y0, fill * w, h);
                } else {
                    // Vẽ từ trái sang phải
                    g.rect(x0, y0, fill * w, h);
                }
                g.fill();
            },
            barV: function () {
                const g = self.sprite._maskGraphics;
                g.clear();
                const w = self.sprite.width, h = self.sprite.height;
                const fill = Math.max(0, Math.min(1, self.options.fillRange));
                // anchor xác định gốc vẽ mask
                const ax = getAnchorX();
                const ay = getAnchorY();
                let x0 = -w * ax;
                let y0 = -h * ay;

                const barHeight = fill * h;
                g.fill({color: 0xffffff});
                if (self.options.barReverse) {
                    // Vẽ từ dưới lên trên
                    g.rect(x0, y0 + (h - barHeight), w, barHeight);
                } else {
                    // Vẽ từ trên xuống dưới
                    g.rect(x0, y0, w, barHeight);
                }
                g.fill();
            }
        };

        return (drawFuncs[this.options.fillType] || drawFuncs['radial']).bind(this);
    }

}


