/**
 * @class Oskari.mapframework.mapmodule.ToolSelectionHandler
 * Handles ToolSelectionRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.ToolSelectionHandler',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.sandbox.Sandbox}
     *            sandbox reference to sandbox
     * @param {Oskari.mapframework.mapmodule.ControlsPlugin}
     *            controlsPlugin reference to controlsPlugin
     */

    function (sandbox, publisherToolbarPlugin) {
        this.sandbox = sandbox;
        this.publisherToolbarPlugin = publisherToolbarPlugin;
    }, {
        /**
         * @method handleRequest
         * Handles the request
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox
         * core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.ToolSelectionRequest}
         * request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var me = this;
            var toolName = request.getToolName();
            var stateHandler;
            var type = null;
            var id = null;
            if (toolName === 'map_control_tool_prev') {
                // custom history (TODO: more testing needed + do this with request
                // instead of findRegisteredModuleInstance)
                stateHandler = me.sandbox.findRegisteredModuleInstance('StateHandler');
                if (stateHandler) {
                    stateHandler.historyMovePrevious();
                }

            } else if (toolName === 'map_control_tool_next') {
                // custom history (TODO: more testing needed + do this with request
                // instead of findRegisteredModuleInstance)
                stateHandler = me.sandbox.findRegisteredModuleInstance('StateHandler');
                if (stateHandler) {
                    stateHandler.historyMoveNext();
                }
            } else if (toolName === 'map_control_select_tool') {
                // clear selected area
                var slp = me.sandbox.findRegisteredModuleInstance('SketchLayerPlugin');
                if (slp) {
                    slp.clearBbox();
                }
            } else if (toolName === 'map_control_zoom_tool' && me.controlsPlugin._zoomBoxTool) {
                me.controlsPlugin._zoomBoxTool.activate();
            } else if (toolName === 'map_control_measure_tool') {
                type = 'LineString';
                id = 'measureline';
                me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [id, type, {
                     showMeasureOnMap: true}]);
//                me.sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', ['PolygonDrawLayer', false]);
            } else if (toolName === 'map_control_measure_area_tool') {
                type = 'Polygon';
                id = 'measurearea';

                me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [id, type, {showMeasureOnMap: true}]);

//                var geojsonObject = {
//                        'type': 'FeatureCollection',
//                        'crs': {
//                          'type': 'name',
//                          'properties': {
//                            'name': 'EPSG:3067'
//                          }
//                        },
//                        'features': [
//                          {
//                            'type': 'Feature',
//                            'geometry': {
//                              'type': 'Point',
//                              'coordinates': [488704, 6939136]
//                            },
//                            'properties': {
//                              'kohteenTyyppi': 'rakennus'
//                            }
//                          }
//                        ]
//                      };
                var geojsonObject = {
                		'id': 'olenPiste',
                	    'type': 'FeatureCollection',
                	    'crs': {
                	      'type': 'name',
                	      'properties': {
                	        'name': 'EPSG:3067'
                	      }
                	    },
                	    'features': [
                	      {
                	        'type': 'Feature',
                	        'geometry': {
                	          'type': 'Point',
                	          'coordinates': [488704, 6939136]
                	        },
                	        'properties': {
                	          'id': 'olenPiste',
                	          'species': 'parcel1'
                	        }
                	      }
                	    ]
                	  };

                  var params = [geojsonObject, {
                		  layerId: 'layer1',
                          clearPrevious: false,
                          centerTo: false,
                          cursor: 'zoom-in',
                          featureStyle: {
                              fill: {
                                  color: 'rgba(0,0,0,1)'
                              },
                              stroke : {
                                  color: '#ff0000',
                                  width: 5
                              },
                              image : {
                                  radius: 40,
                                  fill : {
                                      color : 'rgba(255,0,0,1)'
                                  }
                            	  //,
//                                  shape: 1,
//                                  size: 1
                              },
                              text : {
                                  scale : 1.3,
                                  fill : {
                                      color : 'rgba(0,0,0,1)'
                                  },
                                  stroke : {
                                      color : 'rgba(255,255,255,1)',
                                      width : 2
                                  }
                              }
                          }
                  }];
//                var options = {
//                	    'minResolution': 0,
//                	    'maxResolution': 1000
//                	  };
//                	  var params = [geojsonObject, {
//                	    layerId: 'layer1',
//                	    clearPrevious: false,
//                	    layerOptions: options,
//                	    centerTo: false,
//                	    featureStyle: {
//                	      stroke: {
//                	        color : 'rgba(255,0,0,1)',
//                	        width: 3},
//                	      image : {
//                              radius: 40,
//                              fill : {
//                                  color : 'rgba(255,0,0,1)'
//                              }
//
//                          },
//                	      text : {
//                	        scale : 2,
//                	        fill : {
//                	          color : 'rgba(0,0,0,1)'
//                	        },
//                	        stroke : {
//                	          color : 'rgba(255,255,255,1)',
//                	          width : 2
//                	        },
//                	        labelText: 'blaa blaa'
//                	      }
//                	    },
//                	    cursor: 'pointer',
//                	    prio: 4,
//                	    minScale: 1000
//                	  }];
//                  Oskari.getSandbox().postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', params);
                  var layers = {layer: ['layer1']};
                  var features = {'id': ['olenPiste']};
//                  Oskari.getSandbox().postRequestByName('MapModulePlugin.ZoomToFeaturesRequest',[layers, features]);

                  var data = {
                		    x: 373285,
                		    y: 6702913,
                		    msg : 'testi\n uuuu',
                		    shape: 2,
                		    size: 3,
                		    color: 'bf2652',
                		    stroke: 'bbbbbb'
                		};
                  Oskari.getSandbox().postRequestByName('MapModulePlugin.AddMarkerRequest', [data, "marker_id"]);
                  /*var x = 373285,
                      y = 6702913,
                      zoomLevel = 12;
                  Oskari.getSandbox().postRequestByName(
                      'MapMoveRequest', [x, y, zoomLevel]
                  );*/
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });