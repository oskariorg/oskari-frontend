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
                popup = this.popupPlugin.getPopups(popupId),
                evtB, evt;

            if (popup) {
                evtB = sandbox.getEventBuilder('InfoBox.InfoBoxEvent');
                evt = evtB(popupId, true);
                sandbox.notifyAll(evt);
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });