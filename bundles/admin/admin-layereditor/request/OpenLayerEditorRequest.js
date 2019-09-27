/**
 * @class OpenLayerEditorRequest
 * Request opening admin layer editor.
 */
const NAME = 'OpenLayerEditorRequest';
export class OpenLayerEditorRequest {
    /**
     * Creates a new OpenLayerEditorRequest.
     * @param {Number} layerId optional
     */
    constructor (layerId) {
        this.layerId = layerId;
    }
    getName () {
        return NAME;
    }
    getLayerId () {
        return this.layerId;
    }
};
OpenLayerEditorRequest.NAME = NAME;

Oskari.clazz.defineES(
    'Oskari.admin.admin-layereditor.request.OpenLayerEditorRequest',
    OpenLayerEditorRequest,
    { protocol: ['Oskari.mapframework.request.Request'] }
);
