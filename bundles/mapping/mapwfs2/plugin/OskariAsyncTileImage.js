import olSourceTileImage from 'ol/source/TileImage';
import olTileState from 'ol/TileState';
import {getKeyZXY as olTilecoordGetKeyZXY} from 'ol/tilecoord';
import {listen as olEventsListen} from 'ol/events';
import olEventsEventType from 'ol/events/EventType';

export default class OskariAsyncTileImage extends olSourceTileImage {
    constructor (options) {
        super({
            attributions: options.attributions,
            extent: options.extent,
            logo: options.logo,
            opaque: options.opaque,
            projection: options.projection,
            state: options.state !== undefined ? (options.state) : undefined,
            tileGrid: options.tileGrid,
            tileLoadFunction: options.tileLoadFunction ? options.tileLoadFunction : function () {
                // no-op: loading is handled with transport/mediator
            },
            tilePixelRatio: options.tilePixelRatio,
            tileUrlFunction: function (tileCoord, pixelRatio, projection) {
                var bounds = this.tileGrid.getTileCoordExtent(tileCoord);
                var bboxKey = this.bboxkeyStrip_(bounds);
                var wfsTileCache = this.getWFSTileCache_();
                var layerTileInfos = wfsTileCache.tileInfos;
                var tileSetIdentifier = wfsTileCache.tileSetIdentifier;

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

        this.throttledChange = Oskari.util.throttle(() => {
            this.changed();
        }, 100);
    }
    /**
     * Strip bbox for unique key because of some inaccucate cases
     * OL computation (init grid in tilesizes)  is inaccurate in last decimal
     * @return {string}
     */
    bboxkeyStrip_ (bbox) {
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
    getWFSTileCache_ () {
        return this.tileLayerCache;
    };

    /**
     * @api
     */
    getNonCachedGrid (grid) {
        var result = [];
        var i;
        var me = this;
        var bboxKey;

        var wfsTileCache = me.getWFSTileCache_();
        var layerTileInfos = wfsTileCache.tileInfos;

        wfsTileCache.tileSetIdentifier = ++wfsTileCache.tileSetIdentifier;
        for (i = 0; i < grid.bounds.length; i += 1) {
            bboxKey = me.bboxkeyStrip_(grid.bounds[i]);
            // at this point the tile should already been cached by the layers getTile - function.
            var tileInfo = layerTileInfos[bboxKey];
            var tileCoord = tileInfo ? tileInfo.tileCoord : undefined;
            var tileCoordKey = tileCoord ? olTilecoordGetKeyZXY(tileCoord[0], tileCoord[1], tileCoord[2]) : undefined;
            var tile;

            if (tileCoordKey && this.tileCache.containsKey(tileCoordKey)) {
                tile = this.tileCache.get(tileCoordKey);
            }

            if (tile) {
                if (tile.PLACEHOLDER === true) {
                    result.push(grid.bounds[i]);
                } else if (tile.getState() !== olTileState.LOADED) {
                    result.push(grid.bounds[i]);
                } else if (tile.isBoundaryTile === true) {
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
     * of ol/source/TileImage getTileInternal() & createTile_() - methods.
     *
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {ol/proj/Projection} projection Projection.
     * @param {string} key The key set on the tile.
     * @return {ol/Tile}
     */
    createOskariAsyncTile (z, x, y, pixelRatio, projection, key) {
        var tileCoordKey = olTilecoordGetKeyZXY(z, x, y);
        if (this.tileCache.containsKey(tileCoordKey)) {
            return /** @type {!ol/Tile} */(this.tileCache.get(tileCoordKey));
        } else {
            // console.assert(projection, 'argument projection is truthy');
            var tileCoord = [z, x, y];
            var urlTileCoord = this.getTileCoordForTileUrlFunction(
                tileCoord, projection);
            var tileUrl = !urlTileCoord ? undefined
                : this.tileUrlFunction(urlTileCoord, pixelRatio, projection);
            var tile = new this.tileClass(
                tileCoord,
                // always set state as LOADING since loading is handled outside ol3
                // IDLE state will result in a call to loadTileFunction and block rendering on other sources if
                // we don't get results because of async load errors/job cancellation etc
                olTileState.LOADING,
                tileUrl !== undefined ? tileUrl : '',
                this.crossOrigin,
                this.tileLoadFunction);
            olEventsListen(tile, olEventsEventType.CHANGE,
                this.handleTileChange, this);

            this.tileCache.set(tileCoordKey, tile);
            return tile;
        }
    };
    /**
     * @param  {Array.<number>} boundsObj     tile bounds
     * @param  {string}         imageData     dataurl or actual url for image
     * @param  {ol/layer/Tile}  layer
     * @param  {ol/Map}         map
     * @param  {boolean}        boundaryTile  true if this an incomplete tile
     * @api
     */
    setupImageContent (boundsObj, imageData, layer, map, boundaryTile) {
        var me = this;
        var bboxKey = this.bboxkeyStrip_(boundsObj);
        if (!bboxKey) {
            return;
        }

        var layerTileInfos = this.getWFSTileCache_().tileInfos;
        var tileInfo = layerTileInfos[bboxKey];
        var tileCoord = tileInfo ? tileInfo.tileCoord : undefined;
        var tileCoordKey = tileCoord ? olTilecoordGetKeyZXY(tileCoord[0], tileCoord[1], tileCoord[2]) : undefined;
        var tile;
        if (tileCoordKey && this.tileCache.containsKey(tileCoordKey)) {
            tile = this.tileCache.get(tileCoordKey);
        }
        if (!tile) {
            return;
        }
        switch (tile.getState()) {
        case olTileState.IDLE: // IDLE: 0,
        case olTileState.LOADING: // LOADING: 1,
            me.__fixTile(tile, imageData, layer, map);
            break;
        case olTileState.LOADED: // LOADED: 2
        case olTileState.ERROR: // ERROR: 3
        case olTileState.EMPTY: // EMPTY: 4
            me.__fixTile(tile, imageData, layer, map);
            break;
        default:
            tile.handleImageError_();
        }

        tile.isBoundaryTile = boundaryTile;
        tileInfo.isBoundaryTile = boundaryTile;
        if (!tile.isBoundaryTile) {
            delete layerTileInfos[bboxKey];
        }
    };

    __fixTile (tile, imageData, layer, map) {
        tile.PLACEHOLDER = false;
        tile.getImage().src = imageData;
        tile.setState(olTileState.LOADED);

        this.throttledChange();
    };
    /**
     * Note! Always uses the non-projected internal tile getter
     * @inheritDoc
     */
    getTile (z, x, y, pixelRatio, projection) {
        //    var paramsKey = this.getKeyParams();
        return this.createOskariAsyncTile(z, x, y, pixelRatio, projection, '');
    }
}
