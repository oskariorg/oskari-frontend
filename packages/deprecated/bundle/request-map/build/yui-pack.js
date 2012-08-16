/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.request.common.DisableMapKeyboardMovementRequest
 *
 * Requests for keyboard control on map to be disabled. This is usually requested
 * so that typing on a textfield doesn't move the map on the background.
 * Opposite of
 * Oskari.mapframework.request.common.EnableMapKeyboardMovementRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.DisableMapKeyboardMovementRequest',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "DisableMapKeyboardMovementRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.EnableMapKeyboardMovementRequest
 *
 * Requests for keyboard control on map to be enabled. This is usually requested
 * after the disable event to reactivate the keyboard controls after leaving a
 * textfield.
 * Opposite of
 * Oskari.mapframework.request.common.DisableMapKeyboardMovementRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.EnableMapKeyboardMovementRequest',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "EnableMapKeyboardMovementRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.AddMapLayerRequest
 *
 * Requests for given map layer to be added on map. Opposite of 
 * Oskari.mapframework.request.common.RemoveMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.AddMapLayerRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 * @param {Boolean}
 *            keepLayersOrder should order of layers be reserved (optional,
 * defaults to false)
 * @param {Boolean}
 *            isBasemap (optional, defaults to false)
 * @param {Boolean}
 *            isExternal (optional, not used in paikkatietoikkuna)
 */
function(mapLayerId, keepLayersOrder, isBasemap, isExternal) {

    this._creator = null;
    this._mapLayerId = mapLayerId;
    this._keepLayersOrder = (keepLayersOrder == true);
    this._isExternal = (isExternal == true);
    this._isBasemap = (isBasemap == true);
}, {
    /** @static @property __name request name */
    __name : "AddMapLayerRequest",

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
    },
    /**
     * @method getKeepLayersOrder
     * @return {Boolean} boolean true if we should keep the layer order
     */
    getKeepLayersOrder : function() {
        return this._keepLayersOrder;
    },
    /**
     * @method isBasemap
     * @return {Boolean} boolean true if this is a basemap
     */
    isBasemap : function() {
        return this._isBasemap;
    },
    /**
     * @method isExternal
     * @return {Boolean} true if this is an externally added layer (not found in
     * MapLayerService?)
     */
    isExternal : function() {
        return this._isExternal;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.RemoveMapLayerRequest
 *
 * Requests for given map layer to be removed on map. Triggers a 
 * Oskari.mapframework.event.common.AfterMapLayerRemoveEvent.
 * Opposite of Oskari.mapframework.request.common.AddMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.RemoveMapLayerRequest', 
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
    __name : "RemoveMapLayerRequest",
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
 * @class Oskari.mapframework.request.common.GetFeatureInfoRequest
 *
 * Requests for a get feature info for the clicked spot on the map to be shown.
 * Triggers a Oskari.mapframework.event.common.AfterGetFeatureInfoEvent.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.GetFeatureInfoRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Mixed/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]}
 *            mapLayers array of map layer objects, possible others than listed if additional maplayer types have been added by bundles
 * @param {Number}
 *            lon longitude
 * @param {Number}
 *            lat latitude
 * @param {Number}
 *            coordX mouseclick on map x coordinate (in pixels)
 * @param {Number}
 *            coordY mouseclick on map y coordinate (in pixels)  
 * @param {Number}
 *            mapWidth  map window width
 * @param {Number}
 *            mapHeight  map window height
 * @param {OpenLayers.Bounds}
 *            bbox   map window dimensions (as coordinates)
 * @param {String}
 *            srsProjectionCode  srs projection code
 */
