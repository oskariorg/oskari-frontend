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
        this.measureButtonGroup = 'basictools';
        this.ignoreEvents = false;
        this.dialog = null;
        this.drawMode = null;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        var me = this;
        // options for DrawTools
        var drawOptions = {
            'allowMultipleDrawing': 'multiGeom',
            'showMeasureOnMap': true,
            'style': this.instance.getDrawStyle()
        };
        this.buttons = {
            'point': {
                iconCls: 'myplaces-draw-point',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.sendDrawRequest({
                        drawMode: 'point',
                        shape: 'Point',
                        drawOptions: drawOptions
                    });
                }
            },
            'line': {
                iconCls: 'myplaces-draw-line',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.sendDrawRequest({
                        drawMode: 'line',
                        shape: 'LineString',
                        drawOptions: drawOptions
                    });
                }
            },
            'area': {
                iconCls: 'myplaces-draw-area',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.sendDrawRequest({
                        drawMode: 'area',
                        shape: 'Polygon',
                        drawOptions: drawOptions
                    });
                }
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
        /**
         * @method startNewDrawing
         * Sends a StartDrawingRequest with given params. Changes the panel controls to match the application state (new/edit)
         * @param config params for StartDrawingRequest
         */
        sendDrawRequest: function (config) {
            this.drawMode = config.drawMode;
            this.instance.setIsFinishedDrawing(false);

            var conf = jQuery.extend(true, {}, config);
            // clear drawing before start
            this.instance.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', [this.instance.getName(), true, true]);
            this.instance.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', [this.instance.getName(), conf.shape, conf.drawOptions]);
            this.instance.setIsEditPlace(false);
            this._showDrawHelper(config.drawMode);
        },
        /**
         * @method sendStopDrawRequest
         * Sends a StopDrawingingRequest.
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled -> clear current drawing
         * @param {Boolean} supressEvent boolean param for StopDrawingRequest, true to not send drawing event
         */
        sendStopDrawRequest: function (isCancel, supressEvent) {
            if (isCancel) {
                this.instance.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [this.instance.getName(), true, supressEvent]);
                this.instance.setIsFinishedDrawing(false);
            } else {
                this.instance.setIsFinishedDrawing(true);
                this.instance.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [this.instance.getName(), false]);
            }
        },
        /**
         * @method update
         * implements Module protocol update method
         */
        _showDrawHelper: function (drawMode) {
            if (this.dialog) {
                this.dialog.close(true);
                this.dialog = null;
            }
            var me = this;
            var title = me.loc('tools.' + drawMode + '.title');
            var message = me.loc('tools.' + drawMode + '.add');
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this.dialog = dialog;
            var buttons = [];
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');

            cancelBtn.setHandler(function () {
                // ask toolbar to select default tool
                var toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')();
                me.instance.sandbox.request(me, toolbarRequest); // stopDrawing -> clear current drawing
                dialog.close(true);
                me.dialog = null;
            });
            buttons.push(cancelBtn);

            var finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            finishBtn.setTitle(me.loc('buttons.finish'));
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me.sendStopDrawRequest();
                dialog.close(true);
                me.dialog = null;
            });
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
        /**
         * @method activeDrawing
         * Update the help dialog's measurement result
         * @param {Object} data
         */
        activeDrawing: function (data) {
            var measurement;

            if (this.drawMode === 'line') {
                measurement = data.length;
            } else if (this.drawMode === 'area') {
                measurement = data.area;
            } else {
                return;
            }
            var resultText = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule').formatMeasurementResult(measurement, this.drawMode);

            if (this.dialog && resultText) {
                var content = this.dialog.getJqueryContent();
                content.find('div.measurementResult').html(resultText);
            }
        },
        /**
         * @method featureAdded
         * Update the help dialog after a new feature was added
         * @param {Object} data
         */
        featureAdded: function (data) {
            if (!this.dialog || !this.drawMode) {
                return;
            }
            var content = this.dialog.getJqueryContent();
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
                if (this.drawMode === event.getToolId() || this.ignoreEvents) {
                    // do not trigger when placeform is shown
                    return;
                }
                // changed tool -> cancel any drawing
                this.sendStopDrawRequest(true, true);
                if (this.dialog) {
                    this.dialog.close();
                }
            },

            /**
             * @method DrawingEvent
             * Requests toolbar to select default tool
             * @param {Oskari.mapping.drawtools.event.DrawingEvent} event
             */
            'DrawingEvent': function (event) {
                if (event.getId() !== this.instance.getName() || this.instance.isEditPlace()) {
                    return;
                }
                if (!event.getIsFinished()) {
                    this.activeDrawing(event.getData());
                    return;
                }
                if (!this.instance.isFinishedDrawing()) {
                    this.featureAdded(event.getData());
                    return;
                }
                // handle Finished drawing -> main view
                // set ignore so we don't cancel our drawing unintentionally
                this.ignoreEvents = true;
                // ask toolbar to select default tool
                this.instance.sandbox.request(this, Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')());
                // disable ignore to act normally after ^request
                this.ignoreEvents = false;
                if (this.dialog) {
                    this.dialog.close();
                }
            },

            'InfoBox.InfoBoxEvent': function (event) {
                var popupId = this.instance.getMainView().getPopupId();
                if (event.getId() !== popupId) {
                    return;
                }
                this.sendStopDrawRequest(true, true);
                var sandbox = this.instance.getSandbox();
                if (sandbox.hasHandler('EnableMapKeyboardMovementRequest')) {
                    sandbox.request(this, Oskari.requestBuilder('EnableMapKeyboardMovementRequest')());
                }
                var form = this.instance.getMainView().getForm();
                if (form) {
                    form.destroy();
                    form = undefined;
                }
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
