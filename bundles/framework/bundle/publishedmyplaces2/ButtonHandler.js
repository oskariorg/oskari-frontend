/**
 * @class Oskari.mapframework.bundle.publishedmyplaces.ButtonHandler
 * 
 * Handles the buttons for myplaces functionality
 */
Oskari.clazz.define("Oskari.mapframework.bundle.publishedmyplaces.ButtonHandler",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    var me = this;
    me.instance = instance;
    me.buttonGroup = 'myplaces';
    me.ignoreEvents = false;
    me.dialog = null;
    me.conf = instance.conf || {};

    me.buttons = {
        'point' : {
            iconCls : 'myplaces-draw-point',
            tooltip : '',
            sticky : true,
            callback : function() {
                me.startNewDrawing({
                    drawMode : 'point'
                });
            }
        },
        'line' : {
            iconCls : 'myplaces-draw-line',
            tooltip : '',
            sticky : true,
            callback : function() {
                me.startNewDrawing({
                    drawMode : 'line'
                });
            }
        },
        'area' : {
            iconCls : 'myplaces-draw-area',
            tooltip : '',
            sticky : true,
            callback : function() {
                me.startNewDrawing({
                    drawMode : 'area'
                });
            }
        }/*,
        'cut' : {
            iconCls : 'tool-draw-cut',
            tooltip : '',
            sticky : true,
            callback : function() {
                me.startNewDrawing({
                    drawMode : 'cut'
                });
            }
        }*/
    };
    me.templateGuide = jQuery('<div><div class="guide"></div>' +
            '<div class="buttons">' +
                '<div class="cancel button"></div>' +
                '<div class="finish button"></div>' +
            '</div>' +
        '</div>');
}, {
    __name : 'MyPlacesButtonHandler',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    init : function() {

        var loc = this.instance.getLocalization('tools');
        var user = this.instance.sandbox.getUser();

        // different tooltip for guests - "Please log in to use"
        var guestPostfix = user.isLoggedIn() ? '' : ' - ' + this.instance.getLocalization('guest').loginShort;

        // remove configured buttons and set tooltips
        for(var tool in this.buttons) {
            if (this.conf.myplaces && this.conf.myplaces[tool] === false) {
                delete this.buttons[tool];
            } else {
                this.buttons[tool].tooltip = loc[tool]['tooltip'] + guestPostfix;
            }
        }
    },
    /**
     * @method start
     * implements Module protocol start methdod
     */
    start : function() {
        var me = this;
        
        var sandbox = me.instance.sandbox;
        sandbox.register(me);
        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
        
        // request toolbar to add buttons
        var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
        for(var tool in me.buttons) {
            sandbox.request(me, reqBuilder(tool, me.buttonGroup, me.buttons[tool]));
        }
        
        var user = me.instance.sandbox.getUser();
        if(!user.isLoggedIn()) {
            // disable toolbar buttons for guests
            me.disableButtons();
        }
    },
    /**
     * @method disableButtons
     * Disables draw buttons
     */
    disableButtons : function() {
        var sandbox = this.instance.sandbox;
        var stateReqBuilder = sandbox.getRequestBuilder('Toolbar.ToolButtonStateRequest');
        sandbox.request(this, stateReqBuilder(undefined, this.buttonGroup, false));
    },  
    /**
     * @method startNewDrawing
     * Resets currently selected place and sends a draw request to plugin with given config
     * @param config params for StartDrawRequest
     */
    startNewDrawing : function(config) {
        // notify components to reset any saved "selected place" data
        var event = this.instance.sandbox.getEventBuilder('DrawPlugin.SelectedDrawingEvent')();
        this.instance.sandbox.notifyAll(event);

        // notify plugin to start drawing new geometry
        this.sendDrawRequest(config);
        this.instance.enableGfi(false);
    },
    /**
     * @method startNewDrawing
     * Sends a StartDrawRequest with given params. Changes the panel controls to match the application state (new/edit)
     * @param config params for StartDrawRequest
     */
    sendDrawRequest : function(config) {
        var me = this;
        var startRequest = this.instance.sandbox.getRequestBuilder('DrawPlugin.StartDrawingRequest')(config);
        this.instance.sandbox.request(this, startRequest);

        if(!config.geometry) {
            // show only when drawing new place
            this._showDrawHelper(config.drawMode);
            
        }
    },
    /**
     * @method update
     * implements Module protocol update method
     */
    _showDrawHelper : function(drawMode) {
        var me = this;

        // show help popup with cancel and finished buttons
        var locTool = this.instance.getLocalization('tools')[drawMode],
            locBtns = this.instance.getLocalization('buttons'),
            title = locTool.title,
            content = locTool.add,
            toolContainerRequest,
            buttons = [],
            cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(locBtns.cancel);
        cancelBtn.setHandler(function () {
            // ask toolbar to select default tool
            var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.instance.sandbox.request(me, toolbarRequest);
            me.sendStopDrawRequest(true);
        });
        buttons.push(cancelBtn);

        var finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

        finishBtn.setTitle(locBtns.finish);
        finishBtn.addClass('primary');
        finishBtn.setHandler(function () {
            me.sendStopDrawRequest();
        });
        buttons.push(finishBtn);

        // store data for later reuse 
        me.toolContentDivData = {
            "className": 'myplaces2',
            "title": title,
            "content": content,
            "buttons": buttons
        }

        toolContainerRequest = me.instance.sandbox.getRequestBuilder('Toolbar.ToolContainerRequest')('set', me.toolContentDivData);
        me.instance.sandbox.request(me, toolContainerRequest);
    },
    /**
     * @method sendStopDrawRequest
     * Sends a StopDrawingRequest. 
     * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
     * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
     */
    sendStopDrawRequest : function(isCancel) {
        var me = this;
        var request = me.instance.sandbox.getRequestBuilder('DrawPlugin.StopDrawingRequest')(isCancel);
        me.instance.sandbox.request(me, request);

        var toolContainerRequest = me.instance.sandbox.getRequestBuilder('Toolbar.ToolContainerRequest')('reset', me.toolContentDivData);
        me.instance.sandbox.request(me, toolContainerRequest);
    },
    /**
     * @method update
     * implements Module protocol update method
     */
    stop : function() {
        // Toolbar.RemoveToolButtonRequest
        // remove live bindings
        jQuery('div.myplaces2 div.button').die();
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
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
            if(!this.ignoreEvents) {
                // changed tool -> cancel any drawing
                // do not trigger when we return drawing tool to 
                this.sendStopDrawRequest(true);
                this.instance.enableGfi(true);
            }
        },
        /**
         * @method DrawPlugin.MyPlaceSelectedEvent
         * Place was selected
         * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.SelectedDrawingEvent} event
         */
        'DrawPlugin.SelectedDrawingEvent' : function(event) {
        	if(!event.getPlace()) {
        		// cleanup
	            // ask toolbar to select default tool
	            var toolbarRequest = this.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
	            this.instance.sandbox.request(this, toolbarRequest);
        	}
        },
        /**
         * @method DrawPlugin.FinishedDrawingEvent
         * Requests toolbar to select default tool
         * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent} event
         */
        'DrawPlugin.FinishedDrawingEvent' : function(event) {
            var me = this;
            // set ignore so we don't cancel our drawing unintentionally
            me.ignoreEvents = true;
            // ask toolbar to select default tool
            var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.instance.sandbox.request(me, toolbarRequest);
            // disable ignore to act normally after ^request
            me.ignoreEvents = false;
            // select tool selection will enable gfi -> disable it again
            me.instance.enableGfi(false);

            var toolContainerRequest = me.instance.sandbox.getRequestBuilder('Toolbar.ToolContainerRequest')('reset', me.toolContentDivData);
            me.instance.sandbox.request(me, toolContainerRequest);
        },

        /**
         * @method DrawPlugin.AddedFeatureEvent
         * Update the help dialog after a new feature was added
         * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.AddedFeatureEvent} event
         */
        'DrawPlugin.AddedFeatureEvent' : function(event) {
            var me = this;
            if (typeof event.getDrawingMode() !== "undefined") {
                if (event.getDrawingMode() !== null) {
                    var loc = this.instance.getLocalization('tools');
                    var areaDialogContent = loc[event.getDrawingMode()]['next'];

                    if (me.toolContentDivData.content !== areaDialogContent) {
                        me.toolContentDivData.content = areaDialogContent;

                        toolContainerRequest = me.instance.sandbox.getRequestBuilder('Toolbar.ToolContainerRequest')('set', me.toolContentDivData);
                        me.instance.sandbox.request(me, toolContainerRequest);
                    }
                }
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
