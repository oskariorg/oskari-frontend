/**
 * @class Oskari.framework.bundle.infobox.request.HideInfoBoxRequest
 * Requests a map popup/infobox to be hidden, if id for popup is not given -> Hides all popups
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id for popup/infobox (optional)
 */
function(id) {
	this._creator = null;
	this._id = id;
}, {
    /** @static @property __name request name */
	__name : "InfoBox.HideInfoBoxRequest",
    /**
     * @method getName
     * @return {String} request name
     */
	getName : function() {
		return this.__name;
	},
    /**
     * @method getId
     * @return {String} popup/infobox id
     */
	getId : function() {
		return this._id;
	}
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
	'protocol' : ['Oskari.mapframework.request.Request']
});