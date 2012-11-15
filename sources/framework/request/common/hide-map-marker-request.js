/**
 * @class Oskari.mapframework.request.common.HideMapMarkerRequest
 *
 * Request for any markers shown on map to be hidden
 */
Oskari.clazz.define('Oskari.mapframework.request.common.HideMapMarkerRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "HideMapMarkerRequest",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});