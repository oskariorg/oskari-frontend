/**
 * @class Oskari.harava.bundle.mapmodule.request.ToggleVisibilityHaravaDrawRequest
 * Requests a toggle visibility geometry draw
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.ToggleVisibilityHaravaDrawRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Boolean}
 *            	visible is tool visible
 * @param {Boolean}
 * 				deleteAll delete all orher drawings
 */
function(visible, deleteAll) {
    this._visible = visible;
    this._deleteAll = deleteAll;
}, {
	/** @static @property __name request name */
    __name : "ToggleVisibilityHaravaDrawRequest",
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
    },
    /**
     * @method getDeleteAll
     * @return {Boolean} delete all features
     */
    getDeleteAll : function() {
        return this._deleteAll;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});