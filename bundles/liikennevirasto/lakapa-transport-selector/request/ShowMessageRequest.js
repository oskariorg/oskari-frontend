/**
 * @class Oskari.liikennevirasto.bundle.transport.selector.ShowMessageRequest
 * Requests a show message on the map
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.transport.selector.ShowMessageRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(title, message, handler) {
	this._title = title;
	this._message = message;
	this._handler = handler;
}, {
	/** @static @property __name request name */
    __name : "ShowMessageRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getTitle
     * @return {String} title
     */
    getTitle : function() {
        return this._title;
    },
    /**
     * @method getMessage
     * @return {String} message
     */
    getMessage : function() {
        return this._message;
    },
    /**
     * @method getHandler
     * @return {function} handler
     */
    getHandler : function() {
        return this._handler;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});