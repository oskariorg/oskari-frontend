/**
 * @class Oskari.liikennevirasto.bundle.lakapa.help.request.ChangeLanguageRequest
 *
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.help.request.ChangeLanguageRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(language) {
	this._language = language;
}, {
	/** @static @property __name request name */
    __name : "ChangeLanguageRequest",
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
    getLanguage : function() {
        return this._language;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});