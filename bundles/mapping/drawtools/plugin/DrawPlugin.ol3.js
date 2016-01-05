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

        this._gfiReqBuilder = Oskari.getSandbox().getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');

        this._layerId = 'DrawLayer';
        this._bufferedFeatureLayerId = 'BufferedFeatureLayer';

        this._defaultStyle = {
            fill : {
                color : 'rgba(255,0,255,0.2)'
            },
            stroke : {
                color : 'rgba(0,0,0,1)',
                width : 2
            },
            image : {
                radius: 4,
                fill : {
                    color : 'rgba(0,0,0,1)'
                }
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
        };
        this._styleTypes = ['draw', 'modify', 'intersect'];
        this._styles = {};
        this._drawLayers = {};
        this._idd = 0;
        this._tooltipClassForMeasure = 'tooltip-measure';
        this._mode = "";
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
            styles = styles || {};
            //setting defaultStyles
            _.each(me._styleTypes, function (type) {
                // overriding default style configured style
                var styleForType = styles[type] || {};
                var styleDef = jQuery.extend({}, me._defaultStyle, styleForType);
                me._styles[type] = me.getMapModule().getStyle(styleDef);
            });
        },
        /**
         * @method draw
         * - activates draw and modify controls
         *
         * @param {String} id, that identifies the request
         * @param {String} shape: drawing shape: Point/Circle/Polygon/Box/Square/LineString
         * @param {Object} options include:
         *                  {Number} buffer: buffer for drawing buffered line and dot. If not given or 0, will disable dragging.
         *                  {Object} style: styles for draw, modify and intersect mode. If options don't include custom style, sets default styles
         *                  {Boolean} allowMiltipleDrawing: true - multiple selection is allowed, false - selection will be removed before drawing a new selection. Default is false.
         *                  {Boolean} showMeasureOnMap: true - if measure result should be displayed on map near drawing feature. Default is false.
         *                  {Boolean} drawControl: true - will activate draw control, false - will not activate. Default is true.
         *                  {Boolean} modifyControl: true - will activate modify control, false, will not activate. Default is true.
         *                  {String} geojson: geojson for editing. If not given, will activate draw/modify control according to given shape.
         *                  {Boolean} noticeSelfIntersection: true - user will see warning text if polygon has self-intersection. Features will be not sended to event before polygon is valid. By default intersections are not allowed.
         *                  {Number} maxSize: max size = perimeter of feature's boundbox. User can't continue drawing after feature's max bbox is achieved. Default is null.
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

            //disable gfi
            if (me._gfiReqBuilder) {
                me._sandbox.request(me, me._gfiReqBuilder(false));
            }
            me.removeInteractions();
            me._shape = shape;
            me._buffer = options.buffer;
            me._id = id;
            me._options = options;

            me.setDefaultStyle(options.style);

            me._loc = Oskari.getLocalization('DrawTools', Oskari.getLang() || Oskari.getDefaultLanguage());

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
//          me.reportDrawingEvents();
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
            me._map.un('pointermove', me.pointerMoveHandler, me);
           //enable gfi
            if (me._gfiReqBuilder) {
                me._sandbox.request(me, me._gfiReqBuilder(true));
            }
        },
        /**
         * @method sendDrawingEvent
         * -  sends DrawingEvent
         *
         * @param {String} id
         * @param {object} options include:
         *                  {Boolean} clearCurrent: true - all selection will be removed from the map after stopping plugin, false - will keep selection on the map. Default is false.
         *                  {Boolean} isFinished: true - if drawing is completed. Default is false.
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
//            console.log(JSON.stringify(geojson));
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
            jQuery('.' + me._tooltipClassForMeasure).remove();
        },
         /**
         * @method addDrawInteraction
         * -  activates draw control
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
                    me.checkIntersection(geometry, options);
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

//            me.overwritingFinishDrawing();

            me._draw.validGeometry = true;
            me._map.addInteraction(me._draw);

            me.drawStartEvent(options);
            me.drawingEndEvent(options);

            if(options.showMeasureOnMap) {
                me._map.on('pointermove', me.pointerMoveHandler, me);
            }
        },
         /**
         * @method drawStartEvent
         * -  handles drawstart event
         * @param {Object} options
         */
        drawStartEvent: function(options) {
            var me = this;
            me._draw.on('drawstart', function(evt) {
                me._mode = "draw";
                var id = 'drawFeature' + me._idd++;
                evt.feature.setId(id);
                me._sketch = evt.feature;
                if(options.allowMultipleDrawing === 'single') {
                    me.clearDrawing();
                }
                var tooltipClass = me._tooltipClassForMeasure + ' ' + me._shape;
                me.createDrawingTooltip(id, tooltipClass);
            });
        },
         /**
         * @method drawingEndEvent
         * -  handles drawend event
         * @param {Object} options
         */
        drawingEndEvent: function(options) {
            var me = this;
            me._draw.on('drawend', function(evt) {
                me._mode = "";
                if(options.allowMultipleDrawing === false) {
                    me.stopDrawing(me._id, false);
                }
                evt.feature.setStyle(me._styles['modify']);
            });
        },
         /**
         * @method checkIntersection
         * -  checks if geometry intersects itself
         * @param {ol.geom.ol.geom.Geometry} geometry
         * @param {Object} options
         */
        checkIntersection: function (geometry, options) {
            var me = this;
            var coord = geometry.getCoordinates()[0];
            var lines = me.getJstsLines(coord);

            if (me._mode === 'modify') {
//                me._drawLayers[me._layerId].getSource().on('changefeature', function(evt) {
            }

            if(options.noticeSelfIntersection !== false && me._sketch) {
                var invalid = me.isValidJstsGeometry(lines);
                if(invalid) {
                    me._sketch.setStyle(me._styles['intersect']);
                    me._draw.validGeometry = false;
                } else {
                    if(me._sketch) {
                        if(me._mode === 'draw') {
                            me._sketch.setStyle(me._styles['draw']);
                        } else {
                            me._sketch.setStyle(me._styles['modify']);
                        }
                        me._draw.validGeometry = true;
                    }
                }
            }
        },
        /**
         * Overwriting OpenLayers method
         * Stop drawing and add the sketch feature to the target layer. Drawing will be stopped only if the geometry is valid
         * The {@link ol.interaction.DrawEventType.DRAWEND} event is dispatched before
         * inserting the feature.
         * @api
         */
        overwritingFinishDrawing: function() {
            this._draw.finishDrawing = function() {
                  if(this.validGeometry) {
                      var sketchFeature = this.abortDrawing_();
                      goog.asserts.assert(!goog.isNull(sketchFeature),
                          'sketchFeature should not be null');
                      var coordinates = this.sketchCoords_;
                      var geometry = sketchFeature.getGeometry();
                      goog.asserts.assertInstanceof(geometry, ol.geom.SimpleGeometry,
                          'geometry must be an ol.geom.SimpleGeometry');
                      if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
                        // remove the redundant last point
                        coordinates.pop();
                        this.geometryFunction_(coordinates, geometry);
                      } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
                        // When we finish drawing a polygon on the last point,
                        // the last coordinate is duplicated as for LineString
                        // we force the replacement by the first point
                        coordinates[0].pop();
                        coordinates[0].push(coordinates[0][0]);
                        this.geometryFunction_(coordinates, geometry);
                      }

                      // cast multi-part geometries
                      if (this.type_ === ol.geom.GeometryType.MULTI_POINT) {
                        sketchFeature.setGeometry(new ol.geom.MultiPoint([coordinates]));
                      } else if (this.type_ === ol.geom.GeometryType.MULTI_LINE_STRING) {
                        sketchFeature.setGeometry(new ol.geom.MultiLineString([coordinates]));
                      } else if (this.type_ === ol.geom.GeometryType.MULTI_POLYGON) {
                        sketchFeature.setGeometry(new ol.geom.MultiPolygon([coordinates]));
                      }

                      // First dispatch event to allow full set up of feature
                      this.dispatchEvent(new ol.interaction.DrawEvent(
                          ol.interaction.DrawEventType.DRAWEND, sketchFeature));

                      // Then insert feature
                      if (!goog.isNull(this.features_)) {
                        this.features_.push(sketchFeature);
                      }
                      if (!goog.isNull(this.source_)) {
                        this.source_.addFeature(sketchFeature);
                      }
                  }
            };
        },
        /**
         * @method pointerMoveHandler - pointer moving handler for displaying
         * - displays measurement result on feature
         * @param {ol.MapBrowserEvent} evt
         */
        pointerMoveHandler: function(evt) {
            var me = this;
            var tooltipCoord = evt.coordinate;
            if (me._sketch) {
                var output;
                var geom = (me._sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                  output = me.getPolygonArea(geom);
                  tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                  output = me.getLineLength(geom);
                  tooltipCoord = geom.getLastCoordinate();
                }
                if(!me._draw.validGeometry) {
                    output = me._loc.intersectionNotAllowed;
                    me._area = output;
                }
                if(me._options.showMeasureOnMap) {
                    me._map.getOverlays().forEach(function (o) {
                      if(o.id === me._sketch.getId()) {
                          var ii = jQuery('div.' + me._tooltipClassForMeasure + "." + me._sketch.getId());
                          ii.html(output);
                          o.setPosition(tooltipCoord);
                      }
                    });
                }
             }
        },
         /**
         * @method addModifyInteraction
         * -  activates modify control
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
           me._map.on('pointermove', me.pointerMoveHandler, me);
           me._map.addInteraction(me._modify);
        },
        /**
         * @method isValidJstsGeometry
         * -  checks if lines cross
         * @param {Array} lines
         * @return {boolean} crosses
         */
        isValidJstsGeometry : function(lines) {
            var crosses = false;
            lines.forEach(function(l) {
                lines.forEach(function(li) {
                    if (li !== l) {
                        if (li.crosses(l)===true) {
                            crosses = true;
                        }
                    }
                });
            });
            return crosses;
        },
         /**
         * @method getJstsLines
         * -  checks if lines cross
         * @param {Array} coord
         * @return {Array} lines
         */
        getJstsLines: function(coord) {
            var reader = new jsts.io.WKTReader();
            var wktFormat = new ol.format.WKT();
            var lines = [], i = 0, ok;
            while(i!==coord.length-1){
                if(coord[i+1]){
                    var line = new ol.geom.LineString([coord[i], coord[i+1]]);
                    var jstsLine = reader.read(wktFormat.writeGeometry(line));
                    lines.push(jstsLine);
                        i++;
                }
            }
            lines.push(reader.read(wktFormat.writeGeometry(new ol.geom.LineString([coord[coord.length-1], coord[0]]))));
            return lines;
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
//           _.each(me._drawLayers[me._layerId].getSource().getFeaturesCollection(), function (f) {
//                console.log(f);
//                var feature = me.getBufferedFeature(f.values_.geometry, buffer, me._style);
//                me._drawLayers[me._bufferedFeatureLayerId].getSource().getFeaturesCollection().push(feature);
//           });
        },
         /**
         * @method modifyStartEvent
         * -  triggered upon feature modification start
         * @param {String} shape
         * @param {Object} options
         */
        modifyStartEvent: function(shape, options) {
            var me = this;

            //if modifyend didn't get called for some reason, nullify the old listeners to be on the safe side
            if (me.modifyFeatureChangeEventCallback) {
                me.toggleDrawLayerChangeFeatureEventHandler(false);
                me.modifyFeatureChangeEventCallback = null;
            }
            me._modify.on('modifystart', function() {
                me._mode = 'modify';

                me.modifyFeatureChangeEventCallback = function(evt) {
                    //turn off changehandler in case something we touch here triggers a change event -> avoid eternal loop
                    me.toggleDrawLayerChangeFeatureEventHandler(false);
                    me._sketch = evt.feature;
                    if (shape === "LineString") {
                        if(options.buffer > 0) {
                            me.drawBufferedGeometry(evt.feature.getGeometry(), options.buffer);
                        }
                    } else if (shape === "Polygon") {
                        me.checkIntersection(me._sketch.getGeometry(), options);
                    }
                    me.sendDrawingEvent(me._id, options);
                    //probably safe to start listening again
                    me.toggleDrawLayerChangeFeatureEventHandler(true);
                };
                me.toggleDrawLayerChangeFeatureEventHandler(true);

            });
            me._modify.on('modifyend', function() {
                me._mode = '';

                me.toggleDrawLayerChangeFeatureEventHandler(false);
                me.modifyFeatureChangeEventCallback = null;
            });
        },
        toggleDrawLayerChangeFeatureEventHandler: function(enable) {
            var me = this;
            if (enable) {
                me._drawLayers[me._layerId].getSource().on('changefeature', me.modifyFeatureChangeEventCallback, me);
            } else {
                me._drawLayers[me._layerId].getSource().un('changefeature', me.modifyFeatureChangeEventCallback, me);
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
         * -  removes draw and modify controls, sets _shape, _buffer, _id and _sketch to null
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
                var buffer, length, area;
                if(f.buffer) {
                    buffer = f.buffer;
                }
                length = me.getLineLength(f.getGeometry());
                if(me._draw.validGeometry) {
                    area = me.getPolygonArea(f.getGeometry());
                } else {
                    area = me._loc.intersectionNotAllowed;
                }
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

            return geoJsonObject;
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
         * @param {Number} buffer
         */
        addBufferPropertyToFeatures: function(features, buffer) {
            if(buffer) {
                _.each(features, function (f) {
                    f.buffer = buffer;
                });
            }
        },
        /**@method hasNestedObj
        *  - checks, if nested key exists
        * @params {}  object
        * @params String object path
        * @public
        *
        * @returns {Boolean}: true if nested key exists
        */
       hasNestedObj: function(obj, sobj) {
          var tmpObj = obj,
              cnt = 0,
              splits = sobj.split('.');

          for (i=0; tmpObj && i < splits.length; i++) {
              if (splits[i] in tmpObj) {
                  tmpObj = tmpObj[splits[i]];
                  cnt++;
              }
          }
          return cnt === splits.length;
       },
    /**@method createDrawingTooltip
     * - creates a new tooltip on drawing
     */
    createDrawingTooltip : function(id, tooltipClass) {
        var me = this;
        var tooltipElement = document.createElement('div');
        tooltipElement.className =  tooltipClass + ' ' + id;
        var tooltip = new ol.Overlay({
            element : tooltipElement,
            offset : [ 0, -5 ],
            positioning : 'bottom-center',
            id: id
        });
        tooltip.id = id;
        me._map.addOverlay(tooltip);
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