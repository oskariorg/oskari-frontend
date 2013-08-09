/**
 * @class Oskari.harava.bundle.mapmodule.request.ZoomToExtentRequest
 * Requests a zoom to extent
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.ZoomToExtentRequest', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Float} minx min x
 * @param {Float} miny min y
 * @param {Float} maxx max x
 * @param {Float} maxy max y
 */
function(minx,miny,maxx,maxy) {
	this._creator = null;
	this._minx=minx;
	this._miny=miny;
	this._maxx=maxx;
	this._maxy=maxy;
}, {
    /** @static @property __name request name */
	__name : "ZoomToExtentRequest",
    /**
     * @method getName
     * @return {String} request name
     */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method getBounds
	 * @returns {OpenLayers.Bounds}
	 */
	getBounds: function(){
		var me = this;
		var bounds = new OpenLayers.Bounds(me._minx, me._miny, me._maxx, me._maxy);
		return bounds;
	}
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
	'protocol' : ['Oskari.mapframework.request.Request']
});