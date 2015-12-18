/**
 * Model for the source metadata, i.e.
 * the objects with information about the indicators for one source.
 * 
 * {
 *   "source": {...},
 *   "selectors": [{
 *     "id": "Year",
 *     "allowedValues": ["2010", ...]
 *     },
 *     ...],
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
    /**
     * @return {LocalizedString}
     */
    getSource : function() {
        return Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.domain.LocalizedString',
                this.data.source);
    },
    getSelectors : function() {
        return this.data.selectors;
    },
    /**
     * @return {LocalizedString}
     */
    getDescription : function() {
        return Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.domain.LocalizedString',
                this.data.description);
    },
    getLayers : function() {
        return this.data.layers;
    },
    /**
     * @return {LocalizedString}
     */
    getName : function() {
        return Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.domain.LocalizedString',
                this.data.name);
    }
});