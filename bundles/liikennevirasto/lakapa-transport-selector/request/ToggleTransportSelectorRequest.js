/**
 * @class Oskari.liikennevirasto.bundle.transport.selector.ToggleTransportSelectorRequest
 * Requests a enable/disable transport selector tools
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.transport.selector.ToggleTransportSelectorRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(show) {
	this._show = show;
}, {
	/** @static @property __name request name */
    __name : "ToggleTransportSelectorRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getShow
     * @return {Object} show
     */
    getShow : function() {
        return this._show;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});