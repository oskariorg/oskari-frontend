Oskari.clazz.define('Oskari.mapframework.wmts.domain.WmtsLayer', function() {

    /** Internal id for this map layer */
    this._id = null;
    this._name = null;
    this._WmtsLayerName = null;
    this._WmtsMatrixSet = null;
    this._inspireName = null;
    this._organizationName = null;
    this._dataUrl = null;
    this._type = null;
    this._opacity = null;
    this._featureInfoEnabled = null;
    this._subLayers = [];

    /** Array of styles that this layer supports */
    this._styles = [];

    /** Description for layer */
    this._description = null;
    this._WmtsUrls = [];

    /** dataurl */
    this._dataUrl = null;
    this._legendImage = null;
    this._maxScale = null;
    this._minScale = null;
    this._queryable = null;
    this._currentStyle = null;
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

    setId : function(id) {
        this._id = id;
    },
    getId : function() {
        return this._id;
    },
    setQueryFormat : function(queryFormat) {
        this._queryFormat = queryFormat;
    },
    getQueryFormat : function() {
        return this._queryFormat;
    },
    setName : function(name) {
        this._name = name;
    },
    getName : function() {
        return this._name;
    },
    setWmtsName : function(WmtsName) {
        this._WmtsName = WmtsName;
    },
    getWmtsName : function() {
        return this._WmtsName;
    },
    setWmtsMatrixSet : function(matrixSet) {
    	this._WmtsMatrixSet = matrixSet;
    },
    getWmtsMatrixSet : function() {
        return this._WmtsMatrixSet;
    },
    setWmtsLayerDef : function(def) {
        this._WmtsLayerDef = def;
    },
    getWmtsLayerDef : function() {
        return this._WmtsLayerDef;
    },
    setType : function(type) {
        this._type = type;
    },
    getType : function() {
        return this._type;
    },
    setOpacity : function(opacity) {
        this._opacity = opacity;
    },
    getOpacity : function() {
        return this._opacity;
    },
    setDataUrl : function(param) {
        this._dataUrl = param;
    },
    getDataUrl : function() {
        return this._dataUrl;
    },
    setOrganizationName : function(param) {
        this._organizationName = param;
    },
    getOrganizationName : function() {
        return this._organizationName;
    },
    setInspireName : function(param) {
        this._inspireName = param;
    },
    getInspireName : function() {
        return this._inspireName;
    },
    setFeatureInfoEnabled : function(featureInfoEnabled) {
        this._featureInfoEnabled = featureInfoEnabled;
    },
    isFeatureInfoEnabled : function() {
    	if(this._featureInfoEnabled === true) {
    		return true;
    	}
        return false;
    },
    setDescription : function(description) {
        this._description = description;
    },
    getDescription : function() {
        return this._description;
    },
    addWmtsUrl : function(WmtsUrl) {
        this._WmtsUrls.push(WmtsUrl);
    },
    getWmtsUrls : function() {
        return this._WmtsUrls;
    },
    addStyle : function(style) {
        this._styles.push(style);
    },
    getStyles : function() {
        return this._styles;
    },
    addSubLayer : function(layer) {
        this._subLayers.push(layer);
    },
    getSubLayers : function() {
        return this._subLayers;
    },
    setLegendImage : function(legendImage) {
        this._legendImage = legendImage;
    },
    getLegendImage : function() {
        return this._legendImage;
    },
    setMaxScale : function(maxScale) {
        this._maxScale = maxScale;
    },
    getMaxScale : function() {
        return this._maxScale;
    },
    setMinScale : function(minScale) {
        this._minScale = minScale;
    },
    getMinScale : function() {
        return this._minScale;
    },
    setQueryable : function(queryable) {
        this._queryable = queryable;
    },
    getQueryable : function() {
    	return this._queryable;
    },
    setAsGroupLayer : function() {
        this._type = "GROUP_LAYER";
    },    
    setAsBaseLayer : function() {
        this._type = "BASE_LAYER";
    },
    setAsNormalLayer : function() {
        this._type = "NORMAL_LAYER";
    },
    setOrderNumber : function(orderNumber) {
        this._orderNumber = orderNumber;
    },
    getOrderNumber : function() {
        return this._orderNumber;
    },
    isBaseLayer : function() {
        if(this._type == "BASE_LAYER") {
            return true;
        } /*else if(this._type == "NORMAL_LAYER") {
            return false;
        }*/ else {
            //throw "We found layer that is not NORMAL_LAYER or BASE_LAYER. Type '" + this._type + "' is not correct!";
            return false;
        }
    },
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
    getCurrentStyle : function() {
        return this._currentStyle;
    },
    isVisible : function() {
        return this._visible;
    },
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
    isLayerOfType : function(flavour) {
        return flavour == 'WMTS' || flavour == 'wmtslayer';
    },
    isGroupLayer : function() {
        if(this._type == "GROUP_LAYER") {
            return true;
        } else {
        	return false;
        } 
    }

});
