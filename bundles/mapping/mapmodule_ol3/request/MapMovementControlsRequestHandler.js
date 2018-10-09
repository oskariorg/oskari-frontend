import olInteractionDragZoom from 'ol/interaction/DragZoom';
import olInteractionDragPan from 'ol/interaction/DragPan';
import olInteractionKeyboardPan from 'ol/interaction/KeyboardPan';
import olInteractionKeyboardZoom from 'ol/interaction/KeyboardZoom';
import olInteractionMouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import olInteractionDoubleClickZoom from 'ol/interaction/DoubleClickZoom';

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
        getMapModule: function () {
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
                if (request.getOptions()) {
                    if (request.getOptions('pan')) {
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionKeyboardPan));
                    }
                    if (request.getOptions('zoom')) {
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionKeyboardZoom));
                    }
                } else {
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionKeyboardPan));
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionKeyboardZoom));
                }
                interactions.forEach(function (interaction) {
                    if (interaction) {
                        interaction.setActive(true);
                    }
                });
            } else if (request.getName() === 'DisableMapKeyboardMovementRequest') {
                if (request.getOptions()) {
                    if (request.getOptions('pan')) {
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionKeyboardPan));
                    }
                    if (request.getOptions('zoom')) {
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionKeyboardZoom));
                    }
                } else {
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionKeyboardPan));
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionKeyboardZoom));
                }
                interactions.forEach(function (interaction) {
                    if (interaction) {
                        interaction.setActive(false);
                    }
                });
            } else if (request.getName() === 'EnableMapMouseMovementRequest') {
                if (request.getOptions()) {
                    if (request.getOptions('pan')) {
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionDragPan));
                    }
                    if (request.getOptions('zoom')) {
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionMouseWheelZoom));
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionDoubleClickZoom));
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionDragZoom));
                    }
                } else {
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionDragPan));
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionMouseWheelZoom));
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionDoubleClickZoom));
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionDragZoom));
                }
                interactions.forEach(function (interaction) {
                    if (interaction) {
                        interaction.setActive(true);
                    }
                });
            } else if (request.getName() === 'DisableMapMouseMovementRequest') {
                if (request.getOptions()) {
                    if (request.getOptions('pan')) {
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionDragPan));
                    }
                    if (request.getOptions('zoom')) {
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionMouseWheelZoom));
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionDoubleClickZoom));
                        interactions.push(this.getMapModule().getInteractionInstance(olInteractionDragZoom));
                    }
                } else {
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionDragPan));
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionMouseWheelZoom));
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionDoubleClickZoom));
                    interactions.push(this.getMapModule().getInteractionInstance(olInteractionDragZoom));
                }
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
