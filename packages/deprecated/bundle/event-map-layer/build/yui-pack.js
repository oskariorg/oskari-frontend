/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent
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

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent
 *
 * Triggers when a
 * Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest is received.
 * The event includes the maplayer with the modified opacity.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer dimmed maplayer
 */
function(mapLayer) {
    this._creator = null;

    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterChangeMapLayerOpacityEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * changed maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */Oskari.clazz.define(
		'Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent',
		function(mapLayer) {
			this._creator = null;

			this._mapLayer = mapLayer;
		}, {
			__name : "AfterChangeMapLayerStyleEvent",
			getName : function() {
				return this.__name;
			},

			getMapLayer : function() {
				return this._mapLayer;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

/**
 * @class Oskari.mapframework.event.common.AfterHighlightMapLayerEvent
 *
 * Triggers when a given map layer has been requested to be
 * "highlighted" on map. This means f.ex. a WMS layer GetFeatureInfo clicks needs
 * to be enabled, WFS layers featuretype grid should be shown and selection clicks
 * on map enabled.
 * Opposite of Oskari.mapframework.event.common.AfterDimMapLayerEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterHighlightMapLayerEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer highlighted/selected maplayer
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterHighlightMapLayerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * highlighted/selected maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.AfterDimMapLayerEvent
 *
 * Triggers when a given "highlighted" map layer has been requested to be
 * "dimmed" on map. This means f.ex. a WMS layer GetFeatureInfo clicks needs to
 * be disabled, WFS layers featuretype grid should be hidden and selection clicks
 * on map disabled.
 * Opposite of Oskari.mapframework.event.common.AfterHighlightMapLayerEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterDimMapLayerEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer dimmed maplayer
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterDimMapLayerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * dimmed maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */