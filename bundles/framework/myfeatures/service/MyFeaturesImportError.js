/**
 * Custom error so we can message the info about the error and for example ask for EPSG-code when missing
 */
export class MyFeaturesImportError extends Error {
    constructor(message, cause, info) {
        super(message, cause);
        this.name = 'MyFeaturesImportError';
        this.oskariInfo = info;
    }
}
