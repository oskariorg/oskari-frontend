/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequest
 *
 * Class for requesting map layer update / refresh
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            layerId layerId
 * @param {Boolean}
 *            forced true to force the update (optional)
 * @param {Object}
 *            optParameters additional parameters for WMS layer (optional, used for OpenLayers.Layer.mergeNewParams())
 */
function(layerId, forced, optParameters) {
    this._layerId = layerId;
    this._forced = (forced == true);
    this._parameters = optParameters;
}, {
    /** @static @property __name request name */
    __name : "MapModulePlugin.MapLayerUpdateRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLayerId
     * @return {String} layerId
     */
    getLayerId : function() {
        return this._layerId;
    },
    /**
     * @method isForced
     * @return {Boolean}
     */
    isForced : function() {
        return this._forced;
    },
    /**
     * @method getParameters
     * additional parameters for WMS layer (optional, used for OpenLayers.Layer.mergeNewParams())
     * @return {Object}
     */
    getParameters : function() {
        return this._parameters;
    },
    /**
     * @method setParameters
     * additional parameters for WMS layer (optional, used for OpenLayers.Layer.mergeNewParams())
     * @param {Object} p
     */
    setParameters : function(p) {
        this._parameters = p;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
}); 