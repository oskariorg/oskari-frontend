/**
 * @class
 *
 *
 */
Oskari.clazz.define("Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
}, {
	__name : "lupakartta",
	// jemma - a hash for storing state of what ever needed 
	 jemma : {},
	 
	getName : function() {
		return this.__name;
	},
	getParameter : function() {
		return null;
	},
	/**
	 * @method start
	 * BundleInstance protocol method
	 */
	start : function() {
		//  **************************************
		//    Your code here
		//  **************************************
		var me = this;
	    
		// Should this not come as a param?
		var sandbox = Oskari.$('sandbox');
		this.sandbox = sandbox;

		// register to sandbox as a module
		sandbox.register(me);
		// register to listening events
		for (var p in me.eventHandlers) {
			if (p) {
				sandbox.registerForEventByName(me, p);
			}
		}
		
		var mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule');

		var drawplugin = Oskari.clazz.create('Oskari.lupapiste.bundle.myplaces2.plugin.DrawPlugin');
		mapmodule.registerPlugin(drawplugin);
		mapmodule.startPlugin(drawplugin);

		var markersplugin = Oskari.clazz.create('Oskari.lupapiste.bundle.lupakartta.plugin.MarkersPlugin');
		mapmodule.registerPlugin(markersplugin);
		mapmodule.startPlugin(markersplugin);

		var printplugin = Oskari.clazz.create('Oskari.lupapiste.bundle.lupakartta.plugin.PrintPlugin');
		printplugin.setPrintUrl(this.conf.printUrl);
		mapmodule.registerPlugin(printplugin);
		mapmodule.startPlugin(printplugin);
		
		var requestBuilder = sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest');
		var request = requestBuilder();
		sandbox.request("lupakartta", request);
		
		hub.subscribe("documents-map", function(e) {
			var sandbox = Oskari.$('sandbox');
			sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] map-show-markers-request");
			var bounds;
			var requestBuilder;
			var request;

			if (e.clear !== undefined && e.clear) {
				requestBuilder = sandbox.getRequestBuilder('lupakartta.ClearMapRequest');
				request = requestBuilder();
				sandbox.request("lupakartta", request);
			}
			for (var i in e.data) {
				if (e.data[i].location != undefined) {
					requestBuilder = sandbox.getRequestBuilder('lupakartta.AddMarkerRequest');
					request = requestBuilder(e.data[i].location.x, e.data[i].location.y, e.data[i].id, e.data[i].events, e.data[i].iconUrl);
					sandbox.request("lupakartta", request);
				}
			}
			var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
			var markersPlugin = mapmodule.getPluginInstance('lupakartta.MarkersPlugin');
			bounds = markersPlugin.getMapMarkerBounds();
			bounds = bounds.scale(1.1);
			//varmistetaan että karttaa ei zoomata liian lähelle pistettä
			var origCenter = bounds.getCenterLonLat();
			var minBbox = 500;
			if (Oskari.app.appConfig.lupakartta.conf.zoomMinBbox)
				minBbox = Oskari.app.appConfig.lupakartta.conf.zoomMinBbox / 2;
			bounds.extend(origCenter.add(minBbox, minBbox));
			bounds.extend(origCenter.add(-minBbox, -minBbox));

			requestBuilder = sandbox.getRequestBuilder('MapMoveRequest');
			request = requestBuilder(bounds.getCenterLonLat().lon, bounds.getCenterLonLat().lat, bounds);
			sandbox.request("lupakartta", request);
		});

		hub.subscribe("inforequest-map-start", function(e) {
			var sandbox = Oskari.$('sandbox');
			sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] draw-request " + e.drawMode);
			var config = {
				drawMode : e.drawMode
			};
			me.setJemma('currentdrawmode','inforequest_'+e.drawMode);
			
			var requestBuilder;
			var request;

			if (e.clear !== undefined && e.clear) {
				//tyhjennetään
				requestBuilder = sandbox.getRequestBuilder('lupakartta.ClearMapRequest');
				request = requestBuilder();
				sandbox.request("lupakartta", request);
			}
			//aloitetaan piirto
			requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.StartDrawingRequest');
			request = requestBuilder(config);
			sandbox.request("lupakartta", request);
		});

		
		hub.subscribe("map-get-geometry-request", function(e) {
	
			var sandbox = Oskari.$('sandbox');
			sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] map-stop-editing-request");
			var requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.GetGeometryRequest');
			var request = requestBuilder(
			function(ee) {
						hub.send("map-draw-done", {
						data : {
							drawing : ee
								}
						
					});
			});
			sandbox.request("lupakartta", request);
			

		});
		hub.subscribe("map-stop-editing-request", function(e) {
		
			var requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.StopDrawingRequest');
			var request = requestBuilder();
			sandbox.request("lupakartta", request);
		});
		
		//var requestBuilder = this.sandbox.getRequestBuilder('LupaPisteMyPlaces.StopDrawingRequest');
			//var request = requestBuilder();
			//this.sandbox.request("lupakartta", request);
			
			
		hub.subscribe("map-draw-start", function(e) {
			var sandbox = Oskari.$('sandbox');
			sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] draw-request " + e.drawMode);
			var config = {
				drawMode : e.drawMode
			};
			var requestBuilder;
			var request;
			me.setJemma('currentdrawmode','draw_'+e.drawMode);
			if(e.clear !== undefined && e.clear) {
				//tyhjennetään
				requestBuilder = sandbox.getRequestBuilder('lupakartta.ClearMapRequest');
				request = requestBuilder();
				sandbox.request("lupakartta", request);
			}
			//aloitetaan piirto
						
			
			if(e.drawMode == 'mapwindow'){
				var bounds=	sandbox.findRegisteredModuleInstance('MainMapModule').getMap().calculateBounds();
	
			
			var drawing = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(bounds.left,bounds.bottom),new OpenLayers.Geometry.Point(bounds.right,bounds.bottom),new OpenLayers.Geometry.Point(bounds.right,bounds.top),new OpenLayers.Geometry.Point(bounds.left,bounds.top)])]);

			var config = {
				drawMode : 'area',
				geometry : drawing
			};
			requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.StartDrawingRequest');
			request = requestBuilder(config);
			sandbox.request("lupakartta", request);
			
			var requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.StopDrawingRequest');
			var request = requestBuilder();
			sandbox.request("lupakartta", request);
			
					
			}else{
			requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.StartDrawingRequest');
			request = requestBuilder(config);
			sandbox.request("lupakartta", request);
			
			}
			
			


		});

		
		hub.subscribe("map-clear-request", function(e) {
			var sandbox = Oskari.$('sandbox');
			sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] map-clear-request");
			var requestBuilder = sandbox.getRequestBuilder('lupakartta.ClearMapRequest');
			var request = requestBuilder();
			sandbox.request("lupakartta", request);
		});

		hub.subscribe("map-update-size", function(e) {
			var sandbox = Oskari.$('sandbox');
			sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] map-update-size");
			//set new center to old center
			var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
			var center = mapmodule.getMap().getCenter();
			mapmodule.getMap().updateSize();
			mapmodule.getMap().setCenter(center);
		});

		hub.send("map-initialized");
		//  **************************************
		//    Your code ends
		//  **************************************
	},
	init : function() {
		// headless module so nothing to return
		return null;
	},
	getJemma : function(key){
	var me = this;
	return me.jemma[key];
	},
	setJemma : function(key,val){
		var me = this;
		me.jemma[key]=val;
	return  true;
	},
	/**
	 * @method stop
	 * BundleInstance protocol method
	 */
	stop : function() {
	},
	/**
	 * @method update
	 * BundleInstance protocol method
	 */
	update : function() {
	},
	onEvent : function(event) {
		var me = this;
		var handler = me.eventHandlers[event.getName()];
		if (!handler) {
			return;
		}

		return handler.apply(this, [event]);
	},

	eventHandlers : {
		/**
		 * @method MapClickedEvent
		 * @param {Oskari.mapframework.mapmodule-plugin.event.MapClickedEvent} event
		 */
		/*'MapClickedEvent' : function(event) {
		 jQuery("#eventMessages").html("MapClickedEvent<br/>" + jQuery("#eventMessages").html());
		 },
		 'AfterMapMoveEvent' : function(event) {
		 jQuery("#eventMessages").html("AfterMapMoveEvent<br/>" + jQuery("#eventMessages").html());
		 },*/

		'LupaPisteMyPlaces.FinishedDrawingEvent' : function(event) {

		    if(this.getJemma('currentdrawmode').indexOf('inforequest_') ==0){
		   
			jQuery.ajax({
				type : "POST",
				url : this.conf.ajaxurl + "/Kunta",
				data : "{'x':" + event._drawing.x + ",'y':" + event._drawing.y + "}",
				contentType : "application/json; charset=utf-8",
				dataType : "json",
				success : function(response) {
					var kuntatiedot = response.d;

					hub.send("inforequest-map-click", {
						data : {
							kunta : {
								kuntanumero : kuntatiedot.kuntanumero,
								kuntanimi_fi : kuntatiedot.kuntanimi_fi,
								kuntanimi_se : kuntatiedot.kuntanimi_se
							},
							location : {
								x : kuntatiedot.x,
								y : kuntatiedot.y
							}
						}
					});

				},
				failure : function(msg) {
					alert(msg);
				}
			});

			var requestBuilder = this.sandbox.getRequestBuilder('lupakartta.AddMarkerRequest');
			//var request = requestBuilder(event._drawing,  null, null, null, 'http://www.openlayers.org/dev/img/marker-green.png');
			var request = requestBuilder(event._drawing.x, event._drawing.y, null, null, 'http://www.openlayers.org/dev/img/marker-green.png');
			this.sandbox.request("lupakartta", request);
			var requestBuilder = this.sandbox.getRequestBuilder('LupaPisteMyPlaces.StopDrawingRequest');
			var request = requestBuilder();
			this.sandbox.request("lupakartta", request);
			}
			
			if(this.getJemma('currentdrawmode').indexOf('inforequest_') <0){
			
			
			if(this.getJemma('alapuhdista')==1){

			this.setJemma('alapuhdista','');
			}else{

			hub.send("map-draw-done", {
						data : {
							drawing : event._drawing
								}
						
					});
			
			var requestBuilder = this.sandbox.getRequestBuilder('LupaPisteMyPlaces.StopDrawingRequest');
			var request = requestBuilder();
			this.sandbox.request("lupakartta", request);
			
			
			var config = {
				drawMode : 'area',
				geometry : event._drawing,
				continueCurrent : false
			};
			this.setJemma('alapuhdista', 1);
			requestBuilder = this.sandbox.getRequestBuilder('LupaPisteMyPlaces.StartDrawingRequest');
			request = requestBuilder(config);
			this.sandbox.request("lupakartta", request);
			}
			}

			
		}
	}

}, {
	protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.mapframework.request.Request', 'Oskari.userinterface.Stateful']
});
