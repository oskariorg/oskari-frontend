/**
 * @class ShowLayerEditorRequestHandler
 * Opens the layer editor form.
 */
export class SetTimeRequestHandler {
    handleRequest (core, request) {
        console.log(request);
    }
};

Oskari.clazz.defineES(
    'Oskari.mapframework.request.common.SetTimeRequestHandler',
    SetTimeRequestHandler,
    { protocol: ['Oskari.mapframework.core.RequestHandler'] }
);
