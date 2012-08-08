/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.event.common.FeaturesAvailableEvent
 *
 * Used to add/replace features on a
 * Oskari.mapframework.domain.VectorLayer
 * See Oskari.mapframework.mapmodule.VectorLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.event.common.FeaturesAvailableEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.VectorLayer}
 *            mapLayer highlighted/selected maplayer
 * @param {Mixed}
 *            features featuredata in #getMimeType format
 * @param {String}
 *            mimeType see
 * #Oskari.mapframework.mapmodule.VectorLayerPlugin.registerVectorFormats()
 * @param {String}
 *            projCode srs projection code
 * @param {String}
 *            op operation to perform
 */
function(mapLayer, features, mimeType, projCode, op) {
    this._creator = null;
    this._features = features;
    this._op = op;
    this._mapLayer = mapLayer;
    this._mimeType = mimeType;
    this._projCode = projCode;
}, {
    /** @static @property __name event name */
    __name : "FeaturesAvailableEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getFeatures
     * @return {Mixed} featuredata in #getMimeType format
     */
    getFeatures : function() {
        return this._features;
    },
    /**
     * @method getOp
     * @return {String} operation to perform
     */
    getOp : function() {
        return this._op;
    },
    /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.VectorLayer}
     * selected maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getMimeType
     * @return {String} see
     * Oskari.mapframework.mapmodule.VectorLayerPlugin.registerVectorFormats()
     */
    getMimeType : function() {
        return this._mimeType;
    },
    /**
     * @method getProjCode
     * @return {String} srs projection code
     */
    getProjCode : function() {
        return this._projCode;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.FeaturesGetInfoEvent
 *
 * Feature info event for #Oskari.mapframework.domain.VectorLayer.
 *
 * FIXME: this is used like a request with null and hardcoded values, maybe some
 * refactoring should be done
 * See Oskari.mapframework.request.common.GetFeatureInfoRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.FeaturesGetInfoEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.VectorLayer}
 *            mapLayer selected map layer
 * @param {Object}
 *            mapLayers always set to null? refactor?
 * @param {Number}
 *            lon longitude
 * @param {Number}
 *            lat latitude
 * @param {String}
 *            srsProjectionCode  srs projection code
 * @param {String}
 *            op  always set to "GetFeatureInfo"? TODO: refactor?
 */
