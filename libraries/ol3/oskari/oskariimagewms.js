goog.provide('ol.source.OskariImageWMS');
goog.require('ol.source.ImageWMS');

/**
 * @classdesc
 * Source for WMS servers providing single, untiled images.
 *
 * @constructor
 * @extends {ol.source.ImageWMS}
 * @param {olx.source.ImageWMSOptions=} opt_options Options.
 * @api
 */
ol.source.OskariImageWMS = function(opt_options) {
	goog.base(this, opt_options);	
};

goog.inherits(ol.source.OskariImageWMS, ol.source.ImageWMS);

/**
 * Return currently shown image url
 * @api
 */
ol.source.OskariImageWMS.prototype.getImageUrl = function() {
	return this.image_.src_;
}
