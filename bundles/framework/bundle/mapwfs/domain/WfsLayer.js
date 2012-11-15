/**
 * @class Oskari.framework.domain.WfsLayer
 *
 * MapLayer of type WFS
 */
Oskari.clazz.define('Oskari.mapframework.domain.WfsLayer',

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    /* Internal id for this wfs layer */
    this._id = null;

    /* either NORMAL_LAYER or BASE_LAYER */
    this._type = null;

    /* opacity from 0 to 100 */
    this._opacity = null;

    this._inspireName = null;

    this._organizationName = null;

    this._dataUrl = null;

    /* is this layer queryable (GetFeatureInfo) boolean */
    this._queryable = true;
    
    /*
     * Array of sublayers. Notice that only type BASE_LAYER can
     * have sublayers.
     */
    this._subLayers = [];

    /* Description for layer */
    this._description = null;

    /* Name of this layer */
    this._name = null;
    
    /* is layer visible */
    this._visible = null;
    
    /* link to metadata service */
    this._metadataIdentifier = null;

    /* Max scale for layer */
    this._maxScale = null;

    /* Min scale for layer */
    this._minScale = null;

    this._orderNumber = null;

    this._featureInfoEnabled = true;

	// f.ex. permissions.publish
	/* values are 
	-1 not publishable
	0 need to login to publish
	1 can be published
	2 can be published, but current user doesn't have the needed priviledges
	 */
    this._permissions = {};
    // if given, tells where the layer has content
    // array of Openlayers.Geometry[] objects if already processed from _geometryWKT
    this._geometry = [];
    // wellknown text for polygon geometry
    this._geometryWKT = null;
    
    this._backendStatus = null;
}, {
    /**
     * @method setGeometryWKT
     * Set geometry as wellknown text
     * @param {String} value 
     * 			WKT geometry
     */
    setGeometryWKT : function(value) {
        this._geometryWKT = value;
    },
    /**
     * @method getGeometryWKT
     * Get geometry as wellknown text
     * @return {String} WKT geometry
     */
    getGeometryWKT : function() {
        return this._geometryWKT;
    },
    /**
     * @method setGeometry
     * @param {OpenLayers.Geometry.Geometry[]} value 
     * 			array of WKT geometries or actual OpenLayer geometries
     */
    setGeometry : function(value) {
        this._geometry = value;
    },
    /**
     * @method getGeometry
     * @return {OpenLayers.Geometry.Geometry[]}  
     * 			array of WKT geometries or actual OpenLayer geometries
     */
    getGeometry : function() {
        return this._geometry;
    },
    /**
     * @method setQueryable
     * True if we should call GFI on the layer
     * @param {Boolean} queryable
     */
    setQueryable : function(queryable) {
        this._queryable = queryable;
    },
    /**
     * @method getQueryable
     * True if we should call GFI on the layer
     * @param {Boolean} queryable
     */
    getQueryable : function() {
        return this._queryable;
    },
    /**
     * @method addPermission
     * @param {String} action 
     * 			action key that we want to add permission setting for
     * @param {String} permission 
     * 			actual permission setting for action
     */
    addPermission : function(action, permission) {
        this._permissions[action] = permission;
    },
    /**
     * @method removePermission
     * @param {String} action 
     * 			action key from which permission setting should be removed
     */
    removePermission : function(action) {
        this._permissions[action] = null;
    },
    /**
     * @method getPermission
     * @param {String} action 
     * 			action key for which permission we want
     * @return {String} permission setting for given action
     */
    getPermission : function(action) {
        return this._permissions[action];
    },

    /**
     * @method setId
     * @param {String} id
     * 			unique identifier for map layer used to reference the layer internally
     * (e.g. MapLayerService)
     */
    setId : function(id) {
        this._id = id;
    },
    /**
     * @method getId
     * @return {String}  
     * 			unique identifier for map layer used to reference the layer internally
     * (e.g. MapLayerService)
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method setName
     * @param {String} name 
     * 			name for the maplayer that is shown in UI
     */
    setName : function(name) {
        this._name = name;
    },
    /**
     * @method getName
     * @return {String} maplayer UI name
     */
    getName : function() {
        return this._name;
    },
    /**
     * @method setType
     * @param {String} type 
     * 			layer type (e.g. NORMAL, BASE)
     * 
     * Not as type WFS or Vector but base or normal layer. 
     * See #setAsBaseLayer() and #setAsNormalLayer()
     */
    setType : function(type) {
        this._type = type;
    },
    /**
     * @method getType
     * @return {String} maplayer type (BASE/NORMAL)
     */
    getType : function() {
        return this._type;
    },
    /**
     * @method setOpacity
     * @param {Number} opacity 
     * 			0-100 in percents
     */
    setOpacity : function(opacity) {
        this._opacity = opacity;
    },
    /**
     * @method getOpacity
     * @return {Number} opacity 
     * 			0-100 in percents
     */
    getOpacity : function() {
        return this._opacity;
    },
    /**
     * @method setDataUrl
     * @param {String} param  
     * 			URL string used to show more info about the layer
     */
    setDataUrl : function(param) {
        this._dataUrl = param;
    },
    /**
     * @method getDataUrl
     * @return {String} URL string used to show more info about the layer
     */
    getDataUrl : function() {
        return this._dataUrl;
    },
    /**
     * @method setOrganizationName
     * @param {String} param  
     * 			organization name under which the layer is listed in UI
     */
    setOrganizationName : function(param) {
        this._organizationName = param;
    },
    /**
     * @method getOrganizationName
     * @return {String} organization name under which the layer is listed in UI
     */
    getOrganizationName : function() {
        return this._organizationName;
    },
    /**
     * @method setInspireName
     * @param {String} param  
     * 			inspire theme name under which the layer is listed in UI
     */
    setInspireName : function(param) {
        this._inspireName = param;
    },
    /**
     * @method getInspireName
     * @return {String} inspire theme name under which the layer is listed in UI
     */
    getInspireName : function() {
        return this._inspireName;
    },
    /**
     * @method setFeatureInfoEnabled
     * @return {Boolean} featureInfoEnabled true to enable featuretype grid
     */
    setFeatureInfoEnabled : function(featureInfoEnabled) {
        this._featureInfoEnabled = featureInfoEnabled;
    },
    /**
     * @method isFeatureInfoEnabled
     * @return {Boolean} true if featuretype grid should be enabled
     */
    isFeatureInfoEnabled : function() {
        if(this._featureInfoEnabled === true) {
            return true;
        }
        return false;
    },
    /**
     * @method setDescription
     * @param {String} description  
     * 			map layer description text
     */
    setDescription : function(description) {
        this._description = description;
    },
    /**
     * @method getDescription
     * @return {String} map layer description text
     */
    getDescription : function() {
        return this._description;
    },
    
    
    
    /**
     * @method addSubLayer
     * @param {Oskari.mapframework.domain.WfsLayer} map layer
     * 			actual sub map layer that is used for a given scale range (only for
     * base layers)
     *
     * If layer has sublayers, it is basically a "metalayer" for maplayer ui
     * purposes and actual map images to show are done with sublayers
     */
    addSubLayer : function(layer) {
        this._subLayers.push(layer);
    },
    /**
     * @method getSubLayers
     * @return {Oskari.mapframework.domain.WfsLayer[]} array of sub map layers
     *
     * If layer has sublayers, it is basically a "metalayer" for maplayer ui
     * purposes and actual map images to show are done with sublayers
     */
    getSubLayers : function() {
        return this._subLayers;
    },
    /**
     * @method setMaxScale
     * @param {Number} maxScale
     * 			largest scale when the layer is shown (otherwise not shown in map and
     * "greyed out"/disabled in ui)
     */
    setMaxScale : function(maxScale) {
        this._maxScale = maxScale;
    },
    /**
     * @method getMaxScale
     * @return {Number} 
     * 			largest scale when the layer is shown (otherwise not shown in map and
     * "greyed out"/disabled in ui)
     */
    getMaxScale : function() {
        return this._maxScale;
    },
    /**
     * @method setMinScale
     * @param {Number} minScale
     * 			smallest scale when the layer is shown (otherwise not shown in map and
     * "greyed out"/disabled in ui)
     */
    setMinScale : function(minScale) {
        this._minScale = minScale;
    },
    /**
     * @method getMinScale
     * @return {Number} 
     * 			smallest scale when the layer is shown (otherwise not shown in map and
     * "greyed out"/disabled in ui)
     */
    getMinScale : function() {
        return this._minScale;
    },
    /**
     * @method setAsBaseLayer
     * sets layer type to BASE_LAYER
     */
    setAsBaseLayer : function() {
        this._type = "BASE_LAYER";
    },
    /**
     * @method setAsNormalLayer
     * sets layer type to NORMAL_LAYER
     */
    setAsNormalLayer : function() {
        this._type = "NORMAL_LAYER";
    },
    /**
     * @method setOrderNumber
     * @param {Number} orderNumber
     * 
     * TODO: check if actually {Number}
     */
    setOrderNumber : function(orderNumber) {
        this._orderNumber = orderNumber;
    },
    /**
     * @method getOrderNumber
     * @return {Number} orderNumber
     * TODO: check if actually {Number}
     */
    getOrderNumber : function() {
        return this._orderNumber;
    },
    /**
     * @method isBaseLayer
     * @return {Boolean} true if this is a base layer (=has sublayers)
     */
    isBaseLayer : function() {
        return this._type === "BASE_LAYER";
    },
    /**
     * @method isGroupLayer
     * @return {Boolean} true if this is a group layer (=has sublayers)
     */
    isGroupLayer : function() {
        return false;
    },
    /**
     * @method isInScale
     * @param {Number} scale scale to compare to
     * @return {Boolean} true if given scale is between this layers min/max scales. Always return true for base-layers.
     */
    isInScale : function(scale) {
        var _return = this.isBaseLayer();
        if(!scale) {
	        var sandbox = Oskari.$().sandbox;
	        scale = sandbox.getMap().getScale();
        }

        // Check layer scales only normal layers
        if(!this.isBaseLayer()) {
            if(scale > this.getMaxScale() && scale < this.getMinScale()) {
                _return = true;
            }
        }
        return _return;
    },
    /**
     * @method isVisible
     * @return {Boolean} true if this is should be shown
     */
    isVisible : function() {
        return this._visible === true;
    },
    /**
     * @method setVisible
     * @param {Boolean} visible true if this is should be shown
     */
    setVisible : function(visible) {
        this._visible = visible;
    },
    /**
     * @method isLayerOfType
     * @param {String} flavour layer type to check against. A bit misleading since setType is base/normal, this is used to check if the layer is a WFS layer.
     * @return {Boolean} true if flavour is WFS or wfs
     */
    isLayerOfType : function(flavour) {
        return flavour == 'WFS' || flavour == 'wfs';
    },
    
    /**
     * @method getMetadataIdentifier
     */
    getMetadataIdentifier: function() {
    	return this._metadataIdentifier;
    },
    /**
     * @method setMetadataIdentifier
     */
    setMetadataIdentifier: function(metadataid) {
    	this._metadataIdentifier = metadataid;
    },
    /**
     * @method getBackendStatus
     */
    getBackendStatus: function() {
    	return this._backendStatus;
    },
    /**
     * @method setBackendStatus
     */
    setBackendStatus: function(backendStatus) {
    	this._backendStatus = backendStatus;
    }
});