function(mapLayer, mapLayers, lon, lat, projCode, op) {
    this._creator = null;
    this._lon = lon;
    this._lat = lat;
    this._mapLayer = mapLayer;
    this._mapLayers = mapLayers;
    this._projCode = projCode;
    this._op = op;
}, {
    /** @static @property __name event name */
    __name : "FeaturesGetInfoEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
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
     * @method
     * @return (String) always set to "GetFeatureInfo"?
     * TODO: refactor?
     */
    getOp : function() {
        return this._op;
    },
    /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.VectorLayer} selected map layer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getMapLayers
     * @return {Object} always null?
     * TODO: refactor?
     * @deprecated
     */
    getMapLayers : function() {
        return this._mapLayers;
    },
    /**
     * @method getProjCode
     * @return {String} srs projection code
     */
    getProjCode : function() {
        return this._projCode;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.AfterMapLayerAddEvent
 *
 * Notifies application bundles that a map layer has been added to selected
 * layers.
 * Triggers on Oskari.mapframework.request.common.AddMapLayerRequest
 * Opposite of Oskari.mapframework.event.common.AfterMapLayerRemoveEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapLayerAddEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer added map layer (matching one in MapLayerService)
 * @param {Boolean}
 *            keepLayersOrder should order of layers be reserved (optional,
 * defaults to false)
 * @param {Boolean}
 *            isBasemap (optional, defaults to false) 
 */
function(mapLayer, keepLayersOrder, isBasemap) {
    this._creator = null;
    this._mapLayer = mapLayer;
    this._keepLayersOrder = keepLayersOrder;

    if(isBasemap) {
        this._isBasemap = isBasemap;
    } else {
        this._isBasemap = false;
    }
}, {
    /** @static @property __name event name */
    __name : "AfterMapLayerAddEvent",

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
     *            added map layer (matching one in MapLayerService)
     */
    getMapLayer : function() {
        return this._mapLayer;
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
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.AfterMapLayerRemoveEvent
 *
 * Notifies application bundles that a map layer has been removed from selected
 * layers.
 * Triggers on Oskari.mapframework.request.common.RemoveMapLayerRequest
 * Opposite of Oskari.mapframework.event.common.AfterMapLayerAddEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapLayerRemoveEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer removed map layer (matching one in MapLayerService)
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterMapLayerRemoveEvent",
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
     *            added map layer (matching one in MapLayerService)
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
 * @class Oskari.mapframework.event.common.AfterGetFeatureInfoEvent
 *
 * Triggers on GetFeatureInfoRequest.
 * See Oskari.mapframework.request.common.GetFeatureInfoRequest and
 * Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterGetFeatureInfoEvent',

/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean} response
 * 			true if not a wfs layer and has selected layers e.g. we can expect some
 * response from the service in the following
 * Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent
 * @param {Boolean} wfsSelected
 * 			is a wfs layer selected
 */
function(response, wfsSelected) {
    this._creator = null;
    this._response = response;
    this._wfsSelected = wfsSelected;
}, {
    /** @static @property __name event name */
    __name : "AfterGetFeatureInfoEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getResponse
     * @return {Boolean} true if not a wfs layer and has selected layers e.g. we can expect some
	 * response from the service in the following
	 * Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent
     */
    getResponse : function() {
        return this._response;
    },
    /**
     * @method getResponse
     * @return {Boolean} is a wfs layer selected
     */
    isWfsSelected : function() {
        return this._wfsSelected;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.AfterMapMoveEvent
 *
 * Notifies application bundles that a map has moved.
 * See Oskari.mapframework.request.common.MapMoveRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapMoveEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} centerX
 *            longitude
 * @param {Number} centerY
 *            latitude
 * @param {Number} zoom
 *            map zoomlevel (0-12)
 * @param {Boolean} marker
 *            this should be removed, always sent as false
 * @param {Number} scale
 *            map scale
 */
function(centerX, centerY, zoom, marker, scale) {
    this._creator = null;

    this._centerX = centerX;
    this._centerY = centerY;
    this._zoom = zoom;
    this._marker = marker;
    this._scale = scale;
}, {
    /** @static @property __name event name */
    __name : "AfterMapMoveEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getCreator
     * @return {String} identifier for the event sender
     */
    getCreator : function() {
        return this._creator;
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
     * @return {Number} zoomlevel (0-12)
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method getMarker
     * @return {Boolean} this should be removed, always set to false
     * @deprecated use Oskari.mapframework.sandbox.Sandbox.getMap() ->
     * Oskari.mapframework.domain.Map.isMarkerVisible()
     */
    getMarker : function() {
        return this._marker;
    },
    /**
     * @method getScale
     * @return {Number} map scale
     */
    getScale : function() {
        return this._scale;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.MapMoveStartEvent
 *
 * Notifies application bundles that a map has began moving (is being dragged).
 * Oskari.mapframework.event.common.AfterMapMoveEvent is sent when dragging is
 * finished.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MapMoveStartEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} x
 *            longitude on drag start
 * @param {Number} y
 *            latitude on drag start
 */
function(x, y) {
    this._creator = null;
    this._x = x;

    this._y = y;

}, {

    /** @static @property __name event name */
    __name : "MapMoveStartEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getX
     * @return {Number} longitude on drag start
     */
    getX : function() {
        return this._x;
    },
    /**
     * @method getY
     * @return {Number} latitude on drag start
     */
    getY : function() {
        return this._y;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent
 * 
 * Triggers on Oskari.mapframework.request.common.ShowMapLayerInfoRequest.
 * Populates the layer reference matching the id in request.
 * FIXME: propably unnecessary step, this could be completed with using only the
 * request
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent',
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
    __name : "AfterShowMapLayerInfoEvent",
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
     * selected maplayer
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
 * @class Oskari.mapframework.event.common.AfterDisableMapKeyboardMovementEvent
 *
 * Triggers on requests for keyboard control on map to be disabled.
 * Opposite of
 * Oskari.mapframework.event.common.AfterEnableMapKeyboardMovementEvent
 * See Oskari.mapframework.request.common.DisableMapKeyboardMovementRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterDisableMapKeyboardMovementEvent',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name event name */
    __name : "AfterDisableMapKeyboardMovementEvent",
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
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.AfterEnableMapKeyboardMovementEvent
 *
 * Triggers on requests for keyboard control on map to be enabled.
 * Opposite of
 * Oskari.mapframework.event.common.AfterDisableMapKeyboardMovementEvent
 * See Oskari.mapframework.request.common.EnableMapKeyboardMovementRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterEnableMapKeyboardMovementEvent',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name event name */
    __name : "AfterEnableMapKeyboardMovementEvent",
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
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.AfterHideMapMarkerEvent
 *
 * Triggers on Oskari.mapframework.request.common.HideMapMarkerRequest
 * FIXME: propably an unnecessary step that could be handled with the request
 * directly
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterHideMapMarkerEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name event name */
    __name : "AfterHideMapMarkerEvent",
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
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.common.MouseHoverEvent
 *
 * Notification about mouse hovering over the map
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MouseHoverEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number}
 *            lon longitude on mouse location
 * @param {Number}
 *            lat latitude on mouse location
 */
function(lon, lat) {
    this._creator = null;

    this._lon = lon;

    this._lat = lat;

}, {
    /** @static @property __name event name */
    __name : "MouseHoverEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLon
     * @return {Number} longitude on mouse location
     */
    getLon : function() {
        return this._lon;
    },
    /**
     * @method getLon
     * @return {Number} latitude on mouse location
     */
    getLat : function() {
        return this._lat;
    },
    /**
     * @method set
     * 
     * Update mouse location on event
     * 
     * @param {Number}
     *            lon longitude on mouse location
     * @param {Number}
     *            lat latitude on mouse location
     */
    set : function(lon, lat) {

        this._lon = lon;
        this._lat = lat;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.mapframework.event.action.ActionStatusesChangedEvent
 * This event tells that some kind of long running action was started or
 * finished. It can be used to notify e.g. that loading of WMS layer has started
 * or finished loading.
 *
 * This is triggered when ever the core processes
 * Oskari.mapframework.request.action.ActionStartRequest or
 * Oskari.mapframework.request.action.ActionReadyRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.action.ActionStatusesChangedEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            currentlyRunningActionsDescriptions desriptions for the currently running tasks
 * See Oskari.mapframework.request.action.ActionStartRequest
 */
function(currentlyRunningActionsDescriptions) {
    this._creator = null;
    this._currentlyRunningActionsDescriptions = currentlyRunningActionsDescriptions;

}, {
    /** @static @property __name event name */
    "__name" : "ActionStatusesChangedEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getCurrentlyRunningActionsDescriptions
     * @return {String} descriptions for currently running actions
     */
    getCurrentlyRunningActionsDescriptions : function() {
        return this._currentlyRunningActionsDescriptions;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
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