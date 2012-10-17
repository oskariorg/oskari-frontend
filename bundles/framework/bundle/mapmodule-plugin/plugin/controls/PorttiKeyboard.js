/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
* full list of contributors). Published under the Clear BSD license.
* See http://svn.openlayers.org/trunk/openlayers/license.txt for the
* full text of the license. */

/**
 * Copyright (c) 2011 National Land Survey of Finland.
 */

OpenLayers.Control.PorttiKeyboard = OpenLayers.Class(OpenLayers.Control, {
    autoActivate : true,
    slideFactor : 50, // 75
    core : null,
    constructor : function(mapmodule) {
        //this.core = config.core;
        this.mapmodule = mapmodule;
        this.sandbox = mapmodule.getSandbox();
    },
    initialize : function() {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        if(arguments.length > 0){
            this.mapmodule = arguments[0];
            this.sandbox = this.mapmodule.getSandbox();
        }
    },    
    draw : function() {
        this.handler = new OpenLayers.Handler.Keyboard(this, {
            "keydown" : this.defaultKeyDown,
            "keyup" : this.defaultKeyUp
        });
    },
    defaultKeyDown : function(evt) {
        switch(evt.keyCode) {
            case OpenLayers.Event.KEY_LEFT:
            	this.mapmodule.panMapByPixels(-this.slideFactor,0, false, true);
                break;
            case OpenLayers.Event.KEY_RIGHT:
            	this.mapmodule.panMapByPixels(this.slideFactor,0, false, true);
                break;
            case OpenLayers.Event.KEY_UP:
            	this.mapmodule.panMapByPixels(0, -this.slideFactor, false, true);
                break;
            case OpenLayers.Event.KEY_DOWN:
            	this.mapmodule.panMapByPixels(0, this.slideFactor, false, true);
                break;
            case 17:
                // CTRL
                this.sandbox.postRequestByName('CtrlKeyDownRequest');
                //this.core.processRequest(this.core.getRequestBuilder()());
                break;
            case 27:
                // ESC
                this.sandbox.postRequestByName('EscPressedEvent');
                //this.core.dispatch(this.core.getEventBuilder('EscPressedEvent')());
                break;
            case 33:
                // Page Up. Same in all browsers.
            	this.mapmodule.notifyStartMove();
                this.mapmodule.panMapNorth();
                break;
            case 34:
                // Page Down. Same in all browsers.
            	this.mapmodule.notifyStartMove();
                this.mapmodule.panMapSouth();
                break;
            case 35:
                // End. Same in all browsers.
            	this.mapmodule.notifyStartMove();
                this.mapmodule.panMapEast();
                break;
            case 36:
                // Home. Same in all browsers.
            	this.mapmodule.notifyStartMove();
                this.mapmodule.panMapWest();
                break;
            case 43:
            // +/= (ASCII), keypad + (ASCII, Opera)
            case 61:
            // +/= (Mozilla, Opera, some ASCII)
            case 187:
            // +/= (IE)
            case 107:
                // keypad + (IE, Mozilla)
                this.mapmodule.zoomIn();
                break;
            case 45:
            // -/_ (ASCII, Opera), keypad - (ASCII, Opera)
            case 109:
            // -/_ (Mozilla), keypad - (Mozilla, IE)
            case 189:
            // -/_ (IE)
            case 95:
                // -/_ (some ASCII)
                this.mapmodule.zoomOut();
                break;
        }
    },
    defaultKeyUp : function(evt) {
        switch(evt.keyCode) {
            // CTRL
            case 17:
                this.sandbox.postRequestByName('CtrlKeyUpRequest');
                //this.core.processRequest(this.core.getRequestBuilder('CtrlKeyUpRequest')());
                break;
            case 37:
            case 38:
            case 39:
            case 40:
            case 33:
            case 34:
            case 35:
            case 36:
            case 43:
            case 61:
            case 187:
            case 107:
            case 45:
            case 109:
            case 189:
            case 95:
        		this.mapmodule.notifyMoveEnd();
                //this.core.processRequest(this.core.getRequestBuilder('MapNotMovingRequest')());
                break;
        }
    },
    CLASS_NAME : "OpenLayers.Control.PorttiKeyboard"
});
