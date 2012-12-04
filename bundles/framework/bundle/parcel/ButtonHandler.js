/**
 * @class Oskari.mapframework.bundle.parcel.ButtonHandler
 * 
 * Handles the buttons for parcel functionality
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.ButtonHandler",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.buttonGroup = 'parcel';
    this.ignoreEvents = false;
    this.dialog = null;
    var me = this;
    this.buttons = {
        /* Points and areas are not required because areas 
         * are loaded from the server and are only split by using lines.
        'point' : {
            iconCls : 'parcel-draw-point',
            tooltip : '',
            sticky : true,
            callback : function() {
                me.startNewDrawing({
                    drawMode : 'point'
                });
            }
        },
        'area' : {
            iconCls : 'parcel-draw-area',
            tooltip : '',
            sticky : true,
            callback : function() {
                me.startNewDrawing({
                    drawMode : 'area'
                });
            }
        },
        */
        'line' : {
            iconCls : 'parcel-draw-line',
            tooltip : '',
            sticky : true,
            callback : function() {
                me.startNewDrawing({
                    drawMode : 'line'
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
}, {
    __name : 'ParcelButtonHandler',
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
        var guestPostfix = ' - ' + this.instance.getLocalization('guest').loginShort;
        for(var tool in this.buttons) {
            var tooltip = loc[tool]['tooltip'];
            if(!user.isLoggedIn()) {
                tooltip = tooltip + guestPostfix;
            }
            this.buttons[tool].tooltip = tooltip;
        }

        // Remove unnecessary toolbar buttons.
        this.instance.getSandbox().request( this.getName(),
            this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('reset', 'history'));
        this.instance.getSandbox().request( this.getName(),
            this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('history_back', 'history'));
        this.instance.getSandbox().request( this.getName(),
            this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('history_forward', 'history'));
        this.instance.getSandbox().request( this.getName(),
            this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('link', 'viewtools'));
        this.instance.getSandbox().request( this.getName(),
            this.instance.getSandbox().getRequestBuilder('Toolbar.RemoveToolButtonRequest')('print', 'viewtools'));
    },
    /**
     * @method start
     * implements Module protocol start methdod
     */
    start : function() {
        var me = this;
        
        var sandbox = this.instance.sandbox;
        sandbox.register(me);
        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
        
        // request toolbar to add buttons
        var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
        for(var tool in this.buttons) {
            sandbox.request(this, reqBuilder(tool, this.buttonGroup, this.buttons[tool]));
        }
        
        var user = this.instance.sandbox.getUser();
        if(!user.isLoggedIn()) {
            // disable toolbar buttons for guests
            var stateReqBuilder = sandbox.getRequestBuilder('Toolbar.ToolButtonStateRequest');
            sandbox.request(this, stateReqBuilder(undefined, this.buttonGroup, false));
        }
    },
        
    /**
     * @method startNewDrawing
     * Resets currently selected place and sends a draw request to plugin with given config
     * @param config params for StartDrawRequest
     */
    startNewDrawing : function(config) {
        // notify components to reset any saved "selected place" data
        var event = this.instance.sandbox.getEventBuilder('Parcel.ParcelSelectedEvent')();
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
        var startRequest = this.instance.sandbox.getRequestBuilder('Parcel.StartDrawingRequest')(config);
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
            me.sendStopDrawRequest(true);
    	});
        buttons.push(cancelBtn);
        
        if(drawMode != 'point') {
	    	var finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
	
	    	finishBtn.setTitle(locBtns["finish"]);
	    	finishBtn.addClass('primary');
	    	finishBtn.setHandler(function() {
            	me.sendStopDrawRequest();
	        });
        	buttons.push(finishBtn);
	    }
        
    	dialog.show(title, message, buttons);
    	dialog.addClass('parcel');
    	dialog.moveTo('#toolbar div.toolrow[tbgroup=parcel]', 'top');
    },
    /**
     * @method sendStopDrawRequest
     * Sends a StopDrawingRequest. 
     * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
     * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
     */
    sendStopDrawRequest : function(isCancel) {
        var me = this;
        var request = this.instance.sandbox.getRequestBuilder('Parcel.StopDrawingRequest')(isCancel);
        this.instance.sandbox.request(this, request);
        if(this.dialog) {
            this.dialog.close();
        }
    },
    /**
     * @method update
     * implements Module protocol update method
     */
    stop : function() {
        // Toolbar.RemoveToolButtonRequest
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
         * @method Parcel.ParcelSelectedEvent
         * Place was selected
         * @param {Oskari.mapframework.bundle.parcel.event.ParcelSelectedEvent} event
         */
        'Parcel.ParcelSelectedEvent' : function(event) {
        	if(!event.getPlace()) {
        		// cleanup
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
            // select tool selection will enable gfi -> disable it again
            this.instance.enableGfi(false);
	        if(this.dialog) {
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
