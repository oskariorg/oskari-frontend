/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.domain.WmsLayer
 *
 * MapLayer of type WMS
 */
Oskari.clazz.define('Oskari.mapframework.domain.WmsLayer', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    /* Internal id for this map layer */
    this._id = null;

    /* Name of this layer */
    this._name = null;

    /* Name of wms layer */
    this._wmsLayerName = null;

    this._inspireName = null;

    this._organizationName = null;

    this._dataUrl = null;

    /* either NORMAL_LAYER or BASE_LAYER */
    this._type = null;
    
    /* modules can "tag" the layers with this for easier reference */
    this._metaType = null;
    

    /* opacity from 0 to 100 */
    this._opacity = null;

    /* is it possible to ask for feature info */
    this._featureInfoEnabled = null;

    /*
     * Array of sublayers. Notice that only type BASE_LAYER can
     * have sublayers.
     */
    this._subLayers = [];

    /* Array of styles that this layer supports */
    this._styles = [];

    /* Description for layer */
    this._description = null;

    /* Array of wms urls for this layer */
    this._wmsUrls = [];

    /* dataurl */
    this._dataUrl = null;

    /* Legend image location */
    this._legendImage = null;

    /* Max scale for layer */
    this._maxScale = null;

    /* Min scale for layer */
    this._minScale = null;

    /* is this layer queryable (GetFeatureInfo) boolean */
    this._queryable = null;

    /* Currently selected style */
    this._currentStyle = null;

    /* is layer visible */
    this._visible = null;

    this._queryFormat = null;

    this._orderNumber = null;
    
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
    setQueryFormat : function(queryFormat) {
        this._queryFormat = queryFormat;
    },
    getQueryFormat : function() {
        return this._queryFormat;
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
     * 			layer type (e.g. NORMAL, BASE, GROUP)
     * 
     * Not as type WMS or Vector but base or normal layer. 
     * See #setAsBaseLayer(), #setAsGroupLayer() and #setAsNormalLayer()
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
     * @return {Boolean} featureInfoEnabled true to enable feature info functionality
     */
    setFeatureInfoEnabled : function(featureInfoEnabled) {
        this._featureInfoEnabled = featureInfoEnabled;
    },
    /**
     * @method isFeatureInfoEnabled
     * @return {Boolean} true if feature info functionality should be enabled
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
     * @param {Oskari.mapframework.domain.WmsLayer} map layer
     * 			actual sub map layer that is used for a given scale range (only for
     * base & group layers)
     *
     * If layer has sublayers, it is basically a "metalayer" for maplayer ui
     * purposes and actual map images to show are done with sublayers
     */
    addSubLayer : function(layer) {
        this._subLayers.push(layer);
    },
    /**
     * @method getSubLayers
     * @return {Oskari.mapframework.domain.WmsLayer[]} array of sub map layers
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
    
    /* 
     * -------------------------------------------------------
     * ------------ WMS specific -----------------------------
     * ------------------------------------------------------- 
     */
    /**
     * @method setLegendImage
     * @return {String} legendImage URL to a legend image
     */
    setLegendImage : function(legendImage) {
        this._legendImage = legendImage;
    },
    /**
     * @method getLegendImage
     * @return {String} URL to a legend image
     */
    getLegendImage : function() {
        return this._legendImage;
    },
    /**
     * @method getLegendImage
     * @return {Boolean} true if layer has a legendimage or its styles have legend images
     */
    hasLegendImage : function() {
    	
        if (this._legendImage) {
        	return true;
        } else { 
        	for(var i = 0; i < this._styles.length; ++i) {
		        if(this._styles[i].getLegend()) {
		            return true;
		        } 
	        }
        }
        return false;
    },
    /**
     * @method setQueryable
     * @param {Boolean} queryable
     * TODO: check where this is used
     */
    setQueryable : function(queryable) {
        this._queryable = queryable;
    },
    /**
     * @method getQueryable
     * @param {Boolean} queryable
     * TODO: check where this is used
     */
    getQueryable : function() {
        return this._queryable;
    },
    /**
     * @method addWmsUrl
     * @param {String} wmsUrl
     * Apppends the url to layer array of wms image urls
     */
    addWmsUrl : function(wmsUrl) {
        this._wmsUrls.push(wmsUrl);
    },
    /**
     * @method getWmsUrls
     * @return {String[]} 
     * Gets array of layer wms image urls
     */
    getWmsUrls : function() {
        return this._wmsUrls;
    },
    /**
     * @method addStyle
     * @param {Oskari.mapframework.domain.Style} style
     * adds style to layer 
     */
    addStyle : function(style) {
        this._styles.push(style);
    },
    /**
     * @method getStyles
     * @return {Oskari.mapframework.domain.Style[]} 
     * Gets layer styles
     */
    getStyles : function() {
        return this._styles;
    },
    /**
     * @method selectStyle
     * @param {String} styleName
     * Selects a #Oskari.mapframework.domain.Style with given name as #getCurrentStyle. 
     * If style is not found, assigns an empty #Oskari.mapframework.domain.Style to #getCurrentStyle
     */
    selectStyle : function(styleName) {
        var style = null;
        // Layer have styles        
        if(this._styles.length > 0) {
            // There is default style defined
            if(styleName !== "") {
                for(var i = 0; i < this._styles.length; i++) {
                    style = this._styles[i];
                    if(style.getName() == styleName) {
                        this._currentStyle = style;
                        return;
                    }
                }
            }
            // There is not default style defined
            else {
                //var style =
                // Oskari.clazz.create('Oskari.mapframework.domain.Style');

                // Layer have more than one style, set first
                // founded style to default
                // Because of layer style error this if clause
                // must compare at there is more than one style.
                if(this._styles.length > 1) {
                    this._currentStyle = this._styles[0];
                }
                // Layer have not styles, add empty style to
                // default
                else {
                    style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
                    style.setName("");
                    style.setTitle("");
                    style.setLegend("");
                    this._currentStyle = style;
                }

                return;
            }
        }
        // Layer have not styles
        else {
            style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
            style.setName("");
            style.setTitle("");
            style.setLegend("");
            this._currentStyle = style;
            return;
        }

        style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
        style.setName("");
        style.setTitle("");
        style.setLegend("");
        this._currentStyle = style;
    },
    /**
     * @method getCurrentStyle
     * @return {Oskari.mapframework.domain.Style} current style
     */
    getCurrentStyle : function() {
        return this._currentStyle;
    },
    /**
     * @method setWmsName
     * @param {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWmsName : function(wmsName) {
        this._wmsName = wmsName;
    },
    /**
     * @method getWmsName
     * @return {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWmsName : function() {
        return this._wmsName;
    },
    
    /**
     * @method setMetaType
     * @param {String} type used to group layers by f.ex. functionality. 
     * Layers can be fetched based on metatype f.ex. 'myplaces'
     */
    setMetaType : function(type) {
        this._metaType = type;
    },
    /**
     * @method getMetaType
     * @return {String} type used to group layers by f.ex. functionality. 
     * Layers can be fetched based on metatype f.ex. 'myplaces'
     */
    getMetaType : function() {
        return this._metaType;
    },
    /**
     * @method setAsGroupLayer
     * sets layer type to GROUP_LAYER
     */
    setAsGroupLayer : function() {
        this._type = "GROUP_LAYER";
    },
    /**
     * @method isGroupLayer
     * @return {Boolean} true if this is a group layer (=has sublayers)
     */
    isGroupLayer : function() {
        return this._type === "GROUP_LAYER";
    },
    /* 
     * -------------------------------------------------------
     * ------------ /WMS specific -----------------------------
     * ------------------------------------------------------- 
     */
   
    /**
     * @method isBaseLayer
     * @return {Boolean} true if this is a base layer (=has sublayers)
     */
    isBaseLayer : function() {
        return this._type === "BASE_LAYER";
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
     * @method isLayerOfType
     * @param {String} flavour layer type to check against. A bit misleading since setType is base/group/normal, this is used to check if the layer is a WMS layer.
     * @return {Boolean} true if flavour is WMS or wms
     */
    isLayerOfType : function(flavour) {
        return flavour === 'WMS' || flavour === 'wms';
    }
});
/**
 * @class Oskari.mapframework.domain.WfsLayer
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
    }
});
/**
 * @class Oskari.mapframework.domain.VectorLayer
 *
 * MapLayer of type Vector
 */
Oskari.clazz.define('Oskari.mapframework.domain.VectorLayer',

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
    /*
     * Array of sublayers. Notice that only type BASE_LAYER can
     * have sublayers.
     */
    this._subLayers = [];

    /* Description for layer */
    this._description = null;

    /* Name of this layer */
    this._name = null;

    /* Max scale for layer */
    this._maxScale = null;

    /* Min scale for layer */
    this._minScale = null;

    /* style definition for this layer */
    this._sldspec = null;

    this._orderNumber = null;

    this._featureInfoEnabled = true;
    
    /* modules can "tag" the layers with this for easier reference */
    this._metaType = null;

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
    
    this._visible = true;
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
     * Not as type WMS or Vector but base or normal layer.
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
     * @return {Boolean} featureInfoEnabled true to enable feature info
     * functionality
     */
    setFeatureInfoEnabled : function(featureInfoEnabled) {
        this._featureInfoEnabled = featureInfoEnabled;
    },
    /**
     * @method isFeatureInfoEnabled
     * @return {Boolean} true if feature info functionality should be enabled
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
     * @param {Oskari.mapframework.domain.VectorLayer} map layer
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
     * @return {Oskari.mapframework.domain.VectorLayer[]} array of sub map layers
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
     * @method setStyledLayerDescriptor
     * @param {Object} sld
     * 
     * TODO: check type for param
     */
    setStyledLayerDescriptor : function(sld) {
        this._sldspec = sld;
    },
    /**
     * @method getStyledLayerDescriptor
     * @return {Object} sld
     * 
     * TODO: check type for return value
     */
    getStyledLayerDescriptor : function() {
        return this._sldspec;
    },
    /**
     * @method isBaseLayer
     * @return {Boolean} true if this is a base layer (=has sublayers)
     * @throws exception if not base or normal layer
     */
    isBaseLayer : function() {
        if(this._type == "BASE_LAYER") {
            return true;
        } else if(this._type == "NORMAL_LAYER") {
            return false;
        } else {
            throw "We found a layer that is not a " + "NORMAL_LAYER or a BASE_LAYER. " + "Type '" + this._type + "' is not correct!";
        }
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
        return this._visible;
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
     * @param {String} flavour layer type to check against. A bit misleading since setType is base/normal, this is used to check if the layer is a vector layer.
     * @return {Boolean} true if flavour is VECTOR or vector
     */
    isLayerOfType : function(flavour) {
        return flavour == 'VECTOR' || flavour == 'vector';
    },
    
    /**
     * @method setMetaType
     * @param {String} type used to group layers by f.ex. functionality. 
     * Layers can be fetched based on metatype f.ex. 'myplaces'
     */
    setMetaType : function(type) {
        this._metaType = type;
    },
    /**
     * @method getMetaType
     * @return {String} type used to group layers by f.ex. functionality. 
     * Layers can be fetched based on metatype f.ex. 'myplaces'
     */
    getMetaType : function() {
        return this._metaType;
    },
    
    /**
     * @method getStyles
     */
    getStyles: function() {
    	return [];
    }
});
/**
 * @class Oskari.mapframework.domain.Map
 *
 * Represents the values of the map implementation (openlayers)
 * Map module updates this domain object before sending out MapMoveEvents using
 * the set methods.
 * Set methods dont control the map in anyway so this is not the
 * way to control the map. This is only to get map values without openlayers
 * dependency.
 */
Oskari.clazz.define('Oskari.mapframework.domain.Map',

/** 
 * @method create called automatically on construction
 * @static
 */
function() {

    /** @property {Number} _centerX map longitude (float) */
    this._centerX = null;

    /** @property {Number} _centerY map latitude (float) */
    this._centerY = null;

    /** @property {Number} _zoom map zoom level (0-12) */
    this._zoom = null;

    /** @deprecated not being updated */
    this._mousePositionX = null;

    /** @deprecated not being updated */
    this._mousePositionY = null;

    /** @property {Boolean} _mapKeyboardMovementsEnabled true if keyboard should
     * move map (used to disable map movement when focused on textfields) */
    this._mapKeyboardMovementsEnabled = null;

    /** @property {Number} _scale map scale (float) */
    this._scale = null;

    /** @property {OpenLayers.Bounds} _bbox map bounding box */
    this._bbox = null;

    /** @property {Boolean} true if marker is being shown */
    this._markerVisible = null;

    /** @property {Number} width map window width */
    this.width = null;

    /** @property {Number} height  map window height */
    this.height = null;

    /* added 2011-09-02 */
    /** @property {Number} resolution current map resolution (float) */
    this.resolution = null;
    /**
     * @property {OpenLayers.Bounds} extent
     * current map extent
     *  { left: NaN, top: NaN, right: NaN, bottom: NaN }
     */
    this.extent = null;
    /**
     * @property {OpenLayers.Bounds} maxExtent
     * maximumExtent configured for the map
     *  { left: NaN, top: NaN, right: NaN, bottom: NaN }
     */
    this.maxExtent = null;

    /** @property {Boolean} _isMoving true when map is being dragged */
    this._isMoving = false;

    /**
     * @property {Oskari.mapframework.gridcalc.TileQueue} tileQueue
     * Tilequeue for TilesGridPlugin
     */
    this.tileQueue = null;

}, {
    /**
     * @method moveTo
     * Sets new center and zoomlevel for map domain (NOTE: DOESN'T ACTUALLY MOVE
     * THE MAP)
     *
     * @param {Number}
     *            x
     * @param {Number}
     *            y
     * @param {Number}
     *            zoom map zoomlevel
     */
    moveTo : function(x, y, zoom) {
        this._centerX = x;
        this._centerY = y;
        this._zoom = zoom;
    },
    /**
     * @method setMoving
     * Sets true if map is moving currently
     *
     * @param {Boolean}
     *            movingBln true if map is being moved currently
     */
    setMoving : function(movingBln) {
        this._isMoving = movingBln;
    },
    /**
     * @method isMoving
     * True if map is moving currently (is being dragged)
     *
     * @return {Boolean}
     *            true if map is being moved currently
     */
    isMoving : function() {
        return this._isMoving;
    },
    /**
     * @method getX
     * Map center coordinate - longitude
     *
     * @return {Number}
     *            map center x
     */
    getX : function() {
        return this._centerX;
    },
    /**
     * @method getY
     * Map center coordinate - latitude
     *
     * @return {Number}
     *            map center y
     */
    getY : function() {
        return this._centerY;
    },
    /**
     * @method getZoom
     * Map center zoom level (0-12)
     *
     * @return {Number}
     *            map zoom level
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method updateMousePosition
     *
     * Updates the mouse position in map domain
     * @param {Number} x mouseposition x coordinate
     * @param {Number} y mouseposition y coordinate
     * @deprecated
     */
    updateMousePosition : function(x, y) {
        this._mousePositionX = x;
        this._mousePositionY = y;
    },
    /**
     * @method getMousePositionX
     *
     * Returns the mouse position coordinate (not being updated)
     * @return {Number}
     *           mouse position coordinate x
     * @deprecated
     */
    getMousePositionX : function() {
        return this._mousePositionX;
    },
    /**
     * @method getMousePositionY
     *
     * Returns the mouse position coordinate (not being updated)
     * @return {Number}
     *           mouse position coordinate y
     * @deprecated
     */
    getMousePositionY : function() {
        return this._mousePositionY;
    },
    /**
     * @method setMapKeyboardMovementsEnabled
     * true if map keyboard movement should be enabled
     *
     * @param {Boolean} value
     *            true if map keyboard movement should be enabled
     */
    setMapKeyboardMovementsEnabled : function(value) {
        this._mapKeyboardMovementsEnabled = value;
    },
    /**
     * @method getMapKeyboardMovementsEnabled
     * true if map keyboard movement should be enabled
     *
     * @return {Boolean}
     *            true if map keyboard movement should be enabled
     */
    getMapKeyboardMovementsEnabled : function() {
        return this._mapKeyboardMovementsEnabled;
    },
    /**
     * @method setScale
     * Scale in map implementation (openlayers)
     *
     * @param {Number} scale
     *            map scale(float)
     */
    setScale : function(scale) {
        this._scale = scale;
    },
    /**
     * @method getScale
     * Scale in map implementation (openlayers)
     *
     * @return {Number}
     *            map scale (float)
     */
    getScale : function() {
        return this._scale;
    },
    /**
     * @method setBbox
     * Bounding box in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} bbox
     *            bounding box
     */
    setBbox : function(bbox) {
        this._bbox = bbox;
    },
    /**
     * @method getBbox
     * Bounding box in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            bounding box
     */
    getBbox : function() {
        return this._bbox;
    },
    /**
     * @method setMarkerVisible
     * true if marker is shown on map
     *
     * @param {Boolean} markerVisible
     *            true if marker is shown on map
     */
    setMarkerVisible : function(markerVisible) {
        this._markerVisible = markerVisible;
    },
    /**
     * @method isMarkerVisible
     * true if marker is shown on map
     *
     * @return {Boolean}
     *            true if marker is shown on map
     */
    isMarkerVisible : function() {
        if(this._markerVisible == true) {
            return true;
        }
        return false;
    },
    /**
     * @method setWidth
     * width of map window
     *
     * @param {Number} width
     *            width
     */
    setWidth : function(width) {
        this.width = width;
    },
    /**
     * @method getWidth
     * width of map window
     *
     * @return {Number}
     *            width
     */
    getWidth : function() {
        return this.width;
    },
    /**
     * @method setHeight
     * height of map window
     *
     * @param {Number} height
     *            height
     */
    setHeight : function(height) {
        this.height = height;
    },
    /**
     * @method getHeight
     * height of map window
     *
     * @return {Number}
     *            height
     */
    getHeight : function() {
        return this.height;
    },
    /**
     * @method setResolution
     * resolution in map implementation (openlayers)
     *
     * @param {Number} r
     *            resolution (float)
     */
    setResolution : function(r) {
        this.resolution = r;
    },
    /**
     * @method getResolution
     * resolution in map implementation (openlayers)
     *
     * @return {Number}
     *            resolution (float)
     */
    getResolution : function() {
        return this.resolution;
    },
    /**
     * @method setExtent
     * Extent in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} e
     *            extent
     */
    setExtent : function(e) {
        this.extent = e;
        /* e is this kind of oject  { left: l, top: t, right: r, bottom: b }*/;
    },
    /**
     * @method getExtent
     * Extent in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            extent
     */
    getExtent : function() {
        return this.extent;
    },
    /**
     * @method setMaxExtent
     * Max Extent in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} me
     *            max extent
     */
    setMaxExtent : function(me) {
        this.maxExtent = me;
        /* me is this kind of oject { left: l, top: t, right: r, bottom: b }*/;
    },
    /**
     * @method getMaxExtent
     * Max Extent in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            max extent
     */
    getMaxExtent : function() {
        return this.maxExtent;
    },
    /**
     * @method getTileQueue
     * Tilequeue for TilesGridPlugin
     *
     * @return {Oskari.mapframework.gridcalc.TileQueue}
     *            tile queue
     */
    getTileQueue : function() {
        return this.tileQueue;
    },
    /**
     * @method setTileQueue
     * Tilequeue for TilesGridPlugin
     *
     * @param {Oskari.mapframework.gridcalc.TileQueue} tg
     *            tile queue
     */
    setTileQueue : function(tg) {
        this.tileQueue = tg;
    }
});
/**
 * @class Oskari.mapframework.domain.Style
 *
 * Map Layer Style
 */
Oskari.clazz.define('Oskari.mapframework.domain.Style',

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    /** style name */
    this._name = null;

    /** style title */
    this._title = null;

    /** style legend */
    this._legend = null;
}, {

    /**
     * @method setName
     * Sets name for the style
     *
     * @param {String} name
     *            style name
     */
    setName : function(name) {
        this._name = name
    },
    /**
     * @method getName
     * Gets name for the style
     *
     * @return {String} style name
     */
    getName : function() {
        return this._name;
    },
    /**
     * @method setTitle
     * Sets title for the style
     *
     * @param {String} title
     *            style title
     */
    setTitle : function(title) {
        this._title = title;
    },
    /**
     * @method getTitle
     * Gets title for the style
     *
     * @return {String} style title
     */
    getTitle : function() {
        return this._title;
    },
    /**
     * @method setLegend
     * Sets legendimage URL for the style
     *
     * @param {String} legend
     *            style legend
     */
    setLegend : function(legend) {
        this._legend = legend;
    },
    /**
     * @method getLegend
     * Gets legendimage URL for the style
     *
     * @return {String} style legend
     */
    getLegend : function() {
        return this._legend;
    }
});
/**
 * @class Oskari.mapframework.domain.Polygon
 *
 * Used by Oskari.mapframework.mapmodule.SketchLayerPlugin that does some weird
 * stuff like setting id -1 OR -2.
 * Sent in request that is handled by core which in turn sends an after-event
 * that isn't listened in any code. 
 * 
 * TODO: move to plugins files?
 * @deprecated
 */
