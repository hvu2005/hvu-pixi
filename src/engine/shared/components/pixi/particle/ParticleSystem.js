
import { Component } from "../../base/Component";
import { gameLifecycle } from "../../../../core/core.d";
import { Container, Sprite } from "@pixi.alias";


function randRange(val) {
    if (typeof val === "number") return val;
    return val.min + Math.random() * (val.max - val.min);
}

class Particle {
    constructor(sprite) {
        this.sprite = sprite;
        this.active = false;
    }

    init(x, y, vx, vy, life, size) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.alpha = 1;
        this.sprite.scale.set(size);
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.age = 0;
        this.active = true;
        this.sprite.visible = true;
    }

    update(dt) {
        if (!this.active) return false;

        this.age += dt;
        if (this.age >= this.life) {
            this.active = false;
            this.sprite.visible = false;
            return false;
        }

        this.sprite.x += this.vx * dt;
        this.sprite.y += this.vy * dt;
        this.sprite.alpha = 1 - (this.age / this.life);

        return true;
    }
}

export class ParticleSystem extends Component {
    constructor(options = {}) {
        super();
        this.options = Object.assign({
            texture: null,
            spawnRate: 20,
            lifetime: { min: 1, max: 2 },
            speed: { min: 50, max: 100 },
            size: { min: 0.5, max: 1 },
            angle: { min: 0, max: Math.PI * 2 }, // 🔑 thêm option angle
            radius: 0,
            maxParticles: 500,
            auto: true
        }, options);

        this.container = new Container();
        this.pool = [];
        this.activeParticles = [];
        this._emit = this.options.auto;
        this._accumulator = 0;

        for (let i = 0; i < this.options.maxParticles; i++) {
            const sprite = new Sprite(this.options.texture);
            sprite.anchor.set(0.5);
            sprite.visible = false;
            this.container.addChild(sprite);
            this.pool.push(new Particle(sprite));
        }
    }

    async __init() {
        if (!this.gameObject) return;
        this.gameObject.addChild(this.container);
        this._lastTime = Date.now();
        gameLifecycle.addUpdate(this.update, this);
    }

    update() {
        const now = Date.now();
        const dt = (now - this._lastTime) * 0.001;
        this._lastTime = now;

        if (this._emit) {
            this._accumulator += dt * this.options.spawnRate;
            while (this._accumulator >= 1) {
                this._spawnParticle();
                this._accumulator--;
            }
        }

        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const p = this.activeParticles[i];
            if (!p.update(dt)) {
                this.activeParticles.splice(i, 1);
                this.pool.push(p);
            }
        }
    }

    _spawnParticle() {
        if (this.pool.length === 0) return;

        let spawnX = 0, spawnY = 0;
        if (this.options.radius > 0) {
            const r = Math.sqrt(Math.random()) * this.options.radius;
            const anglePos = Math.random() * Math.PI * 2;
            spawnX = Math.cos(anglePos) * r;
            spawnY = Math.sin(anglePos) * r;
        }

        const angle = -Math.PI / 2 + (Math.random() - 0.5) * this.options.spread;
        const speed = randRange(this.options.speed);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const life = randRange(this.options.lifetime);
        const size = randRange(this.options.size);

        const p = this.pool.pop();
        p.init(spawnX, spawnY, vx, vy, life, size);
        p.sprite.rotation = randRange(this.options.angle);
        this.activeParticles.push(p);
    }

    stop() { this._emit = false; }
    resume() { this._emit = true; }

    playOnce(count = this.options.spawnRate) {

        requestAnimationFrame(() => {
            this.reset();
            for (let i = 0; i < count; i++) {
                this._spawnParticle();
            }
        })
    }

    reset() {
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const p = this.activeParticles[i];
            p.active = false;
            p.sprite.visible = false;
            this.pool.push(p);
        }
        this.activeParticles.length = 0;

        // 🔑 Đảm bảo luôn refill đủ maxParticles
        if (this.pool.length < this.options.maxParticles) {
            const missing = this.options.maxParticles - this.pool.length;
            for (let i = 0; i < missing; i++) {
                const sprite = new Sprite(this.options.texture);
                sprite.anchor.set(0.5);
                sprite.visible = false;
                this.container.addChild(sprite);
                this.pool.push(new Particle(sprite));
            }
        }
    }

    _onDestroy() {
        gameLifecycle.removeUpdate(this.update, this);
        this.container.destroy({ children: true });
        super._onDestroy();
    }

}
