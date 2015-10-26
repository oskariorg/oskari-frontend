/**
 * Model for the indicators metadata, i.e.
 * the objects with information about the indicators for one source keyed by the indicator id.
 * 
 * {
 *   "1411":{
 *     "source": {...},
 *     "selectors": {...},
 *     "description": {...},
 *     "layers":[
 *       // FIXME: Localize the layerIds for the dropdown.
 *       {"layerVersion":"1","type":"FLOAT","layerId":"Kunta"},
 *       ...
 *     ],
 *     "name": {...}
 *   }, ...
 * }
 *
 * @class Oskari.statistics.bundle.statsgrid.domain.IndicatorsMetadata
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.IndicatorsMetadata',
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
    getIndicatorIds : function() {
        if(!this.data) {
            return;
        }
        return Object.keys(this.data);
    },
    getIndicator : function(id) {
        return Oskari.clazz.create(
            'Oskari.statistics.bundle.statsgrid.domain.IndicatorMetadata',
            this.data[id]);
    }
});