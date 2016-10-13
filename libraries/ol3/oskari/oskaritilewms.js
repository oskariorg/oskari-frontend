goog.provide('ol.source.OskariTileWMS');
goog.require('ol.source.TileWMS');

/**
 * @classdesc
 * Base class for sources providing images divided into a tile grid.
 *
 * @constructor
 * @extends {ol.source.TileWMS}
 * @param {olx.source.TileWMSOptions=} opt_options Tile WMS options.
 * @api
 */
ol.source.OskariTileWMS = function(opt_options) {
	goog.base(this, opt_options);	
};

goog.inherits(ol.source.OskariTileWMS, ol.source.TileWMS);

/**
 * Force tiled WMS to always use the source's projection object instead of the view's, if provided!
 */
ol.source.OskariTileWMS.prototype.getTile = function(z, x, y, pixelRatio, projection) {
	if (this.getProjection()) {
		return goog.base(this, 'getTile', z, x, y, pixelRatio, this.getProjection());
	} else {
		return goog.base(this, 'getTile', z, x, y, pixelRatio, projection);
	}
}
