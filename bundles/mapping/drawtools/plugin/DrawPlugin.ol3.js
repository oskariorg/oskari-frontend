/**
 * @class Oskari.mapping.drawtools.plugin.DrawPlugin
 * Map engine specific implementation for draw tools
 */
Oskari.clazz.define(
    'Oskari.mapping.drawtools.plugin.DrawPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._clazz = 'Oskari.mapping.drawtools.plugin.DrawPlugin';
        this._name = 'GenericDrawPlugin';

        this._layerId = 'DrawLayer';
        this._bufferedFeatureLayerId = 'BufferedFeatureLayer';

        this._defaultStyle = {
    		fillColor: 'rgba(255,0,255,0.2)',
    		strokeColor: 'rgba(0,0,0,1)',
    		width: 2,
    		radius: 4,
    		textScale: 1.3,
    		textOutlineColor: 'rgba(255,255,255,1)',
    		textColor: 'rgba(0,0,0,1)',
    		lineDash: [5]
    	};
        this._styleTypes = ['draw', 'modify', 'intersect'];
        this._styles = {};
  	   	this._drawLayers = {};
    },
    {
    	/**
         * @method setDefaultStyle
         * - set styles for draw, modify and intersect mode
         *
         * @param {Object} styles. If not given, will set default styles
         */
        setDefaultStyle : function(styles) {
        	var me = this;
        	//setting defaultStyles
        	_.each(me._styleTypes, function (s) {
      			me._styles[s] = new ol.style.Style({
	           	    fill: new ol.style.Fill({
	           	      color: me._defaultStyle.fillColor
	           	    }),
	           	    stroke: new ol.style.Stroke({
	           	      color: me._defaultStyle.strokeColor,
	           	      width: me._defaultStyle.width
	           	    }),
	           	    image: new ol.style.Circle({
	           	      radius: me._defaultStyle.radius,
	           	      fill: new ol.style.Fill({
	           	        color: me._defaultStyle.strokeColor
	           	      })
	           	    }),
		           	text: new ol.style.Text({
		                 scale: me._defaultStyle.textScale,
		                 fill: new ol.style.Fill({
		                   color: me._defaultStyle.textColor
		                 }),
		                 stroke: new ol.style.Stroke({
		                   color: me._defaultStyle.textOutlineColor,
		                   width: me._defaultStyle.width
		                 })
		              })
      			});
      		});
        	//overwriting default styles if given
        	if(styles) {
        		_.each(styles, function (style, styleType) {
        			if(Oskari.util.keyExists(style, 'fill.color')) {
            			me._styles[styleType].getFill().setColor(style.fill.color);
        			}
		        	if(Oskari.util.keyExists(style, 'stroke.color')) {
			    		me._styles[styleType].getStroke().setColor(style.stroke.color);
		        	}
		        	if(Oskari.util.keyExists(style, 'stroke.width')) {
			    		me._styles[styleType].getStroke().setWidth(style.stroke.width);
		        	}
//		        	if(me.hasNestedObj(style, 'stroke.lineDash')) {
//			    		me._styles[styleType].getStroke().setLineDash(style.stroke.lineDash);
//		        	}
		        	if(Oskari.util.keyExists(style, 'image.radius')) {
			    		me._styles[styleType].getImage().radius = style.image.radius;
		        	}
		        	if(Oskari.util.keyExists(style, 'image.fill.color')) {
			    		me._styles[styleType].getImage().getFill().setColor(style.image.fill.color);
		        	}
		        	if(Oskari.util.keyExists(style, 'text.fill.color')) {
			    		me._styles[styleType].getText().getFill().setColor(style.text.fill.color);
		        	}
		        	if(Oskari.util.keyExists(style, 'text.scale')) {
			    		me._styles[styleType].getText().setScale(style.text.scale);
		        	}
		        	if(Oskari.util.keyExists(style, 'text.stroke.color')) {
			    		me._styles[styleType].getText().getFill().setColor(style.text.stroke.color);
		        	}
		        	if(Oskari.util.keyExists(style, 'text.stroke.width')) {
			    		me._styles[styleType].getText().getStroke().setWidth(style.text.stroke.width);
		        	}
        		});
        	}
        },
        /**
         * @method draw
         * - activates draw and modify controls
         *
         * @param {String} id, that identifies the request
         * @param {String} shape: drawing shape: Point/Circle/Polygon/Box/Square/LineString
         * @param {Object} options include:
         * 					{Number} buffer: buffer for drawing buffered line and dot. If not given or 0, will disable dragging.
         * 					{Object} style: styles for draw, modify and intersect mode. If options don't include custom style, sets default styles
         * 					{Boolean} allowMiltipleDrawing: true - multiple selection is allowed, false - selection will be removed before drawing a new selection. Default is false.
         * 					{Boolean} showMeasure: true - if measure result should be displayed on selection. Default is false.
         * 					{Boolean} drawControl: true - will activate draw control, false - will not activate. Default is true.
         * 					{Boolean} modifyControl: true - will activate modify control, false, will not activate. Default is true.
         *      	 		{String} geojson: geojson for editing. If not given, will activate draw/modify control according to given shape.
         */
        draw : function(id, shape, options) {
        	// TODO: implementations
            // if shape == geojson -> setup editing it
            // if shape == undefined -> update buffer for existing drawing (any other reason for this? text etc?)
            // if shape is one of the predefined draw options -> start corresponding draw tool
            // if options.buffer is defined -> use it for dot and line and prevent dragging to create buffer
            // TODO : start draw control
            // use default style if options don't include custom style
        	var me = this;
        	me._shape = shape;
        	me._buffer = options.buffer;
        	me._id = id;

        	me.setDefaultStyle(options.style);

        	me._sandbox = me.getSandbox();
        	me._map = me.getMapModule().getMap();

        	// creating layer for drawing (if layer not already added)
        	if(!me._drawLayers[me._layerId]) {
        		me.addVectorLayer(me._layerId);
        	}
        	// creating layer for buffered features (if layer not already added)
        	if(!me._drawLayers[me._bufferedFeatureLayerId]) {
        		me.addVectorLayer(me._bufferedFeatureLayerId);
        	}
        	//activate drawcontrols
        	if(shape) {
        		me.drawShape(shape, options);
        	} else {
                // if shape == undefined -> update buffer for existing drawing (any other reason for this? text etc?)
        	}
        },
        /**
         * @method drawShape
         * - activates draw/modify controls. If geojson is given, setup editing it
         *
         * @param {String} shape
         * @param {Object} options
         */
        drawShape : function(shape, options) {
        	var me = this;

         	if(options.geojson) {
         		var jsonFormat = new ol.format.GeoJSON();
            	var featuresFromJson = jsonFormat.readFeatures(options.geojson);
            	me._drawLayers[me._layerId].getSource().addFeatures(featuresFromJson);
         	}
        	if(options.drawControl !== false) {
        		me.addDrawInteraction(me._layerId, shape, options);
        	}
        	if(options.modifyControl !== false) {
        		me.addModifyInteraction(me._layerId, shape, options);
        	}
//        	me.reportDrawingEvents();
        },
        /**
         * @method stopDrawing
         * -  sends DrawingEvent and removes draw and modify controls
         *
         * @param {String} id
         * @param {boolean} clearCurrent: if true, all selection will be removed from the map
         */
        stopDrawing : function(id, clearCurrent) {
        	var me = this;
        	var options = {
        		clearCurrent: clearCurrent,
        		isFinished: true
        	};
        	me.sendDrawingEvent(id, options);
            //deactivate draw nad modify controls
            me.removeInteractions();
        },
        /**
         * @method sendDrawingEvent
         * -  sends DrawingEvent
         *
         * @param {String} id
         * @param {object} options include:
         * 				 	{Boolean} clearCurrent: true - all selection will be removed from the map after stopping plugin, false - will keep selection on the map. Default is false.
         * 					{Boolean} isFinished: true - if drawing is completed. Default is false.
         */
        sendDrawingEvent: function(id, options) {
        	var me = this;
        	var features = me.getFeatures(me._layerId);
        	var bufferedFeatures = me.getFeatures(me._bufferedFeatureLayerId);
        	var isFinished = false;

        	if(me._shape === 'Circle') {
				bufferedFeatures = me.getCircleAsPolygonFeature(features);
				features = me.getCircleAsPointFeature(features);
			} else if(me._shape === 'LineString' && me._buffer > 0) {
				me.addBufferPropertyToFeatures(features, me._buffer);
			}
            // TODO: get geojson for matching id
            var geojson = me.getFeaturesAsGeoJSON(features);
            var bufferedGeoJson = me.getFeaturesAsGeoJSON(bufferedFeatures);

            var data = {
                lenght : me._length,
                area : me._area,
                buffer: me._buffer,
                bufferedGeoJson: bufferedGeoJson,
                shape: me._shape
            };
            if(options.clearCurrent) {
                // TODO: clear the drawing matching the id from map
            	me.clearDrawing();
            }
            if(options.isFinished) {
            	isFinished = options.isFinished;
            }
            var event = me._sandbox.getEventBuilder('DrawingEvent')(id, geojson, data, isFinished);
//            console.log(geojson);

            me._sandbox.notifyAll(event);
        },
        /**
         * @method addVectorLayer
         * -  adding layer to the map
         *
         * @param {String} layerId
         */
        addVectorLayer : function(layerId) {
        	var me = this;
        	var vector = new ol.layer.Vector({
          	  id: layerId,
          	  source: new ol.source.Vector({features: new ol.Collection()}),
          	  style: me._styles['draw']
          	});
          	me._map.addLayer(vector);
          	me._drawLayers[layerId] = vector;
		},
		 /**
         * @method clearDrawing
         * -  remove features from the draw layers
         */
		clearDrawing : function(){
			var me = this;
			me._drawLayers[me._layerId].getSource().getFeaturesCollection().clear();
			me._drawLayers[me._bufferedFeatureLayerId].getSource().getFeaturesCollection().clear();
		},
		 /**
         * @method addDrawInteraction
         * -  activates draw control
         *
         * @param {String} layerId
         * @param {String} shape
         * @param {Object} options
         */
        addDrawInteraction : function(layerId, shape, options) {
        	var me = this;
        	var geometryFunction, maxPoints, geometryType;
        	geometryType = shape;
        	var sketch;
        	var optionsForDrawingEvent = {
 	        	isFinished: false
	        };

        	if (shape === 'LineString') {
    	    	 geometryFunction = function (coordinates, geometry) {
	    	    	 if (!geometry) {
	    	    		  geometry = new ol.geom.LineString(null);
	    	          }
	    	    	  geometry.setCoordinates(coordinates);
	    	    	  if (options.buffer > 0) {
	    	    		  me.drawBufferedGeometry(geometry, options.buffer);
	    	    	  }
	        	      me.showText(this.sketchFeature_, me.getLineLength(geometry), options);
	        	      me.sendDrawingEvent(me._id, optionsForDrawingEvent);
	    	    	  return geometry;
	    	      }
    	    } else if (shape === 'Box') {
    	    	 maxPoints = 2;
    	    	 geometryType = 'LineString';
    	         geometryFunction = function(coordinates, geometry) {
    	           if (!geometry) {
    	             geometry = new ol.geom.Polygon(null);
    	           }
    	           var start = coordinates[0];
    	           var end = coordinates[1];
    	           geometry.setCoordinates([[start, [start[0], end[1]], end, [end[0], start[1]], start]]);
	        	   me.sendDrawingEvent(me._id, optionsForDrawingEvent);
    	           return geometry;
    	         }
    	    } else if (shape === 'Square') {
    	        geometryType = 'Circle';
    	        geometryFunction = ol.interaction.Draw.createRegularPolygon(400);
    	    } else if (shape === 'Circle' && options.buffer > 0) {
    	    	geometryType = 'Point';
	    		geometryFunction = function(coordinates, geometry) {
	    			 if (!geometry) {
	    				 geometry = new ol.geom.Circle(coordinates, options.buffer);
	    			 }
	        	     me.sendDrawingEvent(me._id, optionsForDrawingEvent);
	    			 return geometry;
	    		 }
    	    } else if(shape === 'Polygon') {
    	    	geometryFunction = function(coordinates, geometry) {
    	    		if (!geometry) {
    	    			geometry = new ol.geom.Polygon(null);
    	    	    }
    	    		geometry.setCoordinates(coordinates);
        	    	me.showText(this.sketchFeature_, me.getPolygonArea(geometry), options);
	        	    me.sendDrawingEvent(me._id, optionsForDrawingEvent);
	    			return geometry;
	    		 }
    	    }

	    	me._draw = new ol.interaction.Draw({
    		  features: me._drawLayers[layerId].getSource().getFeaturesCollection(),
    	      type: geometryType,
    	      style: me._styles['draw'],
    	      geometryFunction:  geometryFunction,
    	      maxPoints: maxPoints
	    	});

	        me._map.addInteraction(me._draw);

			me._draw.on('drawstart', function(evt) {
				me._sketch = evt.feature;
				if(options.allowMultipleDrawing === 'single') {
					me.clearDrawing();
				}
			});
			me._draw.on('drawend', function() {
				if(options.allowMultipleDrawing === false) {
					me.stopDrawing(me._id, false);
				}
			});
		},
		 /**
         * @method addModifyInteraction
         * -  activates modify control
         *
         * @param {String} layerId
         * @param {String} shape
         * @param {Object} options
         */
        addModifyInteraction : function(layerId, shape, options) {
        	var me = this;
        	me._modify = new ol.interaction.Modify({
     		   features: me._drawLayers[layerId].getSource().getFeaturesCollection(),
     		   style: me._styles['modify'],
     		   deleteCondition: function(event) {
     		        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
     		   }
     	   });
	       me.modifyStartEvent(shape, options);
     	   me._map.addInteraction(me._modify);
        },

        /**
         * @method drawBufferedGeometry
         * -  adds buffered feature to the map
         *
         * @param {Geometry} geometry
         * @param {Number} buffer
         */
        drawBufferedGeometry : function(geometry, buffer) {
			 var me = this;
	    	 var bufferedFeature = me.getBufferedFeature(geometry, buffer, me._styles['draw'], 30);
	    	 me._drawLayers[me._bufferedFeatureLayerId].getSource().getFeaturesCollection().clear();
	    	 me._drawLayers[me._bufferedFeatureLayerId].getSource().getFeaturesCollection().push(bufferedFeature);
//	    	 _.each(me._drawLayers[me._layerId].getSource().getFeaturesCollection(), function (f) {
//	    		  console.log(f);
//	    		  var feature = me.getBufferedFeature(f.values_.geometry, buffer, me._style);
//		    	  me._drawLayers[me._bufferedFeatureLayerId].getSource().getFeaturesCollection().push(feature);
//	         });
		},
		 /**
         * @method modifyStartEvent
         * -  triggered upon feature modification start
         *
         * @param {String} shape
         * @param {Object} options
         */
        modifyStartEvent: function(shape, options) {
        	var me = this;
        	me._modify.on('modifystart', function() {
        		me._drawLayers[me._layerId].getSource().on('changefeature', function(evt) {
        			if (shape === "LineString") {
        				if(options.buffer > 0) {
            				me.drawBufferedGeometry(evt.feature.getGeometry(), options.buffer);
        				} else {
                			me.showText(evt.feature, me.getLineLength(evt.feature.getGeometry()), options);
        				}
        			} else if(shape === 'Polygon') {
            			me.showText(evt.feature, me.getPolygonArea(evt.feature.getGeometry()), options);
        			}
        			me.sendDrawingEvent(me._id, options);
				});
			 });
        },
        /**
         * @method showText
         * -  triggered upon feature modification start
         *
         * @param {ol.Feature} feature
         * @param {String} text, that will be displayed on feature
         * @param {Object} options
         */
    	showText: function(feature, text, options) {
			var me = this;
    		if(feature && options.showMeasure) {
    			var featureStyle = _.clone(me._styles['draw']);
    			feature.style_ = featureStyle;
	    		feature.style_.text_.text_ = text;
    		}
		},
		/**
         * @method getBufferedFeature
         * -  creates buffered feature using given geometry and buffer. If style is given, adds style to feature
         *
         * @param {Geometry} geometry
         * @param {Number} buffer
         * @param {ol.style.Style} style
         * @param {Number} side amount of polygon
         * @return {ol.Feature} feature
         */
		getBufferedFeature: function(geometry, buffer, style, sides) {
			var me = this;
			var reader = new jsts.io.WKTReader();
			var wktFormat = new ol.format.WKT();
			var wktFormatString = wktFormat.writeGeometry(geometry);
			var input = reader.read(wktFormatString);
			var bufferGeometry = input.buffer(buffer, sides);
			var parser = new jsts.io.olParser();
			bufferGeometry.CLASS_NAME = "jsts.geom.Polygon";
			bufferGeometry = parser.write(bufferGeometry);
			var feature = new ol.Feature({
				geometry: bufferGeometry
			});
			feature.setStyle(style);
			feature.buffer = buffer;
			return feature;
		},
		/**
         * @method removeInteractions
         * -  removes draw and modify controls, sets _shape and _buffer to null
         */
		removeInteractions : function() {
        	var me = this;
        	if(me._modify) {
        		me._map.removeInteraction(me._modify);
        	}
        	if(me._draw) {
        		me._map.removeInteraction(me._draw);
        	}
        	me._shape = null;
        	me._buffer= null;
        	me._id = null;
        	me._sketch = null;
		},
		/**
         * @method reportDrawingEvents
         * -  reports draw and modify control's events
         */
		reportDrawingEvents : function() {
			var me = this;

			if(me._draw) {
				me._draw.on('drawstart', function() {
					console.log("drawstart");
				});
				me._draw.on('drawend', function() {
					console.log("drawend");
				});
				me._draw.on('change:active', function() {
					console.log("drawchange");
				});
			}
			if(me._modify) {
				me._modify.on('modifystart', function() {
					console.log("modifystart");
				});
				me._modify.on('change', function() {
					console.log("modifychange");
				});

				me._modify.on('modifyend', function() {
					console.log("modifyend");
				});
			}
		},
		/**
         * @method getPolygonArea
         * -  calculates area of given geometry
         *
         * @param {ol.geom.Geometry} geometry
         * @return {String} area: measure result icluding 'km2'/'ha' text
         */
		getPolygonArea: function(geometry) {
			var area = 0;
			if(geometry && geometry.getType()==='Polygon') {
				area = geometry.getArea();
				if(area < 10000) {
					area = area.toFixed(0) + " m2";
				} else if(area > 1000000) {
					area = (area/1000000).toFixed(2) + " km2";
				} else {
					area = (area/10000).toFixed(2) + " ha";
				}
			}
			if(area) {
				area = area.replace(".", ",");
				this._area = area;
			}
			return area;
		},
		/**
         * @method getLineLength
         * -  calculates length of given geometry
         *
         * @param {ol.geom.Geometry} geometry
         * @return {String} length: measure result icluding 'm'/'km' text
         */
		getLineLength: function(geometry) {
			var length = 0;
			if(geometry && geometry.getType()==='LineString') {
				length = geometry.getLength();
				if(length < 1000) {
					length = length.toFixed(0) + " m";
				} else {
					length = (length/1000).toFixed(3) + " km";
				}
			}
			if(length) {
				length = length.replace(".", ",");
				this._length = length;
			}
			return length;
		},
		/**
         * @method getLineLength
         * -  gets features from layer
         *
         * @param {String} layerId
         * @return {Array} features
         */
		getFeatures: function (layerId) {
			var me = this,
				features = [];
				var featuresFromLayer = me._drawLayers[layerId].getSource().getFeatures();
				_.each(featuresFromLayer, function (f) {
					features.push(f);
				});
				if(me._sketch && layerId === 'DrawLayer') {
					features.push(me._sketch);
				}
			return features;
		},
	    /**
         * @method getFeaturesAsGeoJSON
         * - converts features to GeoJson
         *
         * @param {Array} features
         * @return {String} geojson
         */
		getFeaturesAsGeoJSON : function(features) {
			var me = this;
			var geoJsonFormat = new ol.format.GeoJSON();
			var geoJsonObject =  {
                    type: 'FeatureCollection',
                    features: []
                };
			_.each(features, function (f) {
				var buffer;
				if(f.buffer) {
					buffer = f.buffer;
				}
				var length = me.getLineLength(f.getGeometry());
				var area = me.getPolygonArea(f.getGeometry());
				var jsonObject = geoJsonFormat.writeFeatureObject(f);
				jsonObject.properties = {};
				if(buffer) {
					jsonObject.properties.buffer = buffer;
				}
				if(length) {
					jsonObject.properties.length = length;
				}
				if(area) {
					jsonObject.properties.area = area;
				}
				geoJsonObject.features.push(jsonObject);
			});
			//console.log(JSON.stringify(geoJsonObject));
			return JSON.stringify(geoJsonObject);
		},
		 /**
         * @method getCircleAsPolygonFeature
         * - converts circle geometry to polygon geometry
         *
         * @param {Array} features
         * @return {Array} polygonfeatures
         */
		getCircleAsPolygonFeature: function(features) {
			var me = this;
			var polygonFeatures = [];
			_.each(features, function (f) {
				var pointFeature = new ol.geom.Point(f.getGeometry().getCenter());
				var bufferedFeature = me.getBufferedFeature(pointFeature, f.getGeometry().getRadius(), me._styles['draw'], 100);
					polygonFeatures.push(bufferedFeature);
				});
			return polygonFeatures;
		},
		 /**
         * @method getCircleAsPointFeature
         * - converts circle geometry to point geometry
         *
         * @param {Array} features
         * @return {Array} pointFeatures
         */
		getCircleAsPointFeature: function(features) {
			var me = this;
			var pointFeatures = [];
			_.each(features, function (f) {
				var feature = new ol.Feature({
					  geometry:  new ol.geom.Point(f.getGeometry().getCenter())
					});
				me.addBufferPropertyToFeatures([feature], f.getGeometry().getRadius());
				pointFeatures.push(feature);
			});
			return pointFeatures;
		},
		 /**
         * @method addBufferPropertyToFeatures
         * - adds buffer property to given features. This is needed for converting buffered Point and buffered LineString to geoJson
         *
         * @param {Array} features
         * @return {Number} buffer
         */
		addBufferPropertyToFeatures: function(features, buffer) {
			if(buffer) {
				_.each(features, function (f) {
					f.buffer = buffer;
				});
			}
		}
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
