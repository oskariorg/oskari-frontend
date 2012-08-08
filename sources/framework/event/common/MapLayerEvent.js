/**
 * @class Oskari.mapframework.event.common.MapLayerEvent
 *
 * Notifies application bundles that a map layers data(e.g. name) has changed or
 * that a layer has been added to/removed from Oskari.mapframework.service.MapLayerService
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MapLayerEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            layerId id for the changed layer (data available in
 * Oskari.mapframework.service.MapLayerService)
 * @param {String}
 *            operation one of #operations
 */
function(layerId, operation) {
    this._creator = null;
    this._layerId = layerId;
    if(!this.operations[operation]) {
        throw "Unknown operation '" + operation + "'";
    }
    this._operation = operation;
}, {
    /** @static @property __name event name */
    __name : "MapLayerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLayerId
     * @return {String}  id for the changed layer (data available in
     * Oskari.mapframework.service.MapLayerService)
     */
    getLayerId : function() {
        return this._layerId;
    },
    /**
     * @method getOperation
     * @return {String} one of #operations
     */
    getOperation : function() {
        return this._operation;
    },
    /**
     * @property {Object} operations identifiers to tell what has happened
     * @static
     */
    operations : {
        /** @static @property {String} operations.add layer has been added */
        'add' : 'add',
        /** @static @property {String} operations.remove layer has been removed
         */
        'remove' : 'remove',
        /** @static @property {String} operations.update layer has been updated
         * (e.g. name) */
        'update' : 'update'
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */