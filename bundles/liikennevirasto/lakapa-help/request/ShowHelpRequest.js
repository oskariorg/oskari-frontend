/**
 * @class Oskari.liikennevirasto.bundle.lakapa.help..request.ShowHelpRequest
 *
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.help.request.ShowHelpRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(transport) {
	this._transport = transport;
}, {
	/** @static @property __name request name */
    __name : "ShowHelpRequest",
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
    getTransport : function() {
        return this._transport;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});