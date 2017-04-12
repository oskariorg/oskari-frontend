/**
 * @class Oskari.harava.bundle.mapmodule.request.ToggleVisibilityGeometrySearchRequest
 * Requests a toggle visibility geometry search
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.ToggleVisibilityGeometrySearchRequest',

/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean} search tool visibility
 */
function(visible) {
    this._visible = visible;
}, {
	/** @static @property __name request name */
    __name : "ToggleVisibilityGeometrySearchRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getVisibility
     * @return {Boolean} visibility
     */
    getVisibility : function() {
        return this._visible;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});