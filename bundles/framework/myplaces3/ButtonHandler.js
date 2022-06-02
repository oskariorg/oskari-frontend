import { DRAW_ID } from './constants';
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
        this.dialog = null;
        this.drawMode = null;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.mapmodule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
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

        this.templateHelper = jQuery(
            '<div class="drawHelper">' +
            '<div class="infoText"></div>' +
            '<div class="measurementResult"></div>' +
            '</div>'
        );
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
            this.closeDialog();
            const drawMode = this.drawMode;
            var me = this;
            var title = me.loc('tools.' + drawMode + '.title');
            var message = me.loc('tools.' + drawMode + '.add');
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this.dialog = dialog;
            var buttons = [];
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');

            cancelBtn.setHandler(() => this.stopDrawing(true));
            buttons.push(cancelBtn);

            var finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            finishBtn.setTitle(me.loc('buttons.savePlace'));
            finishBtn.addClass('primary');
            finishBtn.setHandler(() => this.stopDrawing(false));
            buttons.push(finishBtn);

            var content = this.templateHelper.clone();
            content.find('div.infoText').html(message);

            var measureResult = content.find('div.measurementResult');
            if (drawMode === 'point') {
                // No need to show the measurement result for a point
                measureResult.remove();
            } else {
                measureResult.html(me.loc('tools.' + drawMode + '.noResult'));
            }

            dialog.show(title, content, buttons);
            dialog.addClass('myplaces3');
            dialog.moveTo('#toolbar div.toolrow[tbgroup=default-myplaces]', 'top');
        },
        closeDialog: function () {
            if (this.dialog) {
                this.dialog.close(true);
            }
            this.dialog = null;
        },
        stopDrawing: function (isCancel) {
            this.closeDialog();
            if (isCancel) {
                this.instance.getDrawHandler().stopDrawing();
            } else {
                this.instance.getDrawHandler().finishDrawing();
                this.instance.getMyPlacesHandler().addPlace();
            }
            // Select default tool
            this.instance.getSandbox().request(this, Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')());
        },
        toolSelected: function () {
            // changed tool -> cancel any drawing and close helper
            this.closeDialog();
            this.instance.getDrawHandler().stopDrawing();
        },
        startDrawing: function (drawMode, shape) {
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
            if (!this.dialog) {
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
                const content = this.dialog.getJqueryContent();
                content.find('div.measurementResult').html(resultText);
            }
        },
        /**
         * @method updateInfoText
         * Update the help dialog after a new feature was added
         * @param {Object} data
         */
        updateInfoText: function () {
            if (!this.dialog) {
                return;
            }
            const content = this.dialog.getJqueryContent();
            // after the first geometry change the popup text to instruct the user that another geometry can be added to the same feature
            content.find('div.infoText').html(this.loc('tools.' + this.drawMode + '.next'));
            // as the popup size probably changes with text change -> move it so it's still pointing at the button
            this.dialog.moveTo('#toolbar div.toolrow[tbgroup=default-myplaces]', 'top');
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
                if (this.drawMode === event.getToolId() || !event.getSticky()) {
                    return;
                }
                if (this.instance.getMyPlacesHandler().isPlacePopupActive()) {
                    // do not trigger when placeform is shown
                    return;
                }
                this.toolSelected();
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
