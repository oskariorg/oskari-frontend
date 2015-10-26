/**
 * Model for the source metadata, i.e.
 * the objects with information about the indicators for one source.
 * 
 * {
 *   "source": {...},
 *   "selectors": {...},
 *   "description": {...},
 *   "layers":[
 *     // FIXME: Localize the layerIds for the dropdown.
 *     {"layerVersion":"1","type":"FLOAT","layerId":"Kunta"},
 *     ...
 *   ],
 *   "name": {...}
 * }
 * 
 * @class Oskari.statistics.bundle.statsgrid.domain.IndicatorMetadata
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.IndicatorMetadata',
/**
 * @method create called automatically on construction
 * @static
 */
function(data) {
	this.data = data || {};
}, {
    getSource : function() {
        return data.source;
    },
    getSelectors : function() {
        return data.selectors;
    },
    /**
     * @return {String}
     */
    getDescription : function() {
        return data.description;
    },
    getLayers : function() {
        return data.layers;
    },
    /**
     * @return {LocalizedString}
     */
    getName : function() {
        return data.name;
    }
});