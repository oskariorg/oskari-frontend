/**
 * @class Oskari.mapframework.bundle.parcel.handler.ButtonHandler
 *
 * Handles the button related events and requests for parcel functionality.
 * These buttons are shown in the toolbar to provide bunlde functionality for the user.
 *
 * Notice, uses the instance configuration to check if some of other bundles buttons, that
 * are irrelevant for this bundle, should be hidden.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.handler.ButtonHandler",

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance
 */
function(instance) {
    this.instance = instance;
    this.buttonGroup = 'parcel';
    this.ignoreEvents = false;
    this.dialog = null;
    var me = this;
    this.buttons = {
        'area' : {
            iconCls : 'parcel-draw-area',
            tooltip : '',
            sticky : true,
            callback : function() {
                me._startNewDrawing({
                    drawMode : 'area'
                });
            }
        },
        'line' : {
            iconCls : 'parcel-draw-line',
            tooltip : '',
            sticky : true,
            callback : function() {
                me._startNewDrawing({
                    drawMode : 'line'
                });
            }
        },
        'save' : {
            iconCls : 'tool-save-view',
            tooltip : '',
            sticky : true,
            callback : function() {
                me._saveDrawing();
            }
        }
    };
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'ParcelButtonHandler';
    },
    /**
     * @method init
     * Implements Module protocol init method.
     */
    init : function() {
        var loc = this.instance.getLocalization('tools');
        for (var tool in this.buttons) {
            var tooltip = loc[tool]['tooltip'];
            this.buttons[tool].tooltip = tooltip;
        }

        if (this.instance.conf && this.instance.conf.hideSomeToolbarButtons && (this.instance.conf.hideSomeToolbarButtons === "hide" || this.instance.conf.hideSomeToolbarButtons === "true" )) {
            // Remove unnecessary toolbar buttons.
            this.instance.getSandbox().request(this.getName(), this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('reset', 'history'));
            this.instance.getSandbox().request(this.getName(), this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('history_back', 'history'));
            this.instance.getSandbox().request(this.getName(), this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('history_forward', 'history'));
            this.instance.getSandbox().request(this.getName(), this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('link', 'viewtools'));
            this.instance.getSandbox().request(this.getName(), this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('print', 'viewtools'));
        }
    },
    /**
     * @method start
     * Implements Module protocol start method.
     */
    start : function() {
        var me = this;

        var sandbox = this.instance.getSandbox();
        sandbox.register(me);
        for (p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }

        // request toolbar to add buttons
        var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
        for (var tool in this.buttons) {
            sandbox.request(this, reqBuilder(tool, this.buttonGroup, this.buttons[tool]));
        }
    },

    /**
     * @method _startNewDrawing
     * @private
     * Sends a request to plugin with given config to inform that certain tool has been selected.
     * @param config params for StartDrawRequest
     */
    _startNewDrawing : function(config) {
        var event = this.instance.sandbox.getEventBuilder('Parcel.ParcelSelectedEvent')();
        this.instance.sandbox.notifyAll(event);

        // notify plugin to start drawing new geometry
        this._sendDrawRequest(config);
    },
    /**
     * @method _saveDrawing
     * @private
     * Starts the save drawing feature flow by sending 'Parcel.SaveDrawingRequest' request.
     */
    _saveDrawing : function() {
        var request = this.instance.sandbox.getRequestBuilder('Parcel.SaveDrawingRequest')();
        this.instance.sandbox.request(this, request);
    },
    /**
     * @method _sendDrawRequest
     * @private
     * Sends a StartDrawingRequest with given params.
     * @param config params for StartDrawRequest
     */
    _sendDrawRequest : function(config) {
        var startRequest = this.instance.sandbox.getRequestBuilder('Parcel.StartDrawingRequest')(config);
        this.instance.sandbox.request(this, startRequest);
        if (!config.geometry) {
            // show only when drawing new place
            this._showDrawHelper(config.drawMode);
        }
    },
    /**
     * @method _showDrawHelper
     * @private
     * Show help popup for the given mode.
     * @param {String} drawMode Identifies the tool that is used for drawing.
     */
    _showDrawHelper : function(drawMode) {
        var me = this;
        // show help popup with cancel and finished buttons
        var locTool = this.instance.getLocalization('tools')[drawMode];
        var locBtns = this.instance.getLocalization('buttons');
        var title = this.instance.getLocalization('title');
        var message = locTool["new"];

        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        this.dialog = dialog;
        var buttons = [];
        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(locBtns["cancel"]);
        cancelBtn.setHandler(function() {
            // ask toolbar to select default tool
            var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.instance.sandbox.request(me, toolbarRequest);
            // Send cancel information in request. This will remove, the feature.
            me.sendCancelDrawRequest();
        });
        buttons.push(cancelBtn);

        dialog.show(title, message, buttons);
        dialog.addClass('parcel');
        dialog.moveTo('#toolbar div.toolrow[tbgroup=parcel]', 'top');
    },
    /**
     * @method sendStopDrawRequest
     * Sends 'Parcel.StopDrawingRequest' and closes the help dialog if its showing.
     */
    sendStopDrawRequest : function() {
        var me = this;
        var request = this.instance.sandbox.getRequestBuilder('Parcel.StopDrawingRequest')();
        this.instance.sandbox.request(this, request);
        if (this.dialog) {
            this.dialog.close();
        }
    },
    /**
     * @method sendCancelDrawRequest
     * Sends 'Parcel.CancelDrawingRequest' and closes the help dialog if its showing.
     */
    sendCancelDrawRequest : function() {
        var me = this;
        var request = this.instance.sandbox.getRequestBuilder('Parcel.CancelDrawingRequest')();
        this.instance.sandbox.request(this, request);
        if (this.dialog) {
            this.dialog.close();
        }
    },
    /**
     * @method stop
     * Implements Module protocol stop method.
     */
    stop : function() {
        // remove live bindings
        jQuery('div.parcel div.button').die();
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
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
    eventHandlers : {
        /**
         * @method Toolbar.ToolSelectedEvent
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
        'Toolbar.ToolSelectedEvent' : function(event) {
            if (!this.ignoreEvents) {
                // changed tool -> cancel any drawing
                // do not trigger when we return drawing tool to
                this.sendCancelDrawRequest();
            }
        },
        /**
         * @method Parcel.ParcelSelectedEvent
         * Place was selected
         * @param {Oskari.mapframework.bundle.parcel.event.ParcelSelectedEvent} event
         */
        'Parcel.ParcelSelectedEvent' : function(event) {
            if (!event.getPlace()) {
                // ask toolbar to select default tool
                var toolbarRequest = this.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
                this.instance.sandbox.request(this, toolbarRequest);
            }
        },
        /**
         * @method Parcel.FinishedDrawingEvent
         * Requests toolbar to select default tool
         * @param {Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent} event
         */
        'Parcel.FinishedDrawingEvent' : function(event) {
            // set ignore so we don't cancel our drawing unintentionally
            this.ignoreEvents = true;
            // ask toolbar to select default tool
            var toolbarRequest = this.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            this.instance.sandbox.request(this, toolbarRequest);
            // disable ignore to act normally after ^request
            this.ignoreEvents = false;
            if (this.dialog) {
                this.dialog.close();
            }
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.mapframework.module.Module']
});
