/**
 * @class Oskari.mapframework.bundle.myplaces2.ButtonHandler
 * 
 * Handles the buttons for myplaces functionality
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.ButtonHandler",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.buttonGroup = 'myplaces';
    this.ignoreEvents = false;
    var me = this;
    this.buttons = {
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
        }
    };
    this.templateGuide = jQuery('<div><div class="guide"></div>' +
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
        // different tooltip for guests?
        var guestPostfix = ' - ' + this.instance.getLocalization('guest').loginShort;
        for(var tool in this.buttons) {
            var toolLoc = loc[tool];
            var tooltip = toolLoc.tooltip
            if(!user.isLoggedIn()) {
                tooltip = tooltip + guestPostfix;
            }
            this.buttons[tool].tooltip = tooltip;
        }
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
        
        // bind buttons 
        jQuery('div.myplaces2 div.button.cancel').live('click', function() {
            // ask toolbar to select default tool
            var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.instance.sandbox.request(me, toolbarRequest);
            me.sendStopDrawRequest(true);
        });
        jQuery('div.myplaces2 div.button.finish').live('click', function() {
            me.sendStopDrawRequest();
        });
        
        // enable draw helper
        var popover = Oskari.clazz.create('Oskari.userinterface.component.Popover', 
            this.instance.getLocalization('title'));
        this.popover = popover;
        // top would be nice but it will go off the screen
        this.popover.setPlacement('top');
        // place it next to the buttons we added
        this.popover.attachTo('#toolbar div.toolrow[tbgroup=myplaces]');
        // hax attach our own style class for setting max-width 
        this.popover.data.tip().addClass('myplaces2');
    },
        
    /**
     * @method startNewDrawing
     * Resets currently selected place and sends a draw request to plugin with given config
     * @param config params for StartDrawRequest
     */
    startNewDrawing : function(config) {
        // notify components to reset any saved "selected place" data
        var event = this.instance.sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')();
        this.instance.sandbox.notifyAll(event);

        // notify plugin to start drawing new geometry
        this.sendDrawRequest(config);
    },
    /**
     * @method startNewDrawing
     * Sends a StartDrawRequest with given params. Changes the panel controls to match the application state (new/edit)
     * @param config params for StartDrawRequest
     */
    sendDrawRequest : function(config) {
        var me = this;
        var startRequest = this.instance.sandbox.getRequestBuilder('MyPlaces.StartDrawingRequest')(config);
        this.instance.sandbox.request(this, startRequest);

        // show only relevant tools
        //this.module.setDisableMapEvents(true);
        //me.uiItems.basicControls.hide();
        if(!config.geometry) {
            // show only when not editing?
            
            // show help popup with cancel and finished buttons
            var locTool = this.instance.getLocalization('tools')[config.drawMode];
            var content = this.templateGuide.clone();
            content.find('div.guide').append(locTool["new"]);
            
            var locBtns = this.instance.getLocalization('buttons');
            var cancel = content.find('div.cancel');
            cancel.append(locBtns["cancel"]);
            var finish = content.find('div.finish');
            if(config.drawMode == 'point') {
                finish.hide();
            }
            else {
                finish.append(locBtns["finish"]);
            }
            this.popover.setContent(content);
            this.popover.show();
        }
    },
    /**
     * @method sendStopDrawRequest
     * Sends a StopDrawingRequest. 
     * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
     * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
     */
    sendStopDrawRequest : function(isCancel) {
        var me = this;
        var request = this.instance.sandbox.getRequestBuilder('MyPlaces.StopDrawingRequest')(isCancel);
        this.instance.sandbox.request(this, request);
        if(this.popover) {
            this.popover.hide();
        }
        // true if pressed finish drawing button
        if(isCancel == true) {
            //this.module.setDisableMapEvents(false);

            // show only relevant tools
            //me.uiItems.basicControls.show();
            //me.uiItems.drawControls.hide();
        }
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
                this.sendStopDrawRequest(true);
            }
        },
        /**
         * @method MyPlaces.FinishedDrawingEvent
         * TODO: should request toolbar to select some default tool
         * @param {Oskari.mapframework.bundle.myplaces2.event.FinishedDrawingEvent} event
         */
        'MyPlaces.FinishedDrawingEvent' : function(event) {
            // set ignore so we don't cancel our drawing unintentionally
            this.ignoreEvents = true;
            // ask toolbar to select default tool
            var toolbarRequest = this.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            this.instance.sandbox.request(this, toolbarRequest);
            // disable ignore to act normally after ^request
            this.ignoreEvents = false;
            if(this.popover) {
                this.popover.hide();
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
