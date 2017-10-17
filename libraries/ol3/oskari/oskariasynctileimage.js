goog.provide('ol.source.OskariAsyncTileImage');
goog.require('ol.TileState');
goog.require('ol.proj');
goog.require('ol.source.TileImage');
goog.require('ol.events');
goog.require('ol.tilecoord');

/**
 * @classdesc
 * Base class for sources providing images divided into a tile grid.
 *
 * @constructor
 * @fires ol.source.TileEvent
 * @extends {ol.source.TileImage}
 * @param {olx.source.TileImageOptions} options Image tile options.
 * @api
 */
ol.source.OskariAsyncTileImage = function(options) {
  goog.base(this, {
    attributions: options.attributions,
    extent: options.extent,
    logo: options.logo,
    opaque: options.opaque,
    projection: options.projection,
    state: options.state !== undefined ? (options.state) : undefined,
    tileGrid: options.tileGrid,
    tileLoadFunction: options.tileLoadFunction ? options.tileLoadFunction : function() {
      // no-op: loading is handled with transport/mediator
    },
    tilePixelRatio: options.tilePixelRatio,
    tileUrlFunction:  function (tileCoord, pixelRatio, projection) {
        var bounds = this.tileGrid.getTileCoordExtent(tileCoord);
        var bboxKey = this.bboxkeyStrip_(bounds);
        var wfsTileCache = this.getWFSTileCache_(),
            layerTileInfos = wfsTileCache.tileInfos,
            tileSetIdentifier = wfsTileCache.tileSetIdentifier;

        layerTileInfos[bboxKey] = {
            tileCoord: tileCoord,
            bounds: bounds,
            tileSetIdentifier: tileSetIdentifier
        };
        return bboxKey;
    },
    url: options.url,
    urls: options.urls,
    wrapX: options.wrapX
  });

  this.tileLayerCache = {
    tileSetIdentifier: 0,
    tileInfos: {
    }
  };

  this.__refreshTimer = null;
};

goog.inherits(ol.source.OskariAsyncTileImage, ol.source.TileImage);


/**
 * Strip bbox for unique key because of some inaccucate cases
 * OL computation (init grid in tilesizes)  is inaccurate in last decimal
 * @return {string}
 */
ol.source.OskariAsyncTileImage.prototype.bboxkeyStrip_ =  function (bbox) {
    var stripbox = [];
    if (!bbox) return '';
    for (var i = bbox.length; i--;) {
        stripbox[i] = bbox[i].toPrecision(13);
    }
    return stripbox.join(',');
};

/**
 * @return {!Object.<string, *>}
 */
ol.source.OskariAsyncTileImage.prototype.getWFSTileCache_ = function() {
    return this.tileLayerCache;
};

/**
 * @api
 */
ol.source.OskariAsyncTileImage.prototype.getNonCachedGrid = function (grid) {
    var result = [],
        i,
        me = this,
        bboxKey;

    var wfsTileCache = me.getWFSTileCache_();
        var layerTileInfos = wfsTileCache.tileInfos;

    wfsTileCache.tileSetIdentifier =  ++wfsTileCache.tileSetIdentifier ;
    for (i = 0; i < grid.bounds.length; i += 1) {
        bboxKey = me.bboxkeyStrip_(grid.bounds[i]);
        //at this point the tile should already been cached by the layers getTile - function.
            var tileInfo = layerTileInfos[bboxKey],
                tileCoord = tileInfo ? tileInfo.tileCoord: undefined,
                tileCoordKey = tileCoord? ol.tilecoord.getKeyZXY(tileCoord[0],tileCoord[1],tileCoord[2]) : undefined,
                tile;
            if( tileCoordKey && this.tileCache.containsKey(tileCoordKey)) {
                tile = this.tileCache.get(tileCoordKey);
            }

            if (tile ) {
                if( tile.PLACEHOLDER === true) {
                    result.push(grid.bounds[i]);
                } else if(tile.getState() !== ol.TileState.LOADED) {
                    result.push(grid.bounds[i]);
                } else if( tile.isBoundaryTile === true ) {
                    result.push(grid.bounds[i]);
                }
            } else {
                delete layerTileInfos[bboxKey];
            }
    }
    return result;
};


/**
 * Note! Same as the original function, but tilestate is initialized to LOADING
 * so tilequeue isn't blocked by the async nature of Oskari WFS
 *
 * Basically substitutes and combines the best parts of the functionalities
 * of ol.source.TileImage getTileInternal() & createTile_() - methods.
 *
 * @param {number} z Tile coordinate z.
 * @param {number} x Tile coordinate x.
 * @param {number} y Tile coordinate y.
 * @param {number} pixelRatio Pixel ratio.
 * @param {ol.proj.Projection} projection Projection.
 * @param {string} key The key set on the tile.
 * @return {!ol.Tile}
 */
