/**
 * @class Oskari.mapping.drawtools.plugin.DrawPlugin
 *
 *  Map engine specific implementation for draw tools
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
	           	    })
      			});
      		});
        	//overwriting default styles if given
        	if(styles) {
        		_.each(styles, function (style, styleType) {

        			if(style.fill.color) {
            			me._styles[styleType].getFill().setColor(style.fill.color);
        			}
		        	if(style.stroke.color) {
			    		me._styles[styleType].getStroke().setColor(style.stroke.color);
		        	}
		        	if(style.stroke.width) {
			    		me._styles[styleType].getStroke().setWidth(style.stroke.width);
		        	}
//		        	if(style.stroke.lineDash) {
//			    		me._styles[styleType].getStroke().setLineDash(style.stroke.lineDash);
//		        	}
		        	if(style.image.radius) {
			    		me._styles[styleType].getImage().radius = style.image.radius;
		        	}
		        	if(style.image.fill.color) {
			    		me._styles[styleType].getImage().getFill().setColor(style.image.fill.color);
		        	}
        		});
        	}
        },
        /**
         * @method draw
         * - activates draw and modify controls
         *
         * @param {String} id
         * @param {String} shape: drawing mode: Point/Circle/Polygon/Box/Square/LineString
         * @param {Object} options include:
         * 							{String} geojson: geojson for editing. If not given, will activate draw/modify control according to given shape
         * 							{Number} buffer: buffer for drawing buffered line an dot
         * 							{Object} style: styles for draw, modify and intersect mode. If options don't include custom style, sets default styles
         * 							{Boolean} allowMiltipleDrawing: false - if selections must be removed before drawing new selection, true - if user can draw many selection
         * 							{Boolean} showMeasure: true - if measure result should be displayed on selection
         * 							{Boolean} drawControl: true - activates draw  control
         * 							{Boolean} modifyControl: true - activates modify control
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
         * @param {String} geojson
         */
        drawShape : function(shape, options) {
        	var me = this;

         	if(options.geojson) {
         		var jsonFormat = new ol.format.GeoJSON();
            	var featuresFromJson = jsonFormat.readFeatures(options.geojson);
            	me._drawLayers[me._layerId].getSource().addFeatures(featuresFromJson);
         	}
        	if(options.drawControl !== false) {
        		me.addDrawInteraction(me._layerId, shape, options.buffer, options.allowMultipleDrawing);
        	}
        	if(options.modifyControl !== false) {
        		me.addModifyInteraction(me._layerId, shape, options.buffer);
        	}

//        	me.reportDrawingEvents();
        },
        /**
         * @method stopDrawing
         * -  sends DrawingEvent and remove draw and modify controls
         *
         * @param {String} id
         * @param {boolean} clearCurrent: if true, all selection will be removed from the map
         */
        stopDrawing : function(id, clearCurrent) {
        	var me = this;

            // TODO: get geojson for matching id
            var geojson = me.getFeaturesAsGeoJSON(me._layerId);
            var bufferedGeoJson = me.getFeaturesAsGeoJSON(me._bufferedFeatureLayerId);
            var data = {
                lenght : '',
                area : '',
                bufferedGeoJson: bufferedGeoJson,
                buffer: me._buffer,
                shape: me._shape
            };
            if(clearCurrent) {
                // TODO: clear the drawing matching the id from map
            	me.clearDrawing();
            }
            var event = me._sandbox.getEventBuilder('DrawingEvent')(id, geojson, data);
            me._sandbox.notifyAll(event);
            // TODO: deactivate draw control
            me.removeInteractions();
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
        	//TODO: pitääkö lisätä käyttäen requestia??
          	me._map.addLayer(vector);
          	me._drawLayers[layerId] = vector;
//          	console.log("layer ", id, " added");
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
         */
        addDrawInteraction : function(layerId, shape, buffer, allowMultipleDrawing) {
        	var me = this;
        	var geometryFunction, maxPoints, geometryType;
        	geometryType = shape;

    	    if (shape === 'LineString') {
    	    	 geometryFunction = function (coordinates, geometry) {
	    	    	  if (!geometry) {
	    	    		  geometry = new ol.geom.LineString(null);
	    	          }
	    	    	  if (goog.isDef(geometry)) {
	    	    		  geometry.setCoordinates(coordinates);
	    	    	  } else {
	    	    		  geometry = new ol.geom.LineString(coordinates);
	    	    	  }
	    	    	  if (buffer > 0) {
	    	    		  me.drawBufferedGeometry(geometry, buffer);
	    	    	  }
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
    	           return geometry;
    	         }
    	    } else if (shape === 'Square') {
    	        geometryType = 'Circle';
    	        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    	    } else if (shape === 'Circle') {
    	    	 if (buffer > 0) {
   	    	    	geometryType = 'Point';
    	    		geometryFunction = function(coordinates, geometry) {
    	    			 if (!geometry) {
    	    				 geometry = new ol.geom.Circle(coordinates, buffer);
    	    			 }
    	    			 return geometry;
    	    		 }
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

			me._draw.on('drawstart', function() {
//				me._draw.overlay_.style_ = me._modifyStyle;
				if(allowMultipleDrawing !== true) {
					me.clearDrawing();
				}
			});
		},
		 /**
         * @method addModifyInteraction
         * -  activates modify control
         *
         * @param {String} layerId
         * @param {String} shape
         */
        addModifyInteraction : function(layerId, shape, buffer) {
        	var me = this;
        	me._modify = new ol.interaction.Modify({
     		   features: me._drawLayers[layerId].getSource().getFeaturesCollection(),
     		   style: me._styles['modify'],
     		   deleteCondition: function(event) {
     		        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
     		   }
     	   });
	       if (buffer > 0 && shape === "LineString") {
	           me._modify.on('modifystart', function() {
					me._drawLayers[me._layerId].getSource().on('changefeature', function(evt) {
						me.drawBufferedGeometry(evt.feature.getGeometry(), buffer);
					});
			   });
	       }
     	   me._map.addInteraction(me._modify);

     	   me._modify.on('modifystart', function() {
//     		  me._draw.overlay_.style_ = me._modifyStyle;
		   });
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
	    	 var bufferedFeature = me.getBufferedFeature(geometry, buffer, me._styles['draw']);
	    	 me._drawLayers[me._bufferedFeatureLayerId].getSource().getFeaturesCollection().clear();
	    	 me._drawLayers[me._bufferedFeatureLayerId].getSource().getFeaturesCollection().push(bufferedFeature);
//	    	 _.each(me._drawLayers[me._layerId].getSource().getFeaturesCollection(), function (f) {
//	    		  console.log(f);
//	    		  var feature = me.getBufferedFeature(f.values_.geometry, buffer, me._style);
//		    	  me._drawLayers[me._bufferedFeatureLayerId].getSource().getFeaturesCollection().push(feature);
//	         });
		},
		/**
         * @method getBufferedFeature
         * -  creates buffered feature using given geometry and buffer. If style is given, adds style to feature
         *
         * @param {Geometry} geometry
         * @param {Number} buffer
         * @param {ol.style.Style} style
         *
         * @return {ol.Feature} feature
         */
		getBufferedFeature: function(geometry, buffer, style) {
			var me = this;
			var reader = new jsts.io.WKTReader();
			var wktFormat = new ol.format.WKT();
			var wktFormatString = wktFormat.writeGeometry(geometry);
			var input = reader.read(wktFormatString);
			var bufferGeometry = input.buffer(buffer, 30);
			var parser = new jsts.io.olParser();
			bufferGeometry.CLASS_NAME = "jsts.geom.Polygon";
			bufferGeometry = parser.write(bufferGeometry);
			var feature = new ol.Feature({
				geometry: bufferGeometry
			});
			feature.setStyle(style);
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
			if(geometry) {
				area = geometry.getArea();
				if(area < 10000) {
					area = area.toFixed(0) + " m2";
				} else if(area > 1000000) {
					area = (area/1000000).toFixed(2) + " km2";
				} else {
					area = (area/10000).toFixed(2) + " ha";
				}
			}
			area = area.replace(".", ",");
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
			if(geometry){
				length = geometry.getLength();
				if(length < 1000) {
					length = length.toFixed(0) + " m \n\n\n";
				} else {
					length = (length/1000).toFixed(3) + " km \n\n\n";
				}
			}
			length = length.replace(".", ",");
			return length;
		},
		/**
         * @method getLineLength
         * -  gets features from layer
         *
         * @param {String} layerId
         * @return {Collection} features
         */
		getFeatures: function (layerId) {
			var me = this;
			var features = me._drawLayers[layerId].getSource().getFeatures();
			return features;
	    },
	    /**
         * @method getFeaturesAsGeoJSON
         * - converts features to GeoJson
         *
         * @param {String} layerId
         * @return {String} geojson
         */
		getFeaturesAsGeoJSON : function(layerId) {
			var me = this;
			var geoJsonFormat = new ol.format.GeoJSON();
			var stringJson = geoJsonFormat.writeFeatures(me.getFeatures(layerId));
//			console.log(stringJson);
			return stringJson;
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
