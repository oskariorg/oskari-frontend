/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 *
 * Provides map functionality/Wraps actual map implementation (Openlayers).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3067'.
 * There are plans to make these more configurable in the future.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapmodule
 */
Oskari.clazz.define('Oskari.ol3.ui.module.common.MapModule',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String} id
 * 		Unigue ID for this map
 * @param {String} imageUrl
 *      base url for marker etc images
 * @param {Array} map options, example data:
 *  {
 *		resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
 *		maxExtent : {
 *			left : 0,
 *			bottom : 10000000,
 *			right : 10000000,
 *			top : 0
 *		},
 srsName : "EPSG:3067"
 *	}
 */
function(id, imageUrl, options) {

}, {
  
  
    /**
     * @method createMap
     * @private
     * Creates the OpenLayers.Map object
     * @return {OpenLayers.Map}
     */
    _createMap : function() {

        var sandbox = this._sandbox;
        // this is done BEFORE enhancement writes the values to map domain
        // object... so we will move the map to correct location
        // by making a MapMoveRequest in application startup

        var maxExtent = this._maxExtent;
        var extent = this._extent;

        var projection = ol.proj.configureProj4jsProjection({
            code : this._projectionCode,
            extent : extent
        });
        ol.proj.addProjection(projection);
        var bprojection = ol.proj.configureProj4jsProjection({
            code : 'urn:ogc:def:crs:EPSG:6.3:3067',
            extent : extent
        });
        ol.proj.addProjection(bprojection);

        if (!ol.proj.get(this._projectionCode))
            throw "NO CRS? " + this._projectionCode;
        /*       	if( !ol.proj.get('urn:ogc:def:crs:EPSG:6.3:3067') )
         throw "NO CRS? + urn EPSG 3067";*/

        var projectionExtent = projection.getExtent();

        this._projection = projection;

        var map = new ol.Map({
            extent : projectionExtent,
            controls : ol.control.defaults({}, [/*new ol.control.ScaleLine({
             units : ol.control.ScaleLineUnits.METRIC
             })*/]),
            layers : [],
            //renderers : ol.RendererHints.createFromQueryData(),
            renderer : ol.RendererHint.CANVAS,
            target : 'mapdiv'

        });

        var zoomslider = new ol.control.ZoomSlider({
            map : map
        });

        map.setView(new ol.View2D({
            projection : projection,
            center : [383341, 6673843],
            zoom : 5
        }));

        var me = this;

        map.on('moveend', function(evt) {
            
            var map = evt.map;
            var extent = map.getView().calculateExtent(map.getSize());
            var center = map.getView().getCenter();

            var sandbox = me._sandbox;
            sandbox.getMap().setMoving(false);
            sandbox.printDebug("sending AFTERMAPMOVE EVENT from map Event handler");

            var lonlat = map.getView().getCenter();
            me._updateDomain();
            var sboxevt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat[0], lonlat[1], map.getView().getZoom(), false, me.getMapScale());
            sandbox.notifyAll(sboxevt);

        });

        this._map = map;

        return this._map;
    },
      
    /**
     * @method moveMapToLanLot
     * Moves the map to the given position.
     * NOTE! Doesn't send an event if zoom level is not changed.
     * Call notifyMoveEnd() afterwards to notify other components about changed state.
     * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
     * @param {Number} zoomAdjust relative change to the zoom level f.ex -1 (optional)
     * @param {Boolean} pIsDragging true if the user is dragging the map to a new location currently (optional)
     */
    moveMapToLanLot : function(lonlat, zoomAdjust, pIsDragging) {
        // TODO: openlayers has isValidLonLat(); maybe use it here
        var isDragging = (pIsDragging === true);
        // using panTo BREAKS IE on startup so do not
        // should we spam events on dragmoves?
        this._map.getView().setCenter([lonlat.lon, lonlat.lat]);
        if (zoomAdjust) {
            this.adjustZoomLevel(zoomAdjust, true);
        }        

        this._updateDomain();
    },
    /**
     * @method panMapToLonLat
     * Pans the map to the given position.
     * @param {OpenLayers.LonLat} lonlat coordinates to pan the map to
     * @param {Boolean} suppressEnd true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    panMapToLonLat : function(lonlat, suppressEnd) {
        this._map.getView().setCenter([lonlat.lon, lonlat.lat]);
        this._updateDomain();
        if (suppressEnd !== true) {
            this.notifyMoveEnd();
        }
    },
    /**
     * @method zoomToScale
     * Pans the map to the given position.
     * @param {float} scale the new scale
     * @param {Boolean} closest find the zoom level that most closely fits the specified scale.
     *   Note that this may result in a zoom that does not exactly contain the entire extent.  Default is false
     * @param {Boolean} suppressEnd true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    zoomToScale : function(scale, closest, suppressEnd) {
        var isClosest = (closest === true);
        this._map.zoomToScale(scale, isClosest);
        this._updateDomain();
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
    centerMap : function(lonlat, zoom, suppressEnd) {
        // TODO: openlayers has isValidLonLat(); maybe use it here
        this._map.getView().setCenter([lonlat.lon, lonlat.lat]);
        this._updateDomain();
        if (suppressEnd !== true) {
            this.notifyMoveEnd();
        }
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
    panMapByPixels : function(pX, pY, suppressStart, suppressEnd, isDrag) {
        // usually programmatically for gfi centering
        /*this._map.pan(pX, pY, {
         dragging : ( isDrag ? true : false),
         animate : false
         });*/
        var map = this._map;
        var view = map.getView();

        var res = view.getResolution();
        var cxy = view.getCenter();
        var panTo = [cxy[0] - pX * res, cxy[1] - pY * res];

        (function() {
            var duration = 1000;
            var start = +new Date();
            var pan = ol.animation.pan({
                duration : duration,
                source : view.getCenter(),
                start : start
            });
          
            map.beforeRender(pan);
            view.setCenter(panTo);
        })()

        // view.setCenter(panTo);

        this._updateDomain();
        // send note about map change
        if (suppressStart !== true) {
            this.notifyStartMove();
        }
        if (suppressEnd !== true) {
            this.notifyMoveEnd();
        }
    },
    
    /**
     * @method centerMapByPixels
     * Moves the map so the given pixel coordinates relative to the viewport is on the center of the view port.
     * @param {Number} pX pixel coordinates on x axis
     * @param {Number} pY pixel coordinates on y axis
     * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
     *  (other components wont know that the map has started moving, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     * @param {Boolean} suppressEnd true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    centerMapByPixels : function(pX, pY, suppressStart, suppressEnd) {
        var newXY = new OpenLayers.Pixel(pX, pY);
        var newCenter = this._map.getLonLatFromViewPortPx(newXY);
        // check that the coordinates are reasonable, otherwise its easy to
        // scrollwheel the map out of view
        if (!this.isValidLonLat(newCenter.lon, newCenter.lat)) {
            // do nothing if not valid
            return;
        }
        this.moveMapToLanLot(newCenter);

        // send note about map change
        if (suppressStart !== true) {
            this.notifyStartMove();
        }
        if (suppressEnd !== true) {
            this.notifyMoveEnd();
        }
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
    zoomToExtent : function(bounds, suppressStart, suppressEnd) {
        //this._map.zoomToExtent(bounds);
        var bbox = [bounds.left, bounds.bottom, bounds.right, bounds.top];
        this._map.getView().fitExtent(bbox, this._map.getSize());

        this._updateDomain();
        // send note about map change
        if (suppressStart !== true) {
            this.notifyStartMove();
        }
        if (suppressEnd !== true) {
            this.notifyMoveEnd();
        }
    },
    /**
     * @method adjustZoomLevel
     * Adjusts the maps zoom level by given relative number
     * @param {Number} zoomAdjust relative change to the zoom level f.ex -1
     * @param {Boolean} suppressEvent true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    adjustZoomLevel : function(amount, suppressEvent) {       
        var delta = amount;
        var view = this._map.getView().getView2D();
        var currZoom = view.getZoom();
        view.setZoom(currZoom + delta);

        this._updateDomain();
        if (suppressEvent !== true) {
            // send note about map change
            this.notifyMoveEnd();
        }
    },
    /**
     * @method setZoomLevel
     * Sets the maps zoom level to given absolute number
     * @param {Number} newZoomLevel absolute zoom level (0-12)
     * @param {Boolean} suppressEvent true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    setZoomLevel : function(newZoomLevel, suppressEvent) {
        if (newZoomLevel == this._map.getView().getZoom()) {
            // do nothing if requested zoom is same as current
            return;
        }
        if (newZoomLevel < 0 || newZoomLevel > this._map.getNumZoomLevels) {
            newZoomLevel = this._map.getView().getZoom();
        }
        this._map.getView().setZoom(newZoomLevel);
        this._updateDomain();
        if (suppressEvent !== true) {
            // send note about map change
            this.notifyMoveEnd();
        }
    },
    
    getZoomLevel : function() {
        return this._map.getView().getZoom();
    },
    /**
     * @method _getNewZoomLevel
     * @private
     * Does a sanity check on a zoomlevel adjustment to see if the adjusted zoomlevel is
     * supported by the map (is between 0-12). Returns the adjusted zoom level if it is valid or
     * current zoom level if the adjusted one is out of bounds.
     * @return {Number} sanitized absolute zoom level
     */
    _getNewZoomLevel : function(adjustment) {
        // TODO: check isNaN?
        var requestedZoomLevel = this._map.getView().getZoom() + adjustment;

        if (requestedZoomLevel >= 0 && requestedZoomLevel <= this._map.getNumZoomLevels()) {
            return requestedZoomLevel;
        }
        // if not in valid bounds, return original
        return this._map.getView().getZoom();
    },
      
    /**
     * @method _updateDomain
     * @private
     * Updates the sandbox map domain object with the current map properties.
     * Ignores the call if map is in stealth mode.
     */
    _updateDomain : function() {

        if (this.getStealth()) {
            // ignore if in "stealth mode"
            return;
        }
        var sandbox = this._sandbox;
        var mapVO = sandbox.getMap();
        var lonlat = this._map.getView().getCenter();
        var zoom = this._map.getView().getZoom();
        mapVO.moveTo(lonlat[0], lonlat[1], zoom);

        mapVO.setScale(this.getMapScale());

        var size = this._map.getSize();
        mapVO.setWidth(size[0]);
        mapVO.setHeight(size[1]);
        mapVO.setResolution(this._map.getView().getResolution());

        var extent = this._map.getView().calculateExtent(this._map.getSize());

        var bbox = new OpenLayers.Bounds(extent[0], extent[1], extent[2], extent[3]);

        mapVO.setExtent(bbox);
        mapVO.setBbox(bbox)

        var maxBbox = this._maxExtent;
        var maxExtentBounds = new OpenLayers.Bounds(maxBbox.left, maxBbox.bottom, maxBbox.right, maxBbox.top);
        mapVO.setMaxExtent(maxExtentBounds);

    },

   
    _addLayerImpl : function(layerImpl) {
        this._map.addLayer(layerImpl);
    },

    _removeLayerImpl : function(layerImpl) {

        this._map.removeLayer(layerImpl);     

    },

    setLayerIndex : function(layerImpl, index) {
        var layerColl = this._map.getLayers();
        var layerIndex = this.getLayerIndex(layerImpl);

        /* find */
        /* remove */
        /* insert at */

        if (index === layerIndex) {
            return
        } else if (index === layerColl.getLength()) {
            /* to top */
            layerColl.removeAt(layerIndex);
            layerColl.insertAt(index, layerImpl);
        } else if (layerIndex < index) {
            /* must adjust change */
            layerColl.removeAt(layerIndex);
            layerColl.insertAt(index - 1, layerImpl);

        } else {
            layerColl.removeAt(layerIndex);
            layerColl.insertAt(index, layerImpl);
        }

    },

    getLayerIndex : function(layerImpl) {
        var layerColl = this._map.getLayers();
        var layerArr = layerColl.getArray();

        for (var n = 0; n < layerArr.length; n++) {
            if (layerArr[n] === layerImpl) {
                return n;
            }
        }
        return -1;

    },

    getMapScale : function() {
        return OpenLayers.Util.getScaleFromResolution(this._map.getView().getResolution(), 'm');

    },
    
    updateSize : function() {
        this._map.updateSize();
    },
    
    _addMapControlImpl : function(ctl) {
        this._map.addControl(ctl);
    },
    
    _removeMapControlImpl : function(ctl) {
        this._map.removeControl(ctl);
        
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module'],
    "extend" : ["Oskari.mapping.mapmodule.AbstractMapModule"]
});
