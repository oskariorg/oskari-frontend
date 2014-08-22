/**
 * @class Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler
 * Handles Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest to show an info box/popup.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler',
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
         * @method handleRequest
         * Shows an infobox/popup with requested properties
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            if (request.getHidePrevious()) {
                this.popupPlugin.close(undefined, request.getPosition());
            }

            this.popupPlugin.popup(
                request.getId(),
                request.getTitle(),
                request.getContent(),
                request.getPosition(),
                request.getColourScheme(),
                request.getFont()
            );
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
