/**
 * @class Oskari.mapframework.bundle.infobox.request.RefreshInfoBoxRequestHandler
 * Handles Oskari.mapframework.bundle.infobox.request.RefreshInfoBoxRequest to modify info box.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.request.RefreshInfoBoxRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin} popupPlugin
     *          reference to plugin that handles the popups
     */
    function (popupPlugin) {
        this.popupPlugin = popupPlugin;
    }, {
        /**
         * Refreshes the requested infobox/popup if present
         * If operation is 'remove', removes the requested content from the popup.
         * If no operation is given, just sends a status report of the requested popup.
         * 
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var sandbox = this.popupPlugin._sandbox,
                popupId = request.getId(),
                operation = request.getOperation(),
                contentId = request.getContentId(),
                popup = this.popupPlugin.getPopups(popupId),
                evtB, evt;

            if (popup) {
                if (operation === 'remove') {
                    // Remove the content data with the provided content id
                    this.popupPlugin.removeContentData(popupId, contentId);
                } else {
                    // Send a status report of the popup (is it open)
                    evtB = sandbox.getEventBuilder('InfoBox.InfoBoxEvent');
                    evt = evtB(popupId, true, contentId);
                    sandbox.notifyAll(evt);
                }
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });