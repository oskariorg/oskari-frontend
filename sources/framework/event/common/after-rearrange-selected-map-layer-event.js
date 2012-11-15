/**
 * @class Oskari.framework.event.common.AfterRearrangeSelectedMapLayerEvent
 * 
 * Used to notify that maplayer order has been changed in Oskari core.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            movedMapLayer moved map layer (matching one in MapLayerService)
 * @param {Number} fromPosition
 *            previous position
 * @param {Number} toPosition
 *            new position
 */
function(movedMapLayer, fromPosition, toPosition) {
    this._creator = null;
    this._movedMapLayer = movedMapLayer;
    this._fromPosition = fromPosition;
    this._toPosition = toPosition;
}, {
    /** @static @property __name event name */
    __name : "AfterRearrangeSelectedMapLayerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMovedMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            moved map layer (matching one in MapLayerService)
     */
    getMovedMapLayer : function() {
        return this._movedMapLayer;
    },
    /**
     * @method getFromPosition
     * @return  {Number} previous position
     */
    getFromPosition : function() {
        return this._fromPosition;
    },
    /**
     * @method getToPosition
     * @return  {Number} new position
     */
    getToPosition : function() {
        return this._toPosition;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */