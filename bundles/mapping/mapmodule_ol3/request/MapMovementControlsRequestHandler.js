/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMovementInteractionsRequestHandler
 * Handles map movement control requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
     *          reference to mapModule
     */

    function (mapModule) {
        this.mapModule = mapModule;
    }, {
        getMapModule : function() {
            return this.mapModule;
        },
        /**
         * @method handleRequest
         * Enables/disables mouse/keyboard movement.
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.EnableMapMouseMovementRequest/
         *         Oskari.mapframework.bundle.mapmodule.request.DisableMapMouseMovementRequest/
         *         Oskari.mapframework.bundle.mapmodule.request.EnableMapKeyboardMovementRequest/
         *         Oskari.mapframework.bundle.mapmodule.request.DisableMapKeyboardMovementRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var interactions = [];
            if (request.getName() === 'EnableMapKeyboardMovementRequest') {
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.KeyboardPan));
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.KeyboardZoom));
                interactions.forEach(function (interaction) {
                    if (interaction) {
                        interaction.setActive(true);
                    }
                });
            } else if (request.getName() === 'DisableMapKeyboardMovementRequest') {
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.KeyboardPan));
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.KeyboardZoom));
                interactions.forEach(function (interaction) {
                    if (interaction) {
                        interaction.setActive(false);
                    }
                });
            } else if (request.getName() === 'EnableMapMouseMovementRequest') {
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.DragPan));
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.MouseWheelZoom));
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.DoubleClickZoom));
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.DragZoom));
                interactions.forEach(function (interaction) {
                    if (interaction) {
                        interaction.setActive(true);
                    }
                });
            } else if (request.getName() === 'DisableMapMouseMovementRequest') {
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.DragPan));
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.MouseWheelZoom));
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.DoubleClickZoom));
                interactions.push(this.getMapModule().getInteractionInstance(ol.interaction.DragZoom));
                interactions.forEach(function (interaction) {
                    if (interaction) {
                        interaction.setActive(false);
                    }
                });
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });