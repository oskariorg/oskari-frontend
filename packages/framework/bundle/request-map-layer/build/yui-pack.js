/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define(
		'Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest',
		function(mapLayerId, toPosition) {
			this._creator = null;

			this._mapLayerId = mapLayerId;

			this._toPosition = toPosition;
		}, {
			__name : "RearrangeSelectedMapLayerRequest",
			getName : function() {
				return this.__name;
			},

			getMapLayerId : function() {
				return this._mapLayerId;
			},

			getToPosition : function() {
				return this._toPosition;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
/**
 * @class Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest
 * Requests opacity change for maplayer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id for maplayer to be modified (Oskari.mapframework.service.MapLayerService)
 * @param {Number}
 *            opacity (0-100)
 */
function(mapLayerId, opacity) {
    this._creator = null;
    this._mapLayerId = mapLayerId;

    this._opacity = opacity;

}, {
    /** @static @property __name request name */
    __name : "ChangeMapLayerOpacityRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getOpacity
     * @return {Number} from 0 to 100 (0 = invisible)
     */
    getOpacity : function() {
        return this._opacity;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.ChangeMapLayerStyleRequest
 *
 * Changes style map layer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.ChangeMapLayerStyleRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in
 * Oskari.mapframework.service.MapLayerService
 * @param {String}
 *            style name of the new style that should be selected from map layer
 */
function(mapLayerId, style) {
    this._creator = null;
    this._mapLayerId = mapLayerId;

    this._style = style;
}, {
    /** @static @property __name request name */
    __name : "ChangeMapLayerStyleRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getStyle
     * @return {String} requested style name
     */
    getStyle : function() {
        return this._style;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in
     * Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.HighlightMapLayerRequest
 *
 * Requests for given map layer to be "highlighted" on map.
 * This means f.ex. a WMS layer to enable GetFeatureInfo clicks,
 * WFS layers to show featuretype grid and enable selection clicks on map
 * Opposite of Oskari.mapframework.request.common.DimMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.HighlightMapLayerRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "HighlightMapLayerRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.DimMapLayerRequest
 *
 * Requests for given "highlighted" map layer to be "dimmed" on map.
 * This means f.ex. a WMS layer to disable GetFeatureInfo clicks,
 * WFS layers to hide featuretype grid and disable selection clicks on map
 * Opposite of Oskari.mapframework.request.common.HighlightMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.DimMapLayerRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "DimMapLayerRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */