/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 *
 * Provides map functionality/Wraps actual map implementation for Openlayers 2.
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.MapModule',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} id
     *      Unigue ID for this map
     * @param {Array} map options, example data:
     *  {
     *      resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
     *      units : "m",
     *      maxExtent : {
     *          left : 0,
     *          bottom : 0,
     *          right : 10000000,
     *          top : 10000000
     *      },
     *      srsName : "EPSG:3067",
     *      openLayers : {
     *           imageReloadAttemps: 5,
     *           onImageLoadErrorColor: 'transparent'
     *      }
     *  }
     */

    function (id, imageUrl, options, mapDivId) {
    }, {

        /**
         * @method _initImpl
         * Implements Module protocol init method. Creates the OpenLayers Map.
         * Called at the end of AbstractMapModule init()
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * @return {OpenLayers.Map}
         */
        _initImpl: function (sandbox, options, map) {
            /*Added to handle pink tiles */
            var olOpts = options.openLayers || {};
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = olOpts.imageReloadAttemps || 5;
            OpenLayers.Util.onImageLoadErrorColor = olOpts.onImageLoadErrorColor || 'transparent';

            // This is something that OL2 needs to work, without it Ol2 doesn't startup correctly
            // can be ignored after it's done
            var base = new OpenLayers.Layer('BaseLayer', {
                layerId: 0,
                isBaseLayer: true,
                displayInLayerSwitcher: false
            });
            this.getMap().addLayer(base);

            // TODO remove this whenever we're ready to add the containers when needed
            this._addMapControlPluginContainers();
            return map;
        },

        /**
         * @method createMap
         * @private
         * Creates Openlayers 2 map implementation
         * Called by init
         * @return {OpenLayers.Map}
         */
        createMap: function () {
            var me = this;
            var sandbox = this.getSandbox();
            // this is done BEFORE enhancement writes the values to map domain
            // object... so we will move the map to correct location
            // by making a MapMoveRequest in application startup
            var lonlat = new OpenLayers.LonLat(0, 0);
            // Defaults set in AbstarctMapModule
            var maxExt = this.getMaxExtent();
            var extent = new OpenLayers.Bounds(maxExt.left, maxExt.bottom, maxExt.right, maxExt.top);
            var map = new OpenLayers.Map({
                controls: [],
                units: this._options.units, //'m',
                maxExtent: extent,
                resolutions: this.getResolutionArray(),
                projection: this.getProjection(),
                isBaseLayer: true,
                center: lonlat,
                // https://github.com/openlayers/openlayers/blob/master/notes/2.13.md#map-property-fallthrough-defaults-to-false
                // fallThrough: true is needed for statsgrid drag resizing
                fallThrough: true,
                theme: null,
                zoom: 0,
                zoomMethod: null
            });

            me._setupMapEvents(map);

            return map;
        },

        /**
         * Add map click handler
         * @method @private _setupMapEvents
         */
        _setupMapEvents: function(map){
            var me = this;
            //Set up a click handler
            OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
                defaultHandlerOptions: {
                    'double': true,
                    'stopDouble': true
                },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    );
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': function(evt){
                                me.__sendMapClickEvent(evt);
                            }
                        }, this.handlerOptions
                    );
                }
            });

            var click = new OpenLayers.Control.Click();
            map.addControl(click);
            click.activate();
        },
        _startImpl: function () {
            this.getMap().render(this.getMapElementId());
            return true;
        },


/* OL2 specific - check if this can be done in a common way 
------------------------------------------------------------------> */
        /**
         * Send map click event.
         * @method  @private __sendMapClickEvent
         * @param  {Object} evt event object
         */
        __sendMapClickEvent : function(evt) {
            var sandbox = this.getSandbox();
            /* may be this should dispatch to mapmodule */
            var lonlat = this.getMap().getLonLatFromViewPortPx(evt.xy);
            var evtBuilder = sandbox.getEventBuilder('MapClickedEvent');
            var event = evtBuilder(lonlat, evt.xy.x, evt.xy.y);
            sandbox.notifyAll(event);
        },
/*<------------- / OL2 specific ----------------------------------- */


/* Impl specific - found in ol2 AND ol3 modules
------------------------------------------------------------------> */

        getPixelFromCoordinate : function(lonlat) {
            lonlat = this.normalizeLonLat(lonlat);
            var px = this.getMap().getViewPortPxFromLonLat(new OpenLayers.LonLat(lonlat.lon, lonlat.lat));
            return {
                x : px.x,
                y : px.y
            };
        },

        getMapCenter: function () {
            var center = this.getMap().getCenter();
            return {
                lon : center.lon,
                lat : center.lat
            };
        },

        getMapZoom: function () {
            return this.getMap().getZoom();
        },
        
        getSize: function() {
            var size = this.getMap().getCurrentSize();
            return {
                width: size.w,
                height: size.h
            };
        },
        /**
         * @method zoomToExtent
         * Zooms the map to fit given bounds on the viewport
         * @param {OpenLayers.Bounds} bounds BoundingBox that should be visible on the viewport
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        zoomToExtent: function (bounds, suppressStart, suppressEnd) {
            this.getMap().zoomToExtent(bounds);
            this.updateDomain();
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },

        /**
         * @method centerMap
         * Moves the map to the given position and zoomlevel.
         * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
         * @param {Number} zoomLevel absolute zoomlevel to set the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        centerMap: function (lonlat, zoom, suppressEnd) {
            // TODO: we have isValidLonLat(); maybe use it here
            lonlat = this.normalizeLonLat(lonlat);
            if(zoom === null ||zoom === undefined) {
                zoom = this.getMapZoom();
            }
            this.getMap().setCenter(new OpenLayers.LonLat(lonlat.lon, lonlat.lat), zoom, false);
            this.updateDomain();
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },
        /**
         * Get maps current extent.
         * @method getCurrentExtent
         * @return {Object} current extent
         */
        getCurrentExtent: function(){
            var bbox = this.getMap().getExtent();
            return {
                left: bbox.left,
                bottom: bbox.bottom,
                right: bbox.right,
                top: bbox.top
            };
        },
        /**
         * @method panMapByPixels
         * Pans the map by given amount of pixels.
         * @param {Number} pX amount of pixels to pan on x axis
         * @param {Number} pY amount of pixels to pan on y axis
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} isDrag true if the user is dragging the map to a new location currently (optional)
         */
        panMapByPixels: function (pX, pY, suppressStart, suppressEnd, isDrag) {
            // usually programmatically for gfi centering
            this.getMap().pan(pX, pY, {
                dragging: (isDrag ? true : false),
                animate: false
            });

            this.updateDomain();
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },

        /**
         * @method transformCoordinates
         * Transforms coordinates from given projection to the maps projection.
         * @param {Object} pLonlat object with lon and lat keys
         * @param {String} srs projection for given lonlat params like "EPSG:4326"
         * @return {Object} transformed coordinates as object with lon and lat keys
         */
        transformCoordinates: function (pLonlat, srs) {
            if(!srs || this.getProjection() === srs) {
                return pLonlat;
            }
            var isProjectionDefined = Proj4js.defs[srs];
            if (!isProjectionDefined) {
                throw 'SrsName not supported! Provide Proj4js.def for ' + srs;
            }
            var tmp = new OpenLayers.LonLat(pLonlat.lon, pLonlat.lat);
            var transformed = tmp.transform(new OpenLayers.Projection(srs), this.getMap().getProjectionObject());

            return {
                lon : transformed.lon,
                lat : transformed.lat
            };
        },

        /**
         * @method orderLayersByZIndex
         * Orders layers by Z-indexes.
         */
        orderLayersByZIndex: function() {
            this.getMap().layers.sort(function(a, b){
                return a.getZIndex()-b.getZIndex();
            });
        },
/* --------- /Impl specific --------------------------------------> */


/* Impl specific - PRIVATE
------------------------------------------------------------------> */
        _calculateScalesImpl: function (resolutions) {
            for (var i = 0; i < resolutions.length; i += 1) {
                var calculatedScale = OpenLayers.Util.getScaleFromResolution(
                    resolutions[i],
                    // always calculate to meters
                    'm'
                );
                calculatedScale = calculatedScale * 10000;
                calculatedScale = Math.round(calculatedScale);
                calculatedScale = calculatedScale / 10000;
                this._mapScales.push(calculatedScale);
            }
        },
        _updateSizeImpl : function() {
            this.getMap().updateSize();
        },
        _setZoomLevelImpl : function(newZoomLevel) {
            this.getMap().zoomTo(newZoomLevel);
        },
