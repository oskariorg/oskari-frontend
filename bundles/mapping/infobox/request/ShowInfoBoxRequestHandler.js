/**
 * @class Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler
 * Handles Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest to show an info box/popup.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin} popupPlugin
     *          reference to plugin that handles the popups
     *
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
            var options = request.getOptions() || {},
                hidePrevious = options.hidePrevious || false,
                mobileBreakpoints = options.mobileBreakpoints;
            if (hidePrevious) {
                this.popupPlugin.close(undefined);
            }

            this.popupPlugin.popup(
                request.getId(),
                request.getTitle(),
                request.getContent(),
                request.getPosition(),
                options,
                request.getAdditionalTools()
            );
        }
    }, {
        /**
         * @static @property {String[]} protocol array of superclasses as {String}
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
