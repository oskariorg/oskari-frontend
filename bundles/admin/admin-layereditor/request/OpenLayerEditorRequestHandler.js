/**
 * @class OpenLayerEditorRequestHandler
 * Opens the layer editor form.
 */
export class OpenLayerEditorRequestHandler {
    constructor (instance) {
        this.bundleInstance = instance;
    }
    handleRequest (core, request) {
        this.bundleInstance.showEditor(request.getLayerId());
    }
};

Oskari.clazz.defineES(
    'Oskari.admin.admin-layereditor.request.OpenLayerEditorRequestHandler',
    OpenLayerEditorRequestHandler,
    { protocol: ['Oskari.mapframework.core.RequestHandler'] }
);
