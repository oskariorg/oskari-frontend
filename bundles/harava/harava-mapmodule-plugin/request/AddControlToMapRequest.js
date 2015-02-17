/**
 * @class Oskari.harava.bundle.mapmodule.request.AddControlToMapRequest
 * Requests a add OpenLayers control to map
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.AddControlToMapRequest', 
/**
 * @method create called automatically on construction
 * @param {OpenLayers.Control} control OpenLayers control to add
 * @static
 */
function(control) {
	this._creator = null;
	this._control = control;
}, {
    /** @static @property __name request name */
	__name : "AddControlToMapRequest",
    /**
     * @method getName
     * @return {String} request name
     */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method getControl
	 * @returns {OpenLayers.Control} control
	 */
	getControl: function(){
		return this._control;
	}

}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
	'protocol' : ['Oskari.mapframework.request.Request']
});