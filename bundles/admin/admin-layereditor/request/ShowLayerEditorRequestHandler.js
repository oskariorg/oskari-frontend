/**
 * @class ShowLayerEditorRequestHandler
 * Opens the layer editor form.
 */
export class ShowLayerEditorRequestHandler {
    constructor (instance) {
        this.bundleInstance = instance;
    }
    handleRequest (core, request) {
        this.bundleInstance.showEditor(request.getLayerId());
    }
};

Oskari.clazz.defineES(
    'Oskari.admin.admin-layereditor.request.ShowLayerEditorRequestHandler',
    ShowLayerEditorRequestHandler,
    { protocol: ['Oskari.mapframework.core.RequestHandler'] }
);
