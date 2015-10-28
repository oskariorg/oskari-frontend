/**
 * Model for the list of indicator sources metadata, i.e.
 * the plugin classnames as keys to objects with information about the indicators.
 * 
 * "fi.nls.oskari.control.statistics.plugins.sotka.SotkaStatisticalDatasourcePlugin": {
 *   "indicators": {
 *     "1411":{
 *       "source": {...},
 *       "selectors": [...],
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
 * @class Oskari.statistics.bundle.statsgrid.domain.IndicatorsMetadata
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.SourcesMetadata',
/**
 * @method create called automatically on construction
 * @static
 */
function(data) {
	this.data = data || {};
}, {
    /**
     * Returns the plugin ids
     * @method getPluginIds
     * @return {String[]}
     */
    getPluginIds : function() {
    	if(!this.data) {
    		return;
    	}
		return Object.keys(this.data);
    },
    getPlugin : function(id) {
        return Oskari.clazz.create(
            'Oskari.statistics.bundle.statsgrid.domain.SourceMetadata',
            this.data[id]);
    }
});