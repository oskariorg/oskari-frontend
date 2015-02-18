/**
 * @class Oskari.harava.bundle.haravaInfobox.request.HideInfoBoxRequestHandler
 * Handles Oskari.harava.bundle.haravaInfobox.request.HideInfoBoxRequest to hide info box.
 */
Oskari.clazz.define('Oskari.harava.bundle.haravaInfobox.request.HideInfoBoxRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.harava.bundle.haravaInfobox.plugin.mapmodule.OpenlayersPopupPlugin} popupPlugin
 * 			reference to plugin that handles the popups
 */
function(popupPlugin) {
    this.popupPlugin = popupPlugin; 
}, {
	/**
	 * @method handleRequest 
	 * Hides the requested infobox/popup
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.haravaInfobox.request.HideInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        this.popupPlugin.close(request.getId());
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
