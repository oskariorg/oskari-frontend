/* new implementation */
/* this is based on Navigation Control with Hover handler instead of MouseDefaults and some other stuff */

/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control/ZoomBox.js
 * @requires OpenLayers/Handler/MouseWheel.js
 * @requires OpenLayers/Handler/Click.js
 * @requires OpenLayers/Handler/Drag.js
 */

/* Attempting to replace previous PorttiMouse implementation with OpenLayers.Control.Navigation
 * with added Hover and Drag handler in a supporting role.
 *
 */

/**
 * Class: OpenLayers.Control.Navigation
 * The navigation control handles map browsing with mouse events (dragging,
 *     double-clicking, and scrolling the wheel).  Create a new navigation
 *     control with the <OpenLayers.Control.Navigation> control.
 *
 *     Note that this control is added to the map by default (if no controls
 *     array is sent in the options object to the <OpenLayers.Map>
 *     constructor).
 *
 * Inherits:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.PorttiMouse = OpenLayers.Class(OpenLayers.Control, {

	/**
	 * Property: type
	 * {OpenLayers.Control.TYPES}
	 */
	type : OpenLayers.Control.TYPE_TOOL,

	/**
	 * Property: panned
	 * {Boolean} The map moved.
	 */
	panned : false,

	/**
	 * Property: interval
	 * {Integer} The number of milliseconds that should ellapse before
	 *     panning the map again. Defaults to 1 millisecond. In most cases
	 *     you won't want to change this value. For slow machines/devices
	 *     larger values can be tried out.
	 */
	interval : 1,

	/**
	 * APIProperty: documentDrag
	 * {Boolean} If set to true, mouse dragging will continue even if the
	 *     mouse cursor leaves the map viewport. Default is false.
	 */
	documentDrag : false,

	/**
	 * Property: kinetic
	 * {OpenLayers.Kinetic} The OpenLayers.Kinetic object.
	 */
	kinetic : null,

	/**
	 * APIProperty: enableKinetic
	 * {Boolean} Set this option to enable "kinetic dragging". Can be
	 *     set to true or to an object. If set to an object this
	 *     object will be passed to the {<OpenLayers.Kinetic>}
	 *     constructor. Defaults to false.
	 */
	enableKinetic : false,

	/**
	 * APIProperty: kineticInterval
	 * {Integer} Interval in milliseconds between 2 steps in the "kinetic
	 *     scrolling". Applies only if enableKinetic is set. Defaults
	 *     to 10 milliseconds.
	 */
	kineticInterval : 10,

	/**
	 * Property: pinchZoom
	 * {<OpenLayers.Control.PinchZoom>}
	 */
	pinchZoom : null,

	/**
	 * APIProperty: pinchZoomOptions
	 * {Object} Options passed to the PinchZoom control.
	 */
	pinchZoomOptions : null,

	/**
	 * APIProperty: documentDrag
	 * {Boolean} Allow panning of the map by dragging outside map viewport.
	 *     Default is false.
	 */
	documentDrag : false,

	/**
	 * Property: zoomBox
	 * {<OpenLayers.Control.ZoomBox>}
	 */
	zoomBox : null,

	/**
	 * APIProperty: zoomBoxEnabled
	 * {Boolean} Whether the user can draw a box to zoom
	 */
	zoomBoxEnabled : true,

	/**
	 * APIProperty: zoomWheelEnabled
	 * {Boolean} Whether the mousewheel should zoom the map
	 */
	zoomWheelEnabled : true,

	/**
	 * Property: mouseWheelOptions
	 * {Object} Options passed to the MouseWheel control (only useful if
	 *     <zoomWheelEnabled> is set to true)
	 */
	mouseWheelOptions : null,

	/**
	 * APIProperty: handleRightClicks
	 * {Boolean} Whether or not to handle right clicks. Default is false.
	 */
	handleRightClicks : false,

	/**
	 * APIProperty: zoomBoxKeyMask
	 * {Integer} <OpenLayers.Handler> key code of the key, which has to be
	 *    pressed, while drawing the zoom box with the mouse on the screen.
	 *    You should probably set handleRightClicks to true if you use this
	 *    with MOD_CTRL, to disable the context menu for machines which use
	 *    CTRL-Click as a right click.
	 * Default: <OpenLayers.Handler.MOD_SHIFT
	 */
	zoomBoxKeyMask : OpenLayers.Handler.MOD_SHIFT,

	/**
	 * APIProperty: autoActivate
	 * {Boolean} Activate the control when it is added to a map.  Default is
	 *     true.
	 */
	autoActivate : true,
	
	/*
	 * APIProperty: useCenterMapInWheelZoom
	 * {Boolean} Use map center when wheel zooming (set to false to revert to default openlayers functionality)
	 */
	useCenterMapInWheelZoom: false,

	/*
	 * APIProperty: useCenterMapInWheelZoom
	 * {Boolean} Use map center when wheel zooming (set to true to revert default openlayers functionality)
	 */
	useCenterMapInDblClickZoom: false,

	/**
	 * Constructor: OpenLayers.Control.Navigation
	 * Create a new navigation control
	 *
	 * Parameters:
	 * options - {Object} An optional object whose properties will be set on
	 *                    the control
	 */
	initialize : function(options) {
		this.handlers = {};
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
	},
	/* @method setup */
	setup : function(mapmodule) {
		this.mapmodule = mapmodule;
		this.sandbox = this.mapmodule.getSandbox();
		this._hoverEventBuilder = this.sandbox.getEventBuilder("MouseHoverEvent")
		this._hoverEvent = this._hoverEventBuilder();
		this._mapClickedBuilder = this.sandbox.getEventBuilder('MapClickedEvent');

	},
	/**
	 * Method: destroy
	 * The destroy method is used to perform any clean up before the control
	 * is dereferenced.  Typically this is where event listeners are removed
	 * to prevent memory leaks.
	 */
	destroy : function() {
		this.deactivate();

		if(this.zoomBox) {
			this.zoomBox.destroy();
		}
		this.zoomBox = null;

		if(this.pinchZoom) {
			this.pinchZoom.destroy();
		}
		this.pinchZoom = null;

		OpenLayers.Control.prototype.destroy.apply(this, arguments);
	},
	/**
	 * Method: activate
	 */
	activate : function() {
		this.handlers.drag.activate();
		if(this.zoomWheelEnabled) {
			this.handlers.wheel.activate();
		}

		this.handlers.click.activate();
		this.handlers.hover.activate();

		if(this.zoomBoxEnabled) {
			this.zoomBox.activate();
		}
		if(this.pinchZoom) {
			this.pinchZoom.activate();
		}
		return OpenLayers.Control.prototype.activate.apply(this, arguments);
	},
	/**
	 * Method: deactivate
	 */
	deactivate : function() {
		if(this.pinchZoom) {
			this.pinchZoom.deactivate();
		}
		this.zoomBox.deactivate();
		this.handlers.drag.deactivate();
		this.handlers.click.deactivate();
		this.handlers.wheel.deactivate();
		this.handlers.hover.deactivate();
		return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
	},
	/**
	 * Method: draw
	 */
	draw : function() {
		if(this.enableKinetic) {
			var config = {
				interval : this.kineticInterval
			};
			if( typeof this.enableKinetic === "object") {
				config = OpenLayers.Util.extend(config, this.enableKinetic);
			}
			this.kinetic = new OpenLayers.Kinetic(config);
		}
		this.handlers.drag = new OpenLayers.Handler.Drag(this, {
			"move" : this.panMap,
			"done" : this.panMapDone,
			"down" : this.panMapStart
		}, {
			interval : this.interval,
			documentDrag : this.documentDrag
		});

		// disable right mouse context menu for support of right click events
		if(this.handleRightClicks) {
			this.map.viewPortDiv.oncontextmenu = OpenLayers.Function.False;
		}

		var clickCallbacks = {
			'click' : this.defaultClick,
			'dblclick' : this.defaultDblClick,
			'dblrightclick' : this.defaultDblRightClick
		};
		var clickOptions = {
			'double' : true,
			'stopDouble' : true
		};
		this.handlers.click = new OpenLayers.Handler.Click(this, clickCallbacks, clickOptions);

		var hoverCallbacks = {
			"move" : this.defaultHoverMove,
			"pause" : this.defaultHoverPause
		};

		var me = this;		
		
		/* trying to prevent IE8 from dying to hover events */
		var hoverOptions = {
			pixelTolerance : 1.1,
			/* minor hack to support IE performance */
			passesTolerance : function(px) {
			var passes = true;
			if( me.panned ) {
				return false;
			}
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
		
		this.dragPan = new OpenLayers.Control.DragPan(OpenLayers.Util.extend({
			map : this.map,
			documentDrag : this.documentDrag
		}, this.dragPanOptions));
		this.zoomBox = new OpenLayers.Control.ZoomBox({
			map : this.map,
			keyMask : this.zoomBoxKeyMask
		});
		this.dragPan.draw();
		this.zoomBox.draw();
		this.handlers.wheel = new OpenLayers.Handler.MouseWheel(this, {
			"up" : this.wheelUp,
			"down" : this.wheelDown
		}, this.mouseWheelOptions);
		
	
		
		if(OpenLayers.Control.PinchZoom) {
			var pinchZoomOptions = this.pinchZoomOptions||{};
			
			pinchZoomOptions.pinchDone = function(evt, start, last) {
					this.applyTransform("");
					var zoom = this.map.getZoomForResolution(this.map.getResolution() / last.scale, true);
					if(zoom !== this.map.getZoom() || !this.currentCenter.equals(this.pinchOrigin)) {
						var resolution = this.map.getResolutionForZoom(zoom);

						var location = this.map.getLonLatFromPixel(this.pinchOrigin);
						var zoomPixel = this.currentCenter;
						var size = this.map.getSize();

						location.lon += resolution * ((size.w / 2) - zoomPixel.x);
						location.lat -= resolution * ((size.h / 2) - zoomPixel.y);

						me.sendMapSetCenter(location, zoom);
					}
			};
				
			this.pinchZoom = new OpenLayers.Control.PinchZoom(OpenLayers.Util.extend({
				map : this.map
			}, pinchZoomOptions));
		}

	},
	
	/**
	 * Method: defaultClick
	 *
	 * Parameters:
	 * evt - {Event}
	 */
	defaultClick : function(evt) {
		if(evt.lastTouches && evt.lastTouches.length == 2) {
			/*this.map.zoomOut();*/
			this.sendMapZoomOut();
		} else {
			var isIE8 = navigator.userAgent.indexOf("MSIE 8.0") !=-1 ;
			if( isIE8 ) {
				var now = new Date().getTime();

				if( this.lastDblClickMs ) {
					if( !((now - this.lastDblClickMs) < 1000 ) ) {
						this.sendMapClickEvent(evt);
					}
				} else {
					this.sendMapClickEvent(evt);
				}
			} else {
				this.sendMapClickEvent(evt);
			}
		}

	},
	/**
	 * Method: defaultDblClick
	 *
	 * Parameters:
	 * evt - {Event}
	 */
	defaultDblClick : function(evt) {
		var deltaZ = 1;
		var currentZoom = this.map.getZoom();
		var newZoom = this.map.getZoom() + Math.round(deltaZ);
		newZoom = Math.max(newZoom, 0);
		newZoom = Math.min(newZoom, this.map.getNumZoomLevels());
		if(newZoom === currentZoom) {
			return;
		}
		var size = this.map.getSize();
		var deltaX = size.w / 2 - evt.xy.x;
		var deltaY = evt.xy.y - size.h / 2;
		var newRes = this.map.baseLayer.getResolutionForZoom(newZoom);
		var zoomPoint = this.map.getLonLatFromPixel(evt.xy);
		var newCenter = null;
		
		if( this.useCenterMapInDblClickZoom ) {
			newCenter = this.map.getCenter();
		} else {
			newCenter = new OpenLayers.LonLat(zoomPoint.lon + deltaX * newRes, zoomPoint.lat + deltaY * newRes);
		}
		
		var isIE8 = navigator.userAgent.indexOf("MSIE 8.0") !=-1 ;
		if( isIE8 ) {
			this.lastDblClickMs = new Date().getTime();
		}

		this.sendMapSetCenter(newCenter, newZoom);
	},
	/**
	 * Method: defaultDblRightClick
	 *
	 * Parameters:
	 * evt - {Event}
	 */
	defaultDblRightClick : function(evt) {
		this.sendMapZoomOut();
	},
	/**
	 * Method: wheelChange
	 *
	 * Parameters:
	 * evt - {Event}
	 * deltaZ - {Integer}
	 */
	wheelChange : function(evt, deltaZ) {
		var currentZoom = this.map.getZoom();
		var newZoom = this.map.getZoom() + Math.round(deltaZ);
		newZoom = Math.max(newZoom, 0);
		newZoom = Math.min(newZoom, this.map.getNumZoomLevels());
		if(newZoom === currentZoom) {
			return;
		}
		var size = this.map.getSize();
		var deltaX = size.w / 2 - evt.xy.x;
		var deltaY = evt.xy.y - size.h / 2;
		var newRes = this.map.baseLayer.getResolutionForZoom(newZoom);
		var zoomPoint = this.map.getLonLatFromPixel(evt.xy);
		var newCenter = null;
		
		if( this.useCenterMapInWheelZoom ) {
			newCenter = this.map.getCenter();
		} else {
			newCenter = new OpenLayers.LonLat(zoomPoint.lon + deltaX * newRes, zoomPoint.lat + deltaY * newRes);
		}
		/*this.map.setCenter(newCenter, newZoom);*/
		
		this.sendMapSetCenter(newCenter, newZoom);
	},
	/**
	 * Method: wheelUp
	 * User spun scroll wheel up
	 *
	 * Parameters:
	 * evt - {Event}
	 * delta - {Integer}
	 */
	wheelUp : function(evt, delta) {
		this.wheelChange(evt, delta || 1);
	},
	/**
	 * Method: wheelDown
	 * User spun scroll wheel down
	 *
	 * Parameters:
	 * evt - {Event}
	 * delta - {Integer}
	 */
	wheelDown : function(evt, delta) {
		this.wheelChange(evt, delta || -1);
	},
	/**
	 * Method: disableZoomBox
	 */
	disableZoomBox : function() {
		this.zoomBoxEnabled = false;
		this.zoomBox.deactivate();
	},
	/**
	 * Method: enableZoomBox
	 */
	enableZoomBox : function() {
		this.zoomBoxEnabled = true;
		if(this.active) {
			this.zoomBox.activate();
		}
	},
	/**
	 * Method: disableZoomWheel
	 */

	disableZoomWheel : function() {
		this.zoomWheelEnabled = false;
		this.handlers.wheel.deactivate();
	},
	/**
	 * Method: enableZoomWheel
	 */

	enableZoomWheel : function() {
		this.zoomWheelEnabled = true;
		if(this.active) {
			this.handlers.wheel.activate();
		}
	},
	/* drag pan */
	panMapStart : function() {
		if(this.kinetic) {
			this.kinetic.begin();
		}
		this.panned = false;
	},
	panMap : function(xy) {
		if(this.kinetic) {
			this.kinetic.update(xy);
		}
		if(!this.panned) {
			this.mapmodule.notifyStartMove();
		}
		this.panned = true;
		this.map.pan(this.handlers.drag.last.x - xy.x, this.handlers.drag.last.y - xy.y, {
			dragging : true,
			animate : false
		});
		/*this.mapmodule.panMapByPixels(this.handlers.drag.last.x - xy.x, this.handlers.drag.last.y - xy.y, true, false, true);*/
	},
	panMapDone : function(xy) {
		if(this.panned) {
			var res = null;
			if(this.kinetic) {
				res = this.kinetic.end(xy);
			}
			/*this.map.pan(
			 this.handlers.drag.x - xy.x,
			 this.handlers.drag.y - xy.y,
			 {dragging: !!res, animate: false}
			 );*/
			this.mapmodule.panMapByPixels(this.handlers.drag.x - xy.x, this.handlers.drag.y - xy.y, true, false, false);
			if(res) {
				var self = this;
				this.kinetic.move(res, function(x, y, end) {
					/*self.map.pan(x, y, {dragging: !end, animate: false});*/
					self.mapmodule.panMapByPixels(x, y, true, false, false);
				});
			}
			this.panned = false;
		}
	},
	/* mapmodule notifications */
	defaultHoverMove : function(evt) {
		if(this.panned) {
			return;
		}
		/* may be this should dispatch to mapmodule */
		var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
		this._hoverEvent.set(lonlat.lon, lonlat.lat, false, evt.pageX, evt.pageY);

		this.sandbox.notifyAll(this._hoverEvent, true);
	},
	defaultHoverPause : function(evt) {
		if(this.panned) {
			return;
		}
		/* may be this should dispatch to mapmodule */
		var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);

		var hoverEvent = this._hoverEventBuilder();
		hoverEvent.set(lonlat.lon, lonlat.lat, false, evt.pageX, evt.pageY,true);

		this.sandbox.notifyAll(hoverEvent);
	},
	sendMapClickEvent : function(evt) {
		/* may be this should dispatch to mapmodule */
		var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);

		var evt = this._mapClickedBuilder(lonlat, evt.xy.x, evt.xy.y);
		this.sandbox.notifyAll(evt);
	},
	sendMapSetCenter : function(newCenter, newZoom) {
		/* this implicitly calls mapmodule.notifyMoveEnd() which sends AfterMapMoveEvent */
		this.mapmodule.centerMap(newCenter, newZoom);
	},
	sendMapZoomOut : function() {
		/* this implicitly calls mapmodule.notifyMoveEnd() which sends AfterMapMoveEvent */
		this.mapmodule.zoomOut();
	},
	sendMapZoomIn : function() {
		/* this implicitly calls mapmodule.notifyMoveEnd() which sends AfterMapMoveEvent */
		this.mapmodule.zoomIn();
	},
	CLASS_NAME : "OpenLayers.Control.PorttiMouse"
});
