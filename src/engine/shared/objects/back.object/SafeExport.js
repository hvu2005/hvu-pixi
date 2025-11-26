import { safeExportManager } from "../../../core/core.d";



export class SafeExport {
    constructor() {
        this.__init();
    }

    async __init() {
        safeExportManager.registExport(this);
    }
    

    async init() {
        
    }
}