Oskari.clazz.define('Oskari.mapframework.domain.Polygon',

/** 
 * @method create called automatically on construction
 * @static
 */
function() {

    this._id = null;

    this._description = null;

    this._top = null;

    this._left = null;

    this._right = null;

    this._bottom = null;

    this._link = null;

    this._color = "#684781";

    this._display = "";

    this._zoomToExtent = false;
},
{

    /**
     * @method setId
     * Sets internal id for this polygon
     *
     * @param {Number} id
     *            internal id
     */
    setId : function(id) {
        this._id = id;
    },
    /**
     * @method getId
     * Gets internal id for this polygon
     *
     * @return {Number}
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method setDescription
     * Sets description for the polygon
     *
     * @param {String} description
     *            description
     */
    setDescription : function(description) {
        this._description = description;
    },
    /**
     * @method getDescription
     * Gets description for the polygon
     *
     * @return {String}
     */
    getDescription : function() {
        return this._description;
    },
    /**
     * @method setTop
     * Sets north latitude for the polygon
     *
     * @param {Number} top
     *            top latitude
     */
    setTop : function(top) {
        this._top = top;
    },
    /**
     * @method getTop
     * Gets north latitude for the polygon
     *
     * @return {Number}  top latitude
     */
    getTop : function() {
        return this._top;
    },
    /**
     * @method setLeft
     * Sets east longitude for the polygon
     *
     * @param {Number} left
     *            east longitude
     */
    setLeft : function(left) {
        this._left = left;
    },
    /**
     * @method getLeft
     * Gets east longitude for the polygon
     *
     * @return {Number}  east longitude
     */
    getLeft : function() {
        return this._left;
    },
    /**
     * @method setBottom
     * Sets south latitude for the polygon
     *
     * @param {Number} top
     *            bottom latitude
     */
    setBottom : function(bottom) {
        this._bottom = bottom;
    },
    /**
     * @method getBottom
     * Gets south latitude for the polygon
     *
     * @return {Number}  south latitude
     */
    getBottom : function() {
        return this._bottom;
    },
    /**
     * @method setRight
     * Sets west longitude for the polygon
     *
     * @param {Number} right
     *            west longitude
     */
    setRight : function(right) {
        this._right = right;
    },
    /**
     * @method getRight
     * Gets west longitude for the polygon
     *
     * @return {Number}  west longitude
     */
    getRight : function() {
        return this._right;
    },
    /**
     * @method setLink
     * @deprecated not used?
     *
     * @param {String} link
     */
    setLink : function(link) {
        this._link = link;
    },
    /**
     * @method getLink
     * @deprecated not used?
     *
     * @return {String}
     */
    getLink : function() {
        return this._link;
    },
    /**
     * @method setColor
     * Sets color for the polygon
     *
     * @param {String} color hex code for color e.g. #ff00ff
     */
    setColor : function(color) {
        this._color = color;
    },
    /**
     * @method getColor
     * Gets color for the polygon
     *
     * @return {String} color hex code e.g. #ff00ff
     */
    getColor : function() {
        return this._color;
    },
    /**
     * @method setDisplay
     * @deprecated not used?
     *
     * @param display
     */
    setDisplay : function(display) {
        this._display = display;
    },
    /**
     * @method getDisplay
     * @deprecated not used?
     *
     * @return
     */
    getDisplay : function() {
        return this._display;
    },
    /**
     * @method setZoomToExtent
     * @deprecated not used?
     *
     * @param zoomToExtent
     */
    setZoomToExtent : function(zoomToExtent) {
        this._zoomToExtent = zoomToExtent;
    },
    /**
     * @method getZoomToExtent
     * @deprecated not used?
     *
     * @return
     */
    getZoomToExtent : function() {
        return this._zoomToExtent;
    }
});
/**
 * @class Oskari.mapframework.domain.Tooltip
 * @deprecated (?)
 *
 * Tooltip, not used anywhere?
 */