/* --------- /Impl specific - PRIVATE ----------------------------> */


/* Impl specific - found in ol2 AND ol3 modules BUT parameters and/or return value differ!!
------------------------------------------------------------------> */

        /**
         * @param {OpenLayers.Layer} layer ol2 specific!
         */
        addLayer: function(layerImpl) {
            if(!layerImpl) {
                return;
            }
            this.getMap().addLayer(layerImpl);
        },
        /**
         * @param {OpenLayers.Layer} layer ol2 specific!
         */
        removeLayer : function(layerImpl) {
            if(!layerImpl) {
                return;
            }
            this.getMap().removeLayer(layerImpl);
            if(typeof layerImpl.destroy === 'function') {
                layerImpl.destroy();
            }
        },
        /**
         * Brings map layer to top
         * @method bringToTop
         *
         * @param {OpenLayers.Layer} layer The new topmost layer
         * @param {Integer} buffer Add this buffer to z index. If it's undefined, using 1.
         */
        bringToTop: function(layer, buffer) {
            if (!layer || !layer.getZIndex) {
                return;
            }
            var layerZIndex = layer.getZIndex();
            var zIndex = Math.max(this.getMap().Z_INDEX_BASE.Feature,layerZIndex);
            buffer = buffer || 1;

            layer.setZIndex(zIndex + buffer);
            this.orderLayersByZIndex();
        },
        /**
         * @return {OpenLayers.Layer} layer ol2 specific!
         */
        getLayerIndex: function(layerImpl) {
            return this.getMap().getLayerIndex(layerImpl);
        },
        /**
         * @param {OpenLayers.Layer} layer ol2 specific!
         */
        setLayerIndex: function (layerImpl, index) {
            this.getMap().setLayerIndex(layerImpl, index);
        },

        /**
         * @param {OpenLayers.Control} control ol2 specific!
         */
        _addMapControlImpl: function (ctl) {
            this.getMap().addControl(ctl);
        },

        /**
         * @param {OpenLayers.Control} control ol2 specific!
         */
        _removeMapControlImpl: function (ctl) {
            this.getMap().removeControl(ctl);
        },
        /**
         * Creates style based on JSON
         * @return {OpenLayers.Style} style ol2 specific!
         */
        getStyle : function(styleDef) {
            styleDef = styleDef || {};
            //create a blank style with default values 
            var olStyle = new OpenLayers.Style();
            if(Oskari.util.keyExists(styleDef, 'fill.color')) {
                olStyle.fill = true;
                olStyle.fillColor = styleDef.fill.color;
            }

            if(styleDef.stroke) {
                var stroke = {};
                if(styleDef.stroke.color) {
                    olStyle.strokeColor = styleDef.stroke.color;
                }
                if(styleDef.stroke.width) {
                    olStyle.strokeWidth = styleDef.stroke.width;
                }
            }

            if (styleDef.image) {
                if(styleDef.image.radius) {
                    olStyle.pointRadius = styleDef.image.radius;
                }
                //currently only supporting circle
                olStyle.graphicName = "circle";
            }
            if(styleDef.text) {
                /*
                TODO: figure out ol2 equivalent to this... "normal" font size * scale?
                if(styleDef.text.scale) {
                    olStyle.scale = styleDef.text.scale;
                }
                */
                if(Oskari.util.keyExists(styleDef.text, 'fill.color')) {
                    olStyle.fontColor = styleDef.text.fill.color;
                }
                if(styleDef.text.stroke) {
                    if(styleDef.text.stroke.color) {
                        olStyle.labelOutlineColor = styleDef.text.stroke.color;
                    }
                    if(styleDef.text.stroke.width) {
                        olStyle.labelOutlineWidth = styleDef.text.stroke.width;
                    }
                }
            }

            return olStyle;
        }
/* --------- /Impl specific - PARAM DIFFERENCES  ----------------> */

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapModule']
    });
