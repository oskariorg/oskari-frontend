/**
 * @class Oskari.harava.bundle.haravaInfobox.request.ShowInfoBoxRequestHandler
 * Handles Oskari.harava.bundle.haravaInfobox.request.ShowInfoBoxRequest to show an info box/popup.
 */
Oskari.clazz.define('Oskari.harava.bundle.haravaInfobox.request.ShowInfoBoxRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.harava.bundle.haravaInfobox.plugin.mapmodule.OpenlayersPopupPlugin} popupPlugin
 *          reference to plugin that handles the popups
 */
function(popupPlugin) {
    this.popupPlugin = popupPlugin; 
}, {
	/**
	 * @method handleRequest 
	 * Shows an infobox/popup with requested properties
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.harava.bundle.havaraInfobox.request.ShowInfoBoxRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	if(request.getHidePrevious()) {
        	this.popupPlugin.close();
    	}
        this.popupPlugin.popup(request.getId(),request.getTitle(),request.getContent(), request.getPosition(), request.getHidePrevious(), request.getWidth(), request.getHeight(), request.getCenterMap());
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
