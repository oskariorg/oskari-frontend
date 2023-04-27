import { DRAW_ID } from './constants';
import { showDrawHelperPopup } from './view/DrawHelperPopup';
/**
 * @class Oskari.mapframework.bundle.myplaces3.ButtonHandler
 *
 * Handles the buttons for myplaces functionality
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.ButtonHandler',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance) {
        this.instance = instance;
        this.buttonGroup = 'myplaces';
        this.drawMode = null;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.mapmodule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
        this.popupControls = null;
        this.measurementText = null;
        this.description = null;
        this.buttons = {
            point: {
                iconCls: 'myplaces-draw-point',
                tooltip: '',
                sticky: true,
                callback: () => this.startDrawing('point', 'Point')
            },
            line: {
                iconCls: 'myplaces-draw-line',
                tooltip: '',
                sticky: true,
                callback: () => this.startDrawing('line', 'LineString')
            },
            area: {
                iconCls: 'myplaces-draw-area',
                tooltip: '',
                sticky: true,
                callback: () => this.startDrawing('area', 'Polygon')
            }
        };
        this.templateGuide = jQuery('<div><div class="guide"></div>' +
            '<div class="buttons">' +
            '<div class="cancel button"></div>' +
            '<div class="finish button"></div>' +
            '</div>' +
            '</div>');
    }, {
        __name: 'MyPlacesButtonHandler',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {
            var locale = this.loc;
            var user = Oskari.user();
            // different tooltip for guests - "Please log in to use"
            var tooltipPostfix = '';
            if (!user.isLoggedIn()) {
                tooltipPostfix = ' - ' + locale('guest.loginShort');
            }
            var buttons = this.buttons;
            Object.keys(buttons).forEach(function (tool) {
                var tooltip = locale('tools.' + tool + '.tooltip') + tooltipPostfix;
                buttons[tool].tooltip = tooltip;
            });
        },
        /**
         * @method start
         * implements Module protocol start methdod
         */
        start: function () {
            var me = this;
            var sandbox = me.instance.sandbox;
            sandbox.register(me);

            // request toolbar to add buttons
            var reqBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            Object.keys(this.buttons).forEach(function (tool) {
                sandbox.request(me, reqBuilder(tool, me.buttonGroup, me.buttons[tool]));
            });
            if (!Oskari.user().isLoggedIn()) {
                // disable toolbar buttons for guests
                this.disableButtons();
                return;
            }
            // logged in user -> listen to events as normal
            Object.keys(this.eventHandlers).forEach(function (eventName) {
                sandbox.registerForEventByName(me, eventName);
            });
        },
        closePopup: function () {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
            this.measurementText = null;
            this.description = null;
        },
        /**
         * @method disableButtons
         * Disables draw buttons
         */
        disableButtons: function () {
            var sandbox = this.instance.sandbox;
            var stateReqBuilder = Oskari.requestBuilder('Toolbar.ToolButtonStateRequest');
            sandbox.request(this, stateReqBuilder(undefined, this.buttonGroup, false));
        },
        showDrawHelper: function () {
            const drawMode = this.drawMode;
            const title = this.loc('tools.' + drawMode + '.title');
            const message = this.loc('tools.' + drawMode + '.add');

            let measureResult = null;
            if (drawMode !== 'point') {
                measureResult = this.loc('tools.' + drawMode + '.noResult');
            }

            if (!this.popupControls) {
                this.measurementText = measureResult;
                this.description = message;
                this.popupControls = showDrawHelperPopup(title, message, () => this.stopDrawing(false), () => this.stopDrawing(true), measureResult);
            }
        },
        stopDrawing: function (isCancel) {
            if (isCancel) {
                this.drawMode = null;
                this.instance.getDrawHandler().stopDrawing();
                // Select default tool
                this.instance.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', []);
            } else {
                // finish sketch and proceed with saving
                this.instance.getDrawHandler().finishDrawing((geojson) => {
                    this.instance.getMyPlacesHandler().addPlace(geojson);
                    if (!geojson) {
                        // geometry error, reset toolbar to default tool
                        this.instance.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', []);
                    }
                });
            }
            this.closePopup();
        },
        /**
         * Setup state and UI-buttons when editing a myplaces feature
         * @param {String} type the draw mode that we are starting based on feature geometry type
         */
        setupModifyMode: function (type) {
            // set drawMode so we know to reset functionality when another toolbar buttons is pressed while editing
            this.drawMode = type;
            if (this.drawMode) {
                // make the button for myplaces draw functionality go "selected" when editing a feature
                const buttonId = this.drawMode;
                const buttonGroup = 'default-' + this.buttonGroup;
                this.instance.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', [buttonId, buttonGroup]);
            }
        },
        someOtherToolSelected: function () {
            // changed tool -> cancel any drawing and close popups
            this.drawMode = null;
            this.closePopup();
            this.instance.getMyPlacesHandler().placePopupCleanup(false);
            this.instance.getDrawHandler().stopDrawing();
        },
        startDrawing: function (drawMode, shape) {
            if (this.drawMode === drawMode) {
                // already in progress
                return;
            }
            this.drawMode = drawMode;
            this.instance.getDrawHandler().startDrawing(shape);
            this.showDrawHelper();
        },
        /**
         * @method activeDrawing
         * Update the help dialog's measurement result
         * @param {Object} data
         */
        updateMeasurement: function (data) {
            if (!this.popupControls) {
                return;
            }

            let measurement;
            if (this.drawMode === 'line') {
                measurement = data.length;
            } else if (this.drawMode === 'area') {
                measurement = data.area;
            } else {
                return;
            }

            const resultText = this.mapmodule.formatMeasurementResult(measurement, this.drawMode);
            if (resultText) {
                this.measurementText = resultText;
                this.popupControls.update(this.description, resultText);
            }
        },
        /**
         * @method updateInfoText
         * Update the help dialog after a new feature was added
         * @param {Object} data
         */
        updateInfoText: function () {
            if (!this.popupControls) {
                return;
            }
            // after the first geometry change the popup text to instruct the user that another geometry can be added to the same feature
            const description = this.loc('tools.' + this.drawMode + '.next');
            this.description = description;
            this.popupControls.update(description, this.measurementText);
        },

        stop: function () {
            // Toolbar.RemoveToolButtonRequest
            // remove on bindings
            jQuery('div.myplaces3 div.button').off();
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method Toolbar.ToolSelectedEvent
             */
            'Toolbar.ToolSelectedEvent': function (event) {
                if (['point', 'area', 'line'].includes(event.getToolId())) {
                    // it's me
                    return;
                }
                if (this.drawMode) {
                    // draw mode is set when functionality is activated
                    // reset tool if user was drawing and clicked on another tool
                    this.someOtherToolSelected();
                }
            },

            /**
             * @method DrawingEvent
             * Requests toolbar to select default tool
             * @param {Oskari.mapping.drawtools.event.DrawingEvent} event
             */
            'DrawingEvent': function (event) {
                // Helper dialog is shown only for new geometries
                if (event.getId() !== DRAW_ID) {
                    return;
                }
                if (event.getIsFinished()) {
                    this.updateInfoText();
                    return;
                }
                this.updateMeasurement(event.getData());
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
