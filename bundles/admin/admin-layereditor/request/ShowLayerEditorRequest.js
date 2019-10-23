/**
 * @class ShowLayerEditorRequest
 * Request opening admin layer editor.
 */
const NAME = 'ShowLayerEditorRequest';
export class ShowLayerEditorRequest {
    /**
     * Creates a new ShowLayerEditorRequest.
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
ShowLayerEditorRequest.NAME = NAME;

Oskari.clazz.defineES(
    'Oskari.admin.admin-layereditor.request.ShowLayerEditorRequest',
    ShowLayerEditorRequest,
    { protocol: ['Oskari.mapframework.request.Request'] }
);