function(mapLayers, lon, lat, coordX, coordY, mapWidth, mapHeight, bbox, srsProjectionCode) {
    this._creator = null;
    this._mapLayers = mapLayers;

    this._lon = lon;

    this._lat = lat;

    this._x = coordX;
    // mouse click position x (in pixels)
    this._y = coordY;
    //  mouse click position y (in pixels)
    this._mapWidth = mapWidth;
    // (in pixels)
    this._mapHeight = mapHeight;
    // (in pixels)
    this._bbox = bbox;
    // map dimensions (as coordinates)
    this._srs = srsProjectionCode;
    // map dimensions (as coordinates)

}, {
    /** @static @property __name request name */
    __name : "GetFeatureInfoRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayers
     * @return
     * {Mixed/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]}
     *      mapLayers array of map layer objects, possible others than listed if
     * additional maplayer types have been added by bundles
     */
    getMapLayers : function() {
        return this._mapLayers;
    },
    /**
     * @method getLon
     * @return {Number} longitude 
     */
    getLon : function() {
        return this._lon;
    },
    /**
     * @method getLat
     * @return {Number} latitude
     */
    getLat : function() {
        return this._lat;
    },
    /**
     * @method getX
     * @return {Number} mouseclick on map x coordinate (in pixels)
     */
    getX : function() {
        return this._x;
    },
    /**
     * @method getY
     * @return {Number} mouseclick on map y coordinate (in pixels)
     */
    getY : function() {
        return this._y;
    },
    /**
     * @method getMapWidth
     * @return {Number} map window width
     */
    getMapWidth : function() {
        return this._mapWidth;
    },
    /**
     * @method getMapHeight
     * @return {Number} map window height
     */
    getMapHeight : function() {
        return this._mapHeight;
    },
    /**
     * @method getBoundingBox
     * @return {OpenLayers.Bounds} map window dimensions (as coordinates)
     */
    getBoundingBox : function() {
        return this._bbox;
    },
    /**
     * @method getSRS
     * @return {String} srs projection code
     */
    getSRS : function() {
        return this._srs;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.MapMoveRequest
 *
 * Requests for the map to move to given location and zoom level/bounds. 
 * Map sends out Oskari.mapframework.event.common.AfterMapMoveEvent after it has 
 * processed the request and the map has been moved. 
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.MapMoveRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} centerX
 *            longitude
 * @param {Number} centerY
 *            latitude
 * @param {Number/OpenLayers.Bounds} zoom (optional)
 *            zoomlevel (0-12) or OpenLayers.Bounds to zoom to. If not given the map zoom level stays as it was.
 * @param {Boolean} marker
 *            true if map should add a marker to this location (optional, defaults to false)
 */
function(centerX, centerY, zoom, marker) {
    this._creator = null;

    this._centerX = centerX;

    this._centerY = centerY;

    this._zoom = zoom;

    this._marker = marker;

}, {
    /** @static @property {String} __name request name */
    __name : "MapMoveRequest",

    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getCenterX
     * @return {Number} longitude
     */
    getCenterX : function() {
        return this._centerX;
    },
    /**
     * @method getCenterY
     * @return {Number} latitude
     */
    getCenterY : function() {
        return this._centerY;
    },
    /**
     * @method getZoom
     * @return {Number/OpenLayers.Bounds} zoomlevel (0-12) or OpenLayers.Bounds
     * to zoom to
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method getMarker
     * @return {Boolean} true if map should add a marker to this location
     */
    getMarker : function() {
        return this._marker;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.ShowMapLayerInfoRequest
 *
 * Requests for additional information for the given map layer to be shown in the UI.
 * (In practice the legend image for the requested layer is shown by 
 * Oskari.mapframework.ui.module.searchservice.MetadataModule).
 * Triggers a Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent
 * 
 * TODO: the request could be handled directly without the event
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.ShowMapLayerInfoRequest', 

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
    __name : "ShowMapLayerInfoRequest",
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
 * @class Oskari.mapframework.request.common.HideMapMarkerRequest
 *
 * Request for any markers shown on map to be hidden
 */
Oskari.clazz.define('Oskari.mapframework.request.common.HideMapMarkerRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "HideMapMarkerRequest",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.CtrlKeyDownRequest
 *
 * Requests for core to handle ctrl button key press.
 * Opposite of Oskari.mapframework.request.common.CtrlKeyUpRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.CtrlKeyDownRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "CtrlKeyDownRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.CtrlKeyUpRequest
 *
 * Requests for core to handle ctrl button key release
 * Opposite of Oskari.mapframework.request.common.CtrlKeyDownRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.CtrlKeyUpRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "CtrlKeyUpRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */