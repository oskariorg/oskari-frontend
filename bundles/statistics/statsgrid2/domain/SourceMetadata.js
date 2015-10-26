/**
 * Model for the source metadata, i.e.
 * the objects with information about the indicators for one source.
 * 
 * {
 *   "indicators": {
 *     "1411":{
 *       "source": {...},
 *       "selectors": {...},
 *       "description": {...},
 *       "layers":[
 *         // FIXME: Localize the layerIds for the dropdown.
 *         {"layerVersion":"1","type":"FLOAT","layerId":"Kunta"},
 *         ...
 *       ],
 *       "name": {...}
 *     }, ...
 *   },
 *   "localizationKey":"fi.nls.oskari.control.statistics.plugins.sotka.plugin_name"
 * }
 *
 * @class Oskari.statistics.bundle.statsgrid.domain.SourceMetadata
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.SourceMetadata',
/**
 * @method create called automatically on construction
 * @static
 */
function(data) {
	this.data = data || {};
}, {
    /**
     * Returns the indicators metadata for one plugin
     * @method getIndicators
     * @return {IndicatorsForSource[]}
     */
    getIndicators : function() {
    	if(!this.data) {
    		return;
    	}
		return Oskari.clazz.create(
	            'Oskari.statistics.bundle.statsgrid.domain.IndicatorsMetadata',
	            this.data.indicators);
    },
    /**
     * The localization key for the source this indicator source represents.
     */
    getLocalizationKey : function() {
        if(!this.data) {
            return;
        }
        return this.data.localizationKey;
    }
});