/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSPropertiesEvent
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSPropertiesEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
 * @param {String[]} locales
 * @param {String[]} fields
 */
function(layer, locales, fields) {
    this._layer = layer;
    this._locales = locales;
    this._fields = fields;
}, {
    /** @static @property __name event name */
    __name : "WFSPropertiesEvent",

    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getLayer
     * @return {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    getLayer : function() {
        return this._layer;
    },

    /**
     * @method getLocales
     * @return {String[]} locales
     */
    getLocales : function() {
        return this._locales;
    },

    /**
     * @method getFields
     * @return {String[]} fields
     */
    getFields : function() {
        return this._fields;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
