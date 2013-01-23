/**
 * @class Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequest
 * Request for editing own map in pulish mode
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            Map ID which will be edited in publish mode
 */
function(publishId) {
    this._creator = null;
    this._publishId = publishId;

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
        return this._publishId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
