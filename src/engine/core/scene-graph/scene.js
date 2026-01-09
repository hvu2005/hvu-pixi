


export class Scene {
    constructor(options = {name: "none"}) {
        this.name = options.name || "none";

        this._setup();
    }

    /**
     * @private
     */
    async _setup() {
        await this.load();
        this.create();
    }

    async load() {}

    create() {}
}