/**
 * Model for the list of indicator sources metadata, i.e.
 * the plugin classnames as keys to objects with information about the indicators.
 * 
 * {
 *   "fi": "",
 *   "en": "",
 *   "sv": "", ...
 *
 * @class Oskari.statistics.bundle.statsgrid.domain.LocalizedString
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.LocalizedString',
/**
 * @method create called automatically on construction
 * @static
 */
function(data) {
	this.data = data || {};
}, {
    /**
     * Returns the localization keys
     * @method getLocalizationKeys
     * @return {String[]}
     */
    getLocalizationKeys : function() {
    	if(!this.data) {
    		return;
    	}
		return Object.keys(this.data);
    },
    /**
     * Returns the localization for a certain key.
     * @method getLocalization
     * @return {String}
     */
    getLocalization : function(key) {
        return this.data[key];
    }
});