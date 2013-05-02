/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSPropertiesEvent
 *
 * <GIEV MIEH! COMMENTS>
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSPropertiesEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * <GIEV MIEH! PARAMS>
 *
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
     */
    getLayer : function() {
        return this._layer;
    },

    /**
     * @method getLocales
     */
    getLocales : function() {
        return this._locales;
    },

    /**
     * @method getFields
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
