/**
 * @class Oskari.mapframework.bundle.personaldata.PublishedMapsTab
 * Renders the "personal data" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.PublishedMapsTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance, localization) {
	this.instance = instance;
	this.template = jQuery("<p>omat templatePublishedMapsTab content</p>");
	this.loc = localization;
}, {
	getTitle : function() {
		return this.loc.title;
	},
	addTabContent : function(container) {
		var content = this.template.clone();
		container.append(content);
	}
});
