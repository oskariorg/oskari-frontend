/**
 * @class Oskari.mapframework.bundle.featuredata2.event.WFSSetFilter
 *
 * <GIEV MIEH! COMMENTS>
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.event.WFSSetFilter',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} geojson
 *
 */
function(geojson) {
    this._geojson = geojson;
}, {
    /** @static @property __name event name */
    __name : "WFSSetFilter",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getGeoJson
     */
    getGeoJson : function() {
        return this._geojson;
    },
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
