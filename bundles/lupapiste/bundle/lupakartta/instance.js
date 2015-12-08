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
  _isButtonConfigured : function(pId, pGroup) {
    if (this.conf && (this.conf[pGroup] === false || (this.conf[pGroup] && this.conf[pGroup][pId] === false))) {
      // When conf is defined and pGroup or pId false, then exclude the button
      return false;
    } else {
      // Without a conf, all buttons are included
      return true;
    }
  },
  applicationId : null,
  /**
   * @method start BundleInstance protocol method
   */
  start : function() {
    // **************************************
    // Your code here
    // **************************************
    var me = this;

    if (this.conf && this.conf.id) {
      this.applicationId = this.conf.id;
    }

    // Should this not come as a param?
    var sandbox = Oskari.$('sandbox');
    this.sandbox = sandbox;
  
    this.buttonGroup = 'lupakartta';
    this.buttons = {
      'closebutton' : {
        iconCls : 'lupakartta-close',
        tooltip : {"fi": "Sulje kartta", "sv": "Stäng karta", "en": "Close map"}[Oskari.getLang()],
        sticky : false,
        callback : function() {
          window.close();
        },
        text : true
      }
    };
    
    // register to sandbox as a module
    sandbox.register(me);
    // register to listening events
    for ( var p in me.eventHandlers) {
      if (p) {
        sandbox.registerForEventByName(me, p);
      }
    }

    //add toolbar buttons
    var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
    for (var tool in this.buttons) {
      if (this._isButtonConfigured(tool, this.buttonGroup)) {
        sandbox.request(this, reqBuilder(tool, this.buttonGroup, this.buttons[tool]));
      }
    }
    
    // subscribe to hub events
    for (var p in me.hubEventHandlers) {
      if (p) {
        me.hubEventHandlers[p].id = hub.subscribe(p, me.hubEventHandlers[p]);
      }
    }

    $(window).on('beforeunload', function(e) {
      for (var p in me.hubEventHandlers) {
        if (p) {
          hub.unsubscribe(me.hubEventHandlers[p].id);
        }
      }
      hub.send("oskari-map-uninitialized");
    });

    var mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule');

    var markersplugin = Oskari.clazz.create('Oskari.lupapiste.bundle.lupakartta.plugin.MarkersPlugin');
    mapmodule.registerPlugin(markersplugin);
    mapmodule.startPlugin(markersplugin);

    var requestBuilder = sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest');
    var request = requestBuilder();
    sandbox.request("lupakartta", request);

    var map = sandbox.findRegisteredModuleInstance('MainMapModule').getMap();
    var styleMap = new OpenLayers.StyleMap({
      pointRadius : 6,
      fillOpacity : 0.35,
      fillColor : "#3CB8EA",
      strokeColor : "#0000FF",
      strokeWidth : 3,
      label : "${height}",
      fontSize : "20px"
    });
    var layerVectors = new OpenLayers.Layer.Vector("LupapisteVectors", {styleMap: styleMap});
    map.addLayer(layerVectors);

    var selectControl = new OpenLayers.Control.SelectFeature(layerVectors, {
      onSelect : function(feature) {
    	  if (feature.attributes.id != null){
    		  var event = sandbox.getEventBuilder('LupaPisteMyPlaces.MyPlaceSelectedEvent')(feature.attributes.id);
    	      sandbox.notifyAll(event);
    	  }        
      }
    });
    map.addControl(selectControl);
    selectControl.activate();

    sandbox.addRequestHandler('MapModulePlugin.GetFeatureInfoActivationRequest', {
      handleRequest : function(core, request) {
        // define request to prevent errors
      }
    });
    
    //Hack to fix wms sublayer change on zoom
    var reqName = 'MapModulePlugin.MapLayerVisibilityRequest',
    visibilityRequestBuilder = sandbox.getRequestBuilder(reqName),
    request;
    
    var layers = sandbox.findAllSelectedMapLayers();
    
    jQuery.each(layers, function() {
      if(this.isVisible()) {
        request = visibilityRequestBuilder(this.getId(), false);
        sandbox.request("lupakartta", request);
        request = visibilityRequestBuilder(this.getId(), true);
        sandbox.request("lupakartta", request);
      }
    });
        
    hub.send("oskari-map-initialized");
    // **************************************
    // Your code ends
    // **************************************
  },
  init : function() {
    // headless module so nothing to return
    return null;
  },
  getJemma : function(key) {
    var me = this;
    return me.jemma[key];
  },
  setJemma : function(key, val) {
    var me = this;
    me.jemma[key] = val;
    return true;
  },
  updatePrintableContent : function() {
    var sandbox = Oskari.$('sandbox');
    var eventBuilder = sandbox.getEventBuilder('Printout.PrintableContentEvent');
    var printEvent;
    var map = sandbox.findRegisteredModuleInstance('MainMapModule').getMap();
    var layer = map.getLayersByName("LupapisteVectors")[0];
    if (eventBuilder) {
        var jsonFormat = new OpenLayers.Format.GeoJSON();
        var json = jsonFormat.write(layer.features);
        printEvent = eventBuilder(this.getName(), null, null, json);
        sandbox.notifyAll(printEvent);
    }
  },
  /**
   * @method stop BundleInstance protocol method
   */
  stop : function() {
  },
  /**
   * @method update BundleInstance protocol method
   */
  update : function() {
  },
  onEvent : function(event) {
    var me = this;
    var handler = me.eventHandlers[event.getName()];
    if (!handler) {
      return;
    }

    return handler.apply(this, [ event ]);
  },
  hubEventHandlers : {
    "oskari-set-layers" : function(e) {

      var sandbox = Oskari.$('sandbox');

      var i = 0;

      while (e[i]) {

        var layer = sandbox.findMapLayerFromAllAvailable(e[i].name);

        if (layer != null) {

          if (e[i].action == "remove") {
            sandbox.postRequestByName('RemoveMapLayerRequest', [ layer.getId() ]);
          } else {

            sandbox.postRequestByName('AddMapLayerRequest', [ layer.getId(), false, layer.isBaseLayer() ]);

            var visible = false;

            if (e[i].visible == "true")
              visible = true;

            sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [ e[i].name, visible ]);
          }
        }

        i++;
      }

    },
    "oskari-show-layers" : function(e) {

      var sandbox = Oskari.$('sandbox');
      var requestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');

      var i = 0;

      while (e[i]) {

        var visible = false;

        if (e[i].visible == "true")
          visible = true;

        var request = requestBuilder(e[i].name, visible);
        sandbox.request("lupakartta", request);

        i++;
      }

    },
    "oskari-center-map" : function(e) {
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
      for ( var i in e.data) {
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
      // varmistetaan että karttaa ei zoomata liian lähelle pistettä
      var origCenter = bounds.getCenterLonLat();
      var minBbox = 500;
      if (Oskari.app.appConfig.lupakartta.conf.zoomMinBbox)
        minBbox = Oskari.app.appConfig.lupakartta.conf.zoomMinBbox / 2;
      bounds.extend(origCenter.add(minBbox, minBbox));
      bounds.extend(origCenter.add(-minBbox, -minBbox));

      requestBuilder = sandbox.getRequestBuilder('MapMoveRequest');
      request = requestBuilder(bounds.getCenterLonLat().lon, bounds.getCenterLonLat().lat, bounds);
      sandbox.request("lupakartta", request);
    },
    "inforequest-map-start" : function(e) {
      var sandbox = Oskari.$('sandbox');
      sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] draw-request " + e.drawMode);
      var config = {
        drawMode : e.drawMode
      };
      var me = sandbox.findRegisteredModuleInstance('lupakartta');
      me.setJemma('currentdrawmode', 'inforequest_' + e.drawMode);

      var requestBuilder;
      var request;

      if (e.clear !== undefined && e.clear) {
        // tyhjennetään
        requestBuilder = sandbox.getRequestBuilder('lupakartta.ClearMapRequest');
        request = requestBuilder();
        sandbox.request("lupakartta", request);
      }
      // aloitetaan piirto
      requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.StartDrawingRequest');
      request = requestBuilder(config);
      sandbox.request("lupakartta", request);
    },
    "map-get-geometry-request" : function(e) {

      var sandbox = Oskari.$('sandbox');
      sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] map-stop-editing-request");
      var requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.GetGeometryRequest');
      var request = requestBuilder(function(ee) {
        var me = Oskari.$('sandbox').findRegisteredModuleInstance('lupakartta');
        hub.send("oskari-save-drawings", {
          data : {
            drawings : JSON.stringify([ee]),
            id : me.applicationId
          }

        });
      });
      sandbox.request("lupakartta", request);

    },
    "map-stop-editing-request" : function(e) {

      var requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.StopDrawingRequest');
      var request = requestBuilder();
      sandbox.request("lupakartta", request);
    },
    "map-draw-start" : function(e) {
      var sandbox = Oskari.$('sandbox');
      sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] draw-request " + e.drawMode);

      var config = {
        drawMode : e.drawMode,
      };
      if (e.drawing) {
        var wkt = new OpenLayers.Format.WKT();
        var features = wkt.read(e.drawing);
        if (features) {
          if (features.constructor != Array) {
            features = [ features ];
          }
          var config = {
            drawMode : e.drawMode,
            geometry : features[0].geometry
          };
        }
      }
      var requestBuilder;
      var request;
      var me = sandbox.findRegisteredModuleInstance('lupakartta')
      me.setJemma('currentdrawmode', 'draw_' + e.drawMode);
      if (e.clear !== undefined && e.clear) {
        // tyhjennetään
        requestBuilder = sandbox.getRequestBuilder('lupakartta.ClearMapRequest');
        request = requestBuilder();
        sandbox.request("lupakartta", request);
      }
      // aloitetaan piirto

      if (e.drawMode == 'mapwindow') {
        var bounds = sandbox.findRegisteredModuleInstance('MainMapModule').getMap().calculateBounds();

        var drawing = new OpenLayers.Geometry.Polygon([ new OpenLayers.Geometry.LinearRing([ new OpenLayers.Geometry.Point(bounds.left, bounds.bottom), new OpenLayers.Geometry.Point(bounds.right, bounds.bottom), new OpenLayers.Geometry.Point(bounds.right, bounds.top), new OpenLayers.Geometry.Point(bounds.left, bounds.top) ]) ]);

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

      } else {
        requestBuilder = sandbox.getRequestBuilder('LupaPisteMyPlaces.StartDrawingRequest');
        request = requestBuilder(config);
        sandbox.request("lupakartta", request);
      }

    },
    "map-clear-request" : function(e) {
      var sandbox = Oskari.$('sandbox');
      sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] map-clear-request");
      var requestBuilder = sandbox.getRequestBuilder('lupakartta.ClearMapRequest');
      var request = requestBuilder();
      sandbox.request("lupakartta", request);
      var me = sandbox.findRegisteredModuleInstance('lupakartta')
      me.updatePrintableContent();
    },
    "map-update-size" : function(e) {
      var sandbox = Oskari.$('sandbox');
      sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] map-update-size");
      // set new center to old center
      var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
      var center = mapmodule.getMap().getCenter();
      mapmodule.getMap().updateSize();
      var requestBuilder = sandbox.getRequestBuilder('MapMoveRequest');
      var request = requestBuilder(center.lon, center.lat);
      sandbox.request("lupakartta", request);
    },
    "map-set-center" : function(e) {
      var sandbox = Oskari.$('sandbox');
      sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance] map-set-center");
      var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
      var requestBuilder = sandbox.getRequestBuilder('MapMoveRequest');
      var request = requestBuilder(e.x, e.y, e.zoom);
      sandbox.request("lupakartta", request);
    },
    "oskari-show-shapes" : function(e) {
      var sandbox = Oskari.$('sandbox');
      var map = sandbox.findRegisteredModuleInstance('MainMapModule').getMap();
      var layer = map.getLayersByName("LupapisteVectors")[0];
      var service = sandbox.getService('Oskari.lupapiste.bundle.myplaces2.service.MyPlacesService');

      if (e.clear) {
        // is this actually needed?
        layer.removeAllFeatures();
        var places = service.getAllMyPlaces();
        for (var i = 0; i < places.length; ++i) {
          service._removeMyPlace(places[i].getId());
          service._notifyDataChanged();
        }
      }

      for (var i = 0; i < e.drawings.length; ++i) {
        var drawing = e.drawings[i];
        var place = Oskari.clazz.create('Oskari.lupapiste.bundle.myplaces2.model.MyPlace');
        place.setId(drawing.id);
        place.setName(drawing.name);
        place.setDescription(drawing.desc);
        place.setCategoryID(drawing.category);
        place.setArea(drawing.area);
        place.setHeight(drawing.height);
        place.setLength(drawing.length);
        
        var style = null;
        
        if(typeof e.style !== 'undefined' && e.style !== null) {
          style = jQuery.extend({}, e.style);
          style.label = style.label || place.getHeight();
          style.fontSize = style.fontSize || "20px";
        }

        var wkt = new OpenLayers.Format.WKT();
        var feature;
        var features = wkt.read(drawing.geometry);
        if (features) {

          var attributes = {
              'id' : place.getId(),
              'name' : place.getName(),
              'desc' : place.getDescription(),
              'category' : place.getCategoryID(),
              'area' : place.getArea(),
              'length' : place.getLength(),
              'height' : place.getHeight()  
          };
          
          if (features.constructor != Array) {
            feature = new OpenLayers.Feature.Vector(features.geometry, attributes, style);
            place.setGeometry(features.geometry);
          } else {
            feature = new OpenLayers.Feature.Vector(features[0].geometry, attributes, style);
            place.setGeometry(features[0].geometry);
          }

        }

        if (layer.getFeatureBy("id", place.getId())) {
          layer.removeFeatures([ layer.getFeatureBy("id", place.getId()) ]);
        }

        if (feature && feature.geometry) {
          layer.addFeatures([ feature ]);

          service._removeMyPlace(place.getId());
          service._addMyPlace(place);
          service._notifyDataChanged();
        }
      }
      var me = sandbox.findRegisteredModuleInstance('lupakartta')
      me.updatePrintableContent();
     }
  },
  eventHandlers : {
    /**
     * @method MapClickedEvent
     * @param {Oskari.mapframework.mapmodule-plugin.event.MapClickedEvent}
     *          event
     */
      'Lupapiste.FeaturesAdded': function (event) {
          var drawings = [];
          var features = event.getFeatures();
          for (var i = 0; i < features.length; ++i) {
              drawings.push({
                  id: features[i].attributes.id,
                  name: features[i].attributes.name,
                  desc: "",
                  category: features[i].attributes.category,
                  geometry: features[i].geometry.toString(),
                  area: "",
                  height: "",
                  length: ""
              });
          }
          hub.send("oskari-save-drawings", {
              data: {
                  drawings: JSON.stringify(drawings),
                  applicationId: this.applicationId
              }
          });
          this.updatePrintableContent();
      },
    'Lupapiste.PlaceSaved' : function(event) {
      var drawings = [];
      var places = event.getPlaces();
      for (var i = 0; i < places.length; ++i) {
        drawings.push({
          id : places[i].getId(),
          name : places[i].getName(),
          desc : places[i].getDescription(),
          category : places[i].getCategoryID(),
          geometry : places[i].getGeometry().toString(),
          area : places[i].getArea(),
          height : places[i].getHeight(),
          length : places[i].getLength()
        });
      }
      hub.send("oskari-save-drawings", {
        data : {
          drawings : JSON.stringify(drawings),
          applicationId : this.applicationId
        }
      });
      this.updatePrintableContent();
    },
    'LupaPisteMyPlaces.FinishedDrawingEvent_' : function(event) {

      if (this.getJemma('currentdrawmode').indexOf('inforequest_') == 0) {
        var requestBuilder = this.sandbox.getRequestBuilder('lupakartta.AddMarkerRequest');
        var request = requestBuilder(event._drawing.x, event._drawing.y, null, null, 'http://www.openlayers.org/dev/img/marker-green.png');
        this.sandbox.request("lupakartta", request);
        var requestBuilder = this.sandbox.getRequestBuilder('LupaPisteMyPlaces.StopDrawingRequest');
        var request = requestBuilder();
        this.sandbox.request("lupakartta", request);
        hub.send("inforequest-map-click", {
          data : {
            location : {
              x : event._drawing.x,
              y : event._drawing.y
            }
          }
        });
      }

      if (this.getJemma('currentdrawmode').indexOf('inforequest_') < 0) {

        requestBuilder = this.sandbox.getRequestBuilder('LupaPisteMyPlaces.StopDrawingRequest');
        request = requestBuilder(true);
        this.sandbox.request("lupakartta", request);
        hub.send('oskari-show-shapes', {
          drawing : event._drawing.toString(),
          clear : false
        });

        var drawings = [];

        var sandbox = Oskari.$('sandbox');
        var map = sandbox.findRegisteredModuleInstance('MainMapModule').getMap();
        var layer = map.getLayersByName("LupapisteVectors");

        for (var i = 0; i < layer[0].features.length; ++i) {
          drawings.push(layer[0].features[i]);
        }

        hub.send("oskari-save-drawings", {
          data : {
            drawings : JSON.stringify(drawings),
            applicationId : this.applicationId
          }
        });
        this.updatePrintableContent();

      }
    }
  }

}, {
  protocol : [ 'Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.mapframework.request.Request', 'Oskari.userinterface.Stateful' ]
});
