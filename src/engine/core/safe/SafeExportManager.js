

class SafeExportManager {
    constructor() {
        this.exports = [];
    }

    async __init() {
        for (const ex of this.exports) {
            await ex.init();
        }
    }

    registExport(exporter) {
        this.exports.push(exporter);
    }
}

export const safeExportManager = new SafeExportManager();
