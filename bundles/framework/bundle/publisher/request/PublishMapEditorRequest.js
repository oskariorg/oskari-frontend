/**
 * @class Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequest
 * Request publisher to open given view in publish mode
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Object} viewData
 *            View Data object which will be used to prepopulate map data in publish mode
 */
function(viewData) {
    this._viewData = viewData;
}, {
    /** @static @property __name request name */
    __name : "Publisher.PublishMapEditorRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getEditMap
     */
    getEditMap : function() {
        return this._viewData;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