ol.source.OskariAsyncTileImage.prototype.createOskariAsyncTile = function(z, x, y, pixelRatio, projection, key) {
  var tileCoordKey = ol.tilecoord.getKeyZXY(z, x, y);
  if (this.tileCache.containsKey(tileCoordKey)) {
    return /**@type {!ol.Tile}*/(this.tileCache.get(tileCoordKey));
  } else {
    goog.DEBUG && console.assert(projection, 'argument projection is truthy');
    var tileCoord = [z, x, y];
    var urlTileCoord = this.getTileCoordForTileUrlFunction(
        tileCoord, projection);
    var tileUrl = !urlTileCoord ? undefined :
        this.tileUrlFunction(urlTileCoord, pixelRatio, projection);
    var tile = new this.tileClass(
        tileCoord,
        // always set state as LOADING since loading is handled outside ol3
        // IDLE state will result in a call to loadTileFunction and block rendering on other sources if
        // we don't get results because of async load errors/job cancellation etc
        ol.TileState.LOADING,
        tileUrl !== undefined ? tileUrl : '',
        this.crossOrigin,
        this.tileLoadFunction);
    ol.events.listen(tile, ol.events.EventType.CHANGE,
        this.handleTileChange, this);

    this.tileCache.set(tileCoordKey, tile);
    return tile;
  }
};

/**
 * @return  {ol.renderer.canvas.TileLayer}     canvasRenderer to force rerendering of tiles (ugly hack)
 */
 ol.source.OskariAsyncTileImage.prototype.getCanvasRenderer = function(layer, map){
    return map.getRenderer().getLayerRenderer(layer);
 }

/**
 * Workaround for being able to access renderer's private tile range property...
 * Not sure if we need this for anything anymore? We needed this in ol 3.11.2 for the canvas to update
 * border tiles correctly, but it seems the canvas' behaviour has been fixed in 3.14.2. Still, keeping this as a memory of what once was.
 */
 ol.renderer.canvas.TileLayer.prototype.resetRenderedCanvasTileRange = function() {
  //this.renderedCanvasTileRange_ = new ol.TileRange(NaN, NaN, NaN, NaN);
 }

/**
 * Workaround for being able to set the imageTile's state manually.
 */
ol.ImageTile.prototype.setState = function(state) {
  this.state = state;
};

/**
 * Workaround for obtaining a tilerange for a resolution and extent in wfslayerplugin
 * @api
 */
 ol.tilegrid.TileGrid.prototype.getTileRangeForExtentAndZoomWrapper = function(mapExtent, zoom) {
    var tileRange = this.getTileRangeForExtentAndZ(mapExtent, zoom);
    //return as array to avoid the closure compiler's dirty renaming deeds without having to expose the tilerange as well...
    return [tileRange.minX, tileRange.minY, tileRange.maxX, tileRange.maxY];

 }
/**
 * @param  {Array.<number>} boundsObj     tile bounds
 * @param  {string}         imageData     dataurl or actual url for image
 * @param  {ol.layer.Tile}     layer whose renderer will be fooled into thinking it's gotta redraw everything (ugly hack)
 * @param  {ol.Map}     map from which to dig up the layerrenderer to hack (ugly hack)
 * @param  {boolean}        boundaryTile  true if this an incomplete tile
 * @api
 */
ol.source.OskariAsyncTileImage.prototype.setupImageContent = function(boundsObj, imageData, layer, map, boundaryTile) {
    var me = this,
        bboxKey = this.bboxkeyStrip_(boundsObj);
    if (!bboxKey) {
      return;
    }

    var layerTileInfos = this.getWFSTileCache_().tileInfos;
    var tileInfo = layerTileInfos[bboxKey],
        tileCoord = tileInfo ? tileInfo.tileCoord: undefined,
        tileCoordKey = tileCoord? ol.tilecoord.getKeyZXY(tileCoord[0],tileCoord[1],tileCoord[2]) : undefined,
        tile;
    if( tileCoordKey && this.tileCache.containsKey (tileCoordKey)) {
        tile = this.tileCache.get(tileCoordKey);
    }
    if(!tile) {
      return;
    }
    switch(tile.getState()) {
        case ol.TileState.IDLE : // IDLE: 0,
        case ol.TileState.LOADING: //LOADING: 1,
            me.__fixTile(tile, imageData, layer, map);
            break;
        case ol.TileState.LOADED: // LOADED: 2
        case ol.TileState.ERROR: // ERROR: 3
        case ol.TileState.EMPTY: // EMPTY: 4
            me.__fixTile(tile, imageData, layer, map);
            break;
        default:
            tile.handleImageError_();
    }

    tile.isBoundaryTile = boundaryTile;
    tileInfo.isBoundaryTile = boundaryTile;
    if( !tile.isBoundaryTile ) {
        delete layerTileInfos[bboxKey];
    }
};

ol.source.OskariAsyncTileImage.prototype.__fixTile = function(tile, imageData, layer, map) {
    clearTimeout(this.__refreshTimer);
    tile.PLACEHOLDER = false;
    tile.getImage().src = imageData;
    tile.setState(ol.TileState.LOADED);

    var me = this;
    this.__refreshTimer = setTimeout(function() {
        me.getCanvasRenderer(layer, map).resetRenderedCanvasTileRange();
        me.changed();
    }, 500);

};
/**
 * Note! Always uses the non-projected internal tile getter
 * @inheritDoc
 */
ol.source.OskariAsyncTileImage.prototype.getTile = function(z, x, y, pixelRatio, projection) {
//    var paramsKey = this.getKeyParams();
    return this.createOskariAsyncTile(z, x, y, pixelRatio, projection, '');
};