Oskari.clazz.define('Oskari.mapframework.domain.Tooltip',

/**
 * @method create called automatically on construction
 * @static
 * TODO: check doc
 *
 * @param {Object} component
 *            component reference(?)
 * @param {Object} tooltip
 *            message(?)
 */
function(component, tooltip) {
    this._component = component;
    this._tooltip = tooltip;
}, {
    /**
     * @method setComponent
     * Sets the component reference(?)
     *
     * @param {Object} component
     *            component reference(?)
     */
    setComponent : function(component) {
        this._component = component;
    },
    /**
     * @method setTooltip
     * Sets the tooltip message(?)
     *
     * @param {Object} tooltip
     *            tooltip message(?)
     */
    setTooltip : function(tooltip) {
        this._tooltip = tooltip;
    },
    /**
     * @method getComponent
     * Gets the component reference(?)
     *
     * @return {Object}
     *            component reference(?)
     */
    getComponent : function() {
        return this._component;
    },
    /**
     * @method getTooltip
     * Gets the tooltip message(?)
     *
     * @return {Object}
     *            tooltip message(?)
     */
    getTooltip : function() {
        return this._tooltip;
    }
});
/**
 * @class Oskari.mapframework.domain.WizardOptions
 *
 * Used in map publish wizard? TODO: check docs
 * @deprecated
 */
Oskari.clazz.define('Oskari.mapframework.domain.WizardOptions',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._wizardName = null;
    this._wizardId = null;
    this._wizardHeight = 600;
    this._wizardWidth = 800;
    this._wizardSteps = new Array();
    this._wizardTooltips = new Array();
    this._wizardShowProgressBar = true;
    this._wizardShowCloseConfirm = true;
    this._wizardCloseConfirmTitleKey = 'wizard_service_module_confirm_message_title';
    this._wizardCloseConfirmMessageKey = 'wizard_service_module_confirm_message';
}, {

    getWizardName : function() {
        return this._wizardName;
    },
    getWizardId : function() {
        return this._wizardId;
    },
    getWizardHeight : function() {
        return this._wizardHeight;
    },
    getWizardWidth : function() {
        return this._wizardWidth;
    },
    getWizardSteps : function() {
        return this._wizardSteps;
    },
    getWizardStep : function(id) {
        return this._wizardSteps[id];
    },
    getWizardStepsAmount : function() {
        return this._wizardSteps.length;
    },
    getWizardTooltips : function() {
        return this._wizardTooltips;
    },
    getWizardShowProgressBar : function() {
        return this._wizardShowProgressBar;
    },
    getWizardShowCloseConfirm : function() {
        return this._wizardShowCloseConfirm;
    },
    getWizardCloseConfirmMessageKey : function() {
        return this._wizardCloseConfirmMessageKey;
    },
    getWizardCloseConfirmTitleKey : function() {
        return this._wizardCloseConfirmTitleKey;
    },
    setWizardName : function(name) {
        this._wizardName = name;
    },
    setWizardId : function(id) {
        this._wizardId = id;
    },
    setWizardHeight : function(height) {
        this._wizardHeight = height;
    },
    setWizardWidth : function(width) {
        this._wizardWidth = width;
    },
    setWizardSteps : function(steps) {
        this._wizardSteps = steps;
    },
    addWizardStep : function(step) {
        this._wizardSteps.push(step);
    },
    setWizardTooltips : function(tooltips) {
        this._wizardTooltips = tooltips;
    },
    setWizardShowProgressBar : function(showProgressbar) {
        this._wizardShowProgressBar = showProgressbar;
    },
    setWizardShowCloseConfirm : function(showCloseConfirm) {
        this._wizardShowCloseConfirm = showCloseConfirm;
    },
    setWizardCloseConfirmTitleKey : function(closeConfirmTitleKey) {
        this._wizardCloseConfirmTitleKey = closeConfirmTitleKey;
    },
    setWizardCloseConfirmMessageKey : function(closeConfirmMessageKey) {
        this._wizardCloseConfirmMessageKey = closeConfirmMessageKey;
    }
});
/**
 * @class Oskari.mapframework.domain.WizardStep
 *
 * Used in map publish wizard? TODO: check docs
 * @deprecated
 */
Oskari.clazz.define('Oskari.mapframework.domain.WizardStep',

/**
 * @method create called automatically on construction
 * @static
 */
function(title, contentTitle, contentPage, contentType, actionKeys, beforeNextStep, beforePreviousStep) {
    /* Content types */
    this.CONTENT_TYPE_HTML = "html";
    this.CONTENT_TYPE_URL = "url";
    this.CONTENT_TYPE_PANEL = "panel";
    this.CONTENT_TYPE_DYNAMIC_PANEL = "dynpanel";

    this._stepTitle = title;
    this._contentTitle = contentTitle;
    this._contentPage = contentPage;
    this._contentType = contentType;
    this._beforeNextStepFunction = beforeNextStep;
    this._beforePreviousStepFunction = beforePreviousStep;
    this._actionKeys = actionKeys;

    /** Step functions */
    if(this._beforeNextStepFunction == null || typeof this._beforeNextStepFunction != 'function') {
        this._beforeNextStepFunction = function() {
            return true;
        }
    }

    if(this._beforePreviousStepFunction == null || typeof this._beforePreviousStepFunction != 'function') {
        this._beforePreviousStepFunction = function() {
            return true;
        }
    }
}, {

    getActionKeys : function() {
        return this._actionKeys;
    },
    getStepTitle : function() {
        return this._stepTitle;
    },
    getContentTitle : function() {
        return this._contentTitle;
    },
    getContentPage : function() {
        return this._contentPage;
    },
    getContentType : function() {
        return this._contentType;
    },
    getBeforeNextStepFunction : function() {
        return this._beforeNextStepFunction;
    },
    getBeforePreviousStepFunction : function() {
        return this._beforePreviousStepFunction;
    },
    setStepTitle : function(stepTitle) {
        this._stepTitle = stepTitle;
    },
    setContentTitle : function(contentTitle) {
        this._contentTitle = contentTitle;
    },
    setContentPage : function(contentPage) {
        this._contentPage = contentPage;
    },
    setContentType : function(contentType) {
        this._contentType = contentType;
    },
    setBeforeNextStepFunction : function(beforeNextStepFunction) {
        this._beforeNextStepFunction = beforeNextStepFunction;
    },
    setBeforePreviousStepFunction : function(beforePreviousStepFunction) {
        this._beforePreviousStepFunction = beforePreviousStepFunction;
    }
});
/**
 * @class Oskari.mapframework.domain.WfsTileRequest
 * 
 * TODO: desc
 */
Oskari.clazz.define('Oskari.mapframework.domain.WfsTileRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * Initial data on construction with
 * Oskari.clazz.create('Oskari.mapframework.domain.WfsTileRequest',
 * (here))
 *
 * @param {Oskari.mapframework.domain.WfsLayer} mapLayer
 *            wfs maplayer
 *
 * @param {OpenLayers.Bounds} bbox
 *            map bounding box
 *
 * @param {Number} mapWidth
 *            width of map
 *
 * @param {Number} mapHeight
 *            height of map
 *
 * @param {String} creator
 *            what created this request
 * 
 * @param {Number} sequenceNumber
 *            incrementing number to detect async issues
 */
function(mapLayer, bbox, mapWidth, mapHeight, creator, sequenceNumber) {

    this._bbox = bbox;

    this._mapWidth = mapWidth;

    this._mapHeight = mapHeight;

    this._mapLayer = mapLayer;

    this._creator = creator;

    this._sequenceNumber = sequenceNumber;
}, {
    /**
     * @method getMapLayer
     * Maplayer of type WFS
     *
     * @return {Oskari.mapframework.domain.WfsLayer}
     *            wfs map layer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getBbox
     * Map bounding box
     *
     * @return {OpenLayers.Bounds}
     *            map bounds
     */
    getBbox : function() {
        return this._bbox;
    },
    /**
     * @method getMapWidth
     * Map width
     *
     * @return {Number}
     *            map width
     */
    getMapWidth : function() {
        return this._mapWidth;
    },
    /**
     * @method getMapHeight
     * Map height
     *
     * @return {Number}
     *            map height
     */
    getMapHeight : function() {
        return this._mapHeight;
    },
    /**
     * @method getSequenceNumber
     * Incrementing number to detect async issues
     *
     * @return {Number}
     *            sequence number
     */
    getSequenceNumber : function() {
        return this._sequenceNumber;
    }
});
/**
 * @class Oskari.mapframework.domain.WfsGridScheduledRequest
 * 
 * TODO: desc
 */
Oskari.clazz.define('Oskari.mapframework.domain.WfsGridScheduledRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * Initial data on construction with
 * Oskari.clazz.create('Oskari.mapframework.domain.WfsGridScheduledRequest', (here))
 *
 * @param {Oskari.mapframework.domain.WfsLayer} mapLayer
 *            wfs maplayer
 * 
 * @param {OpenLayers.Bounds} bbox
 *            map bounding box
 * 
 * @param {Number} mapWidth
 *            width of map
 * 
 * @param {Number} mapHeight
 *            height of map
 * 
 * @param {String} creator
 *            what created this request
 */
function(mapLayer, bbox, mapWidth, mapHeight, creator) {

    this._bbox = bbox;

    this._mapWidth = mapWidth;

    this._mapHeight = mapHeight;

    this._mapLayer = mapLayer;

    this._creator = creator;
}, {
    /**
     * @method getMapLayer
     * Maplayer of type WFS
     *
     * @return {Oskari.mapframework.domain.WfsLayer}
     *            wfs map layer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getBbox
     * Map bounding box
     *
     * @return {OpenLayers.Bounds}
     *            map bounds
     */
    getBbox : function() {
        return this._bbox;
    },
    /**
     * @method getMapWidth
     * Map width
     *
     * @return {Number}
     *            map width
     */
    getMapWidth : function() {
        return this._mapWidth;
    },
    /**
     * @method getMapHeight
     * Map height
     *
     * @return {Number}
     *            map height
     */
    getMapHeight : function() {
        return this._mapHeight;
    }
});
/**
 * @class Oskari.mapframework.gridcalc.QueuedTile
 *
 * TODO: check doc
 * This class provides Tile information
 * bounds classs member is a json object with
 * 	left,bottom,right,top properties
 *
 *
 */
Oskari.clazz.define("Oskari.mapframework.gridcalc.QueuedTile",

/**
 * @method create called automatically on construction
 * @static
 * @param options ???
 */
function(options) {
    for(p in options )
    this[p] = options[p];
}, {
    /**
     * @method getBounds
     * TODO: check
     * @return bounds
     */
    getBounds : function() {
        return this.bounds;
    }
});
/**
 * @class Oskari.mapframework.gridcalc.TileQueue
 *
 * This is a class to manage a set of
 * Oskari.mapframework.gridcalc.QueuedTile objects
 */
Oskari.clazz.define("Oskari.mapframework.gridcalc.TileQueue",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /** @property {Oskari.mapframework.gridcalc.QueuedTile[]} queue
     *  	tile queue
     */
    this.queue = [];
}, {

    /**
     * @method getQueue
     * Returns the queue
     *
     * @return {Array}
     *            array of Oskari.mapframework.gridcalc.QueuedTile objects
     */
    getQueue : function() {
        return this.queue;
    },
    /**
     * @method getLength
     * Returns the queue size
     *
     * @return {Number}
     *            queue size
     */
    getLength : function() {
        return this.queue.length;
    },
    /**
     * @method popJob
     * Pop a job from mid queue or from top if queue size is less than 4
     *
     * @return {Oskari.mapframework.gridcalc.QueuedTile/Object}
     *            popped tile
     */
    popJob : function() {
        var q = this.queue;
        var qLength = q.length;
        if(qLength === 0) {
            return null;
        }

        if(qLength < 4) {
            return q.shift(-1);
        }

        var tdef = null;
        var qIndex = Math.floor(qLength / 2);
        tdef = q[qIndex];
        this.queue = q.slice(0, qIndex).concat(q.slice(qIndex + 1));

        return tdef;
    },
    /**
     * @method pushJob
     * push a job as Oskari.mapframework.gridcalc.QueuedTile
     * or a json object to queue
     *
     * @param {Oskari.mapframework.gridcalc.QueuedTile/Object} obj
     *            tile to push into queue
     */
    pushJob : function(obj) {
        this.queue.push(obj);
    },
    /**
     * @method flushQueue
     * replace queue with an empty one
     */
    flushQueue : function() {
        this.queue = [];
    }
});
/**
 * @class Oskari.mapframework.domain.User
 *
 * Contains information about a logged in user.
 * If #isLoggedIn returns true, other methods should return info about user. 
 * Otherwise the user isn't logged in and no data is available.
 */
Oskari.clazz.define('Oskari.mapframework.domain.User', 

/**
 * @method create called automatically on construction
 * @static
 * 
 * Initial data on construction with 
 * Oskari.clazz.create('Oskari.mapframework.domain.User', (here))
 * 
 * @param {Object} userData
 *            json data about the user. If undefined -> user not logged in. 
 * 			  Should have atleast name and uuid for a logged in user.
 */
function(userData) {
	
	this._loggedIn = false;
	if(userData) {
		this._firstName = userData.firstName;
		this._lastName = userData.lastName;
		this._nickName = userData.nickName;
		this._loginName = userData.loginName;
		this._uuid = userData.userUUID;
		if(userData.userUUID) {
			this._loggedIn = true;
		}
	}
}, {
    /**
     * @method getName
     * Full name for the user
     *
     * @return {String}
     *            name
     */
	getName : function() {
		return this._firstName + " " + this._lastName;
	},
    /**
     * @method getFirstName
     * First name for the user
     *
     * @return {String}
     *            first name
     */
	getFirstName : function() {
		return this._firstName;
	},
    /**
     * @method getLastName
     * Last name for the user
     *
     * @return {String}
     *            last name
     */
	getLastName : function() {
		return this._lastName;
	},
    /**
     * @method getNickName
     * Nickname for the user
     *
     * @return {String}
     *            nickname
     */
	getNickName : function() {
		return this._nickName;
	},
    /**
     * @method getLoginName
     * Loginname for the user
     *
     * @return {String}
     *            loginName
     */
	getLoginName : function() {
		return this._loginName;
	},
    /**
     * @method getUuid
     * Uuid for the user
     *
     * @return {String}
     *            uuid
     */
	getUuid : function() {
		return this._uuid;
	},
    /**
     * @method isLoggedIn
     * Returns true if user is logged in
     *
     * @return {Boolean}
     */
	isLoggedIn : function() {
		return this._loggedIn;
	}
});