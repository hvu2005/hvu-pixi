

class ContainerBootstrap {

    constructor() {
        this.container = [];
    }

    async __init() {
        for(const con of this.container) {
            await con.__init();
        }
    }

    regist(container) {
        this.container.push(container);
    }
}

export const containerBootstrap = new ContainerBootstrap();