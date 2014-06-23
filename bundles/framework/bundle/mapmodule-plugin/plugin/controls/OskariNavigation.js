/**
The draw method has been copypasted from OpenLayers.Control.Navigation and custom code hooks have been 
added to it as needed to get Oskari events sent from map movements and hovering. Kinetic movement messes up location
on Oskari so disabling it.

Note! Windows Phone pinch zoom requires fractionalZoom to be used and an additional css-class to be added
to map div. 
*/
OskariNavigation = OpenLayers.Class(OpenLayers.Control.Navigation, {

    /**
     * OpenLayers Constructor
     */
    initialize: function(bounds, options) {
        // Call the super constructor
        OpenLayers.Control.Navigation.prototype.initialize.apply(this, [bounds, options]);
    },
	  /* @method setup */
	  setup : function(mapmodule) {
	    this.mapmodule = mapmodule;
		this.sandbox = this.mapmodule.getSandbox();
		this._hoverEventBuilder = this.sandbox.getEventBuilder("MouseHoverEvent");
		this._hoverEvent = this._hoverEventBuilder();
		this._mapClickedBuilder = this.sandbox.getEventBuilder('MapClickedEvent');
	  },


    draw: function() {
        // disable right mouse context menu for support of right click events
        if (this.handleRightClicks) {
            this.map.viewPortDiv.oncontextmenu = OpenLayers.Function.False;
        }
        // <custom hooking>
		OpenLayers.Control.DragPan.prototype.enableKinetic = false;
        if (window.navigator.msPointerEnabled)
        {
        	// setup class for mobile IE
          	jQuery(this.mapmodule.getMapEl()).css("ms-touch-action", "none");
        }
        var me = this;
        var movementHook = function(actualmethod, ctx) {
        	return function() {
        		var c = ctx || me;
        		actualmethod.apply(c, arguments);
        		me.mapmodule.notifyMoveEnd();
        	}
        }
        var clickHook = function(actualmethod, ctx) {
        	return function() {
        		var c = ctx || me;
        		actualmethod.apply(c, arguments);
        		me.__sendMapClickEvent(arguments[0]);
        	}
        }

        var clickCallbacks = { 
            'click': clickHook(this.defaultClick),
            'dblclick': movementHook(this.defaultDblClick), 
            'dblrightclick': movementHook(this.defaultDblRightClick) 
        };
        // </custom hooking>
        var clickOptions = {
            'double': true, 
            'stopDouble': true
        };
        this.handlers.click = new OpenLayers.Handler.Click(
            this, clickCallbacks, clickOptions
        );
        
        this.dragPan = new OpenLayers.Control.DragPan(
            OpenLayers.Util.extend({
                map: this.map,
                documentDrag: this.documentDrag
            }, this.dragPanOptions)
        );
        // <custom hooking>
        var originalPanDone = this.dragPan.panMapDone;
        this.dragPan.panMapDone = movementHook(originalPanDone, this.dragPan);
        // used by MouseWheel up/down
        this.wheelChange = movementHook(this.wheelChange);
        // </custom hooking>

        this.zoomBox = new OpenLayers.Control.ZoomBox(
                    {map: this.map, keyMask: this.zoomBoxKeyMask});

        // <custom hooking>
        var originalzoomBox = this.zoomBox.zoomBox;
        this.zoomBox.zoomBox = movementHook(originalzoomBox, this.zoomBox);
        // </custom hooking>
        
        this.dragPan.draw();
        this.zoomBox.draw();
        var wheelOptions = this.map.fractionalZoom ? {} : {
            cumulative: false,
            interval: 50,
            maxDelta: 6
        };
        this.handlers.wheel = new OpenLayers.Handler.MouseWheel(
            this, {up : this.wheelUp, down: this.wheelDown},
            OpenLayers.Util.extend(wheelOptions, this.mouseWheelOptions)
        );

        if (OpenLayers.Control.PinchZoom) {
	        // <custom hooking>
            this.pinchZoom = new OskariPinchZoom(OpenLayers.Util.extend(
                    {map: this.map}, this.pinchZoomOptions));
            this.pinchZoom.setup(this.mapmodule);
	        // </custom hooking>
        }

	    // <custom hooking>
	    this.__addHoverSupport();
	    // </custom hooking>
    },
    __addHoverSupport : function() {
		var hoverCallbacks = {
			"move" : this.__defaultHoverMove,
			"pause" : this.__defaultHoverPause
		};
		// trying to prevent IE8 from dying to hover events
		var hoverOptions = {
			pixelTolerance : 1.1,
			// minor hack to support IE performance
			passesTolerance : function(px) {
				var passes = true;
				if(this.pixelTolerance && this.px) {
					var dpx = Math.sqrt(Math.pow(this.px.x - px.x, 2) + Math.pow(this.px.y - px.y, 2));

					if(dpx < this.pixelTolerance) {
						passes = false;
					}
				}			
				return passes;
			}
		};
		this.handlers.hover = new OpenLayers.Handler.Hover(this, hoverCallbacks, hoverOptions);
		this.handlers.hover.activate();
    },
	__defaultHoverMove : function(evt) {
		var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
		this._hoverEvent.set(lonlat.lon, lonlat.lat, false, evt.pageX, evt.pageY);
		this.sandbox.notifyAll(this._hoverEvent, true);
	},
	__defaultHoverPause : function(evt) {
		var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
		this._hoverEvent.set(lonlat.lon, lonlat.lat, true, evt.pageX, evt.pageY);
		this.sandbox.notifyAll(this._hoverEvent);
	},
	__sendMapClickEvent : function(evt) {
		/* may be this should dispatch to mapmodule */
		var lonlat = this.map.getLonLatFromViewPortPx(evt.xy),
			event = this._mapClickedBuilder(lonlat, evt.xy.x, evt.xy.y);
		this.sandbox.notifyAll(event);
	}
});