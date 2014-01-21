/**
 * @class Oskari.mapframework.domain.AbstractLayer
 *
 * Superclass for layer objects copy pasted from wmslayer. Need to check
 * if something should be moved back to wmslayer. Nothing else currently uses this.
 */
Oskari.clazz.define('Oskari.mapframework.domain.AbstractLayer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (params, options) {
        var me = this;
        /* Internal id for this map layer */
        me._id = null;

        /* Name of this layer */
        me._name = null;

        /* Description for layer */
        me._description = null;

        /* either NORMAL_LAYER, GROUP_LAYER or BASE_LAYER */
        me._type = null;

        /* either WMS, WMTS, WFS or VECTOR */
        me._layerType = "";

        /* optional params */
        me._params = params || {};

        /* optional options */
        me._options = options || {};

        /* modules can "tag" the layers with this for easier reference */
        me._metaType = null;

        /* Max scale for layer */
        me._maxScale = null;

        /* Min scale for layer */
        me._minScale = null;

        /* is layer visible */
        me._visible = null;

        /* opacity from 0 to 100 */
        me._opacity = 100;

        /* visible layer switch off enable/disable */
        me._isSticky = null;

        me._inspireName = null;
        me._organizationName = null;
        me._dataUrl = null;
        me._orderNumber = null;

        /*
         * Array of sublayers. Notice that only type BASE_LAYER can
         * have sublayers.
         */
        me._subLayers = [];

        /* Array of styles that this layer supports */
        me._styles = [];

        /* Currently selected style */
        me._currentStyle = null;

        /* Legend image location */
        me._legendImage = null;

        /* is it possible to ask for feature info */
        me._featureInfoEnabled = null;

        /* is this layer queryable (GetFeatureInfo) boolean */
        me._queryable = null;

        me._queryFormat = null;

        // f.ex. permissions.publish
        me._permissions = {};

        // if given, tells where the layer has content
        // array of Openlayers.Geometry[] objects if already processed from _geometryWKT
        me._geometry = [];
        // wellknown text for polygon geometry
        me._geometryWKT = null;

        // Tools array for layer specific functions 
        me._tools = [];

        /* link to metadata service */
        me._metadataIdentifier = null;

        me._backendStatus = null;

        /* does this layer have Feature Data boolean */
        me._featureData = false;

        // Layers service urls
        me._layerUrls = [];

        me._baseLayerId = -1;

    }, {
        /**
         * Populates name, description, inspire and organization fields with a localization JSON object
         * @method setLocalization
         * @param {Object} loc
         *          object containing localization for name/desc/inspire/organization
         * (e.g. MapLayerService)
         */
        setLocalization: function (loc) {
            var name = {},
                desc = {},
                inspire = {},
                organization = {},
                lang,
                singleLang;

            for (lang in loc) {
                if (loc.hasOwnProperty(lang)) {
                    singleLang = loc[lang];
                    if (singleLang.name) {
                        name[lang] = singleLang.name;
                    }
                    if (singleLang.subtitle) {
                        desc[lang] = singleLang.subtitle;
                    }
                    if (singleLang.inspire) {
                        inspire[lang] = singleLang.inspire;
                    }
                    if (singleLang.orgName) {
                        organization[lang] = singleLang.orgName;
                    }
                }
            }
            // set objects if we had any localizations
            for (lang in name) {
                if (name.hasOwnProperty(lang)) {
                    this.setName(name);
                    break;
                }
            }
            for (lang in desc) {
                if (desc.hasOwnProperty(lang)) {
                    this.setDescription(desc);
                    break;
                }
            }
            for (lang in inspire) {
                if (inspire.hasOwnProperty(lang)) {
                    this.setInspireName(inspire);
                    break;
                }
            }
            for (lang in organization) {
                if (organization.hasOwnProperty(lang)) {
                    this.setOrganizationName(organization);
                    break;
                }
            }
        },
        /**
         * @method setId
         * @param {String} id
         *          unique identifier for map layer used to reference the layer internally
         * (e.g. MapLayerService)
         */
        setId: function (id) {
            this._id = id;
        },
        /**
         * @method getId
         * @return {String}
         *          unique identifier for map layer used to reference the layer internally
         * (e.g. MapLayerService)
         */
        getId: function () {
            return this._id;
        },
        /**
         * @method setParentId
         * @param {String} id
         *          unique identifier for parent map layer used to reference the layer internally
         * (e.g. MapLayerService)
         */
        setParentId: function (id) {
            this._baseLayerId = id;
        },
        /**
         * @method getParentId
         * @return {String}
         *          unique identifier for parent map layer used to reference the layer internally
         * (e.g. MapLayerService)
         */
        getParentId: function () {
            if(!this._baseLayerId) {
                return -1;
            }
            return this._baseLayerId;
        },
        /**
         * @method setQueryFormat
         * @param {String} queryFormat
         *          f.ex. 'text/html'
         */
        setQueryFormat: function (queryFormat) {
            this._queryFormat = queryFormat;
        },
        /**
         * @method getQueryFormat
         * f.ex. 'text/html'
         * @return {String}
         */
        getQueryFormat: function () {
            return this._queryFormat;
        },
        /**
         * @method setName
         * @param {String/Object} name
         *          name for the maplayer that is shown in UI
         */
        setName: function (name) {
            this._name = name;
        },
        /**
         * Returns a name for the layer.
         * If the name is populated with a string, always returns it.
         * With populated object assumes that the object keys are language codes.
         * If language param is not given, uses Oskari.getLang()
         * @method getName
         * @param {String} lang language id like 'en' or 'fi' (optional)
         * @return {String} maplayer UI name
         */
        getName: function (lang) {
            if (this._name && typeof this._name === 'object') {
                if (lang) {
                    return this._name[lang];
                }
                return this._name[Oskari.getLang()];
            }
            return this._name;
        },
        /**
         * @method setType
         * @param {String} type
         *          layer type (e.g. NORMAL, BASE, GROUP)
         *
         * Not as type WMS or Vector but base or normal layer.
         * See #setAsBaseLayer(), #setAsGroupLayer() and #setAsNormalLayer()
         */
        setType: function (type) {
            this._type = type;
        },
        /**
         * @method getType
         * @return {String} maplayer type (BASE/NORMAL)
         */
        getType: function () {
            return this._type;
        },
        /**
         * @method setDataUrl
         * @param {String} param
         *          URL string used to show more info about the layer
         */
        setDataUrl: function (param) {
            this._dataUrl = param;
        },
        /**
         * @method getDataUrl
         * @return {String} URL string used to show more info about the layer
         */
        getDataUrl: function () {
            return this._dataUrl;
        },
        /**
         * @method setOrganizationName
         * @param {String/Object} param
         *          organization name under which the layer is listed in UI
         */
        setOrganizationName: function (param) {
            this._organizationName = param;
        },
        /**
         * Returns a organization name for the layer.
         * If the name is populated with a string, always returns it.
         * With populated object assumes that the object keys are language codes.
         * If language param is not given, uses Oskari.getLang()
         * @method getOrganizationName
         * @param {String} lang language id like 'en' or 'fi' (optional)
         * @return {String} organization name under which the layer is listed in UI
         */
        getOrganizationName: function (lang) {
            if (this._organizationName && typeof this._organizationName === 'object') {
                if (lang) {
                    return this._organizationName[lang];
                }
                return this._organizationName[Oskari.getLang()];
            }
            return this._organizationName;
        },
        /**
         * @method setInspireName
         * @param {String} param
         *          inspire theme name under which the layer is listed in UI
         */
        setInspireName: function (param) {
            this._inspireName = param;
        },
        /**
         * Returns an inspire name for the layer.
         * If the name is populated with a string, always returns it.
         * With populated object assumes that the object keys are language codes.
         * If language param is not given, uses Oskari.getLang()
         * @method getInspireName
         * @param {String} lang language id like 'en' or 'fi' (optional)
         * @return {String} inspire theme name under which the layer is listed in UI
         */
        getInspireName: function (lang) {
            if (this._inspireName && typeof this._inspireName === 'object') {
                if (lang) {
                    return this._inspireName[lang];
                }
                return this._inspireName[Oskari.getLang()];
            }
            return this._inspireName;
        },
        /**
         * @method setFeatureInfoEnabled
         * @return {Boolean} featureInfoEnabled true to enable feature info functionality
         */
        setFeatureInfoEnabled: function (featureInfoEnabled) {
            this._featureInfoEnabled = featureInfoEnabled;
        },
        /**
         * @method isFeatureInfoEnabled
         * @return {Boolean} true if feature info functionality should be enabled
         */
        isFeatureInfoEnabled: function () {
            if (this._featureInfoEnabled === true) {
                return true;
            }
            return false;
        },
        /**
         * @method setDescription
         * @param {String} description
         *          map layer description text
         */
        setDescription: function (description) {
            this._description = description;
        },
        /**
         * Returns a description for the layer.
         * If the description is populated with a string, always returns it.
         * With populated object assumes that the object keys are language codes.
         * If language param is not given, uses Oskari.getLang()
         * @method getDescription
         * @param {String} lang language id like 'en' or 'fi' (optional)
         * @return {String} map layer description text
         */
        getDescription: function (lang) {
            if (this._description && typeof this._description === 'object') {
                if (lang) {
                    return this._description[lang];
                }
                return this._description[Oskari.getLang()];
            }
            return this._description;
        },
        /**
         * @method addSubLayer
         * @param {Oskari.mapframework.domain.WmsLayer} map layer
         *          actual sub map layer that is used for a given scale range (only for
         * base & group layers)
         *
         * If layer has sublayers, it is basically a "metalayer" for maplayer ui
         * purposes and actual map images to show are done with sublayers
         */
        addSubLayer: function (layer) {
            var sublayers = this.getSubLayers();
            for (i = 0, len = sublayers.length; i < len; ++i) {
                if (sublayers[i].getId() === layer.getId()) {
                    // already added, don't add again
                    return false;
                }
            }
            sublayers.push(layer);
            return true;
        },
        /**
         * @method getSubLayers
         * @return {Oskari.mapframework.domain.WmsLayer[]} array of sub map layers
         *
         * If layer has sublayers, it is basically a "metalayer" for maplayer ui
         * purposes and actual map images to show are done with sublayers
         */
        getSubLayers: function () {
            return this._subLayers;
        },
        /**
         * @method setMaxScale
         * @param {Number} maxScale
         *          largest scale when the layer is shown (otherwise not shown in map and
         * "greyed out"/disabled in ui)
         */
        setMaxScale: function (maxScale) {
            this._maxScale = maxScale;
        },
        /**
         * @method getMaxScale
         * @return {Number}
         *          largest scale when the layer is shown (otherwise not shown in map and
         * "greyed out"/disabled in ui)
         */
        getMaxScale: function () {
            return this._maxScale;
        },
        /**
         * @method setMinScale
         * @param {Number} minScale
         *          smallest scale when the layer is shown (otherwise not shown in map and
         * "greyed out"/disabled in ui)
         */
        setMinScale: function (minScale) {
            this._minScale = minScale;
        },
        /**
         * @method getMinScale
         * @return {Number}
         *          smallest scale when the layer is shown (otherwise not shown in map and
         * "greyed out"/disabled in ui)
         */
        getMinScale: function () {
            return this._minScale;
        },
        /**
         * @method setOrderNumber
         * @param {Number} orderNumber
         */
        setOrderNumber: function (orderNumber) {
            this._orderNumber = orderNumber;
        },
        /**
         * @method getOrderNumber
         * @return {Number} orderNumber
         */
        getOrderNumber: function () {
            return this._orderNumber;
        },
        /**
         * @method isVisible
         * @return {Boolean} true if this is should be shown
         */
        isVisible: function () {
            return this._visible === true;
        },
        /**
         * @method setVisible
         * @param {Boolean} visible true if this is should be shown
         */
        setVisible: function (visible) {
            this._visible = visible;
        },
        /**
         * @method setOpacity
         * @param {Number} opacity
         *          0-100 in percents
         */
        setOpacity: function (opacity) {
            this._opacity = opacity;
        },
        /**
         * @method getOpacity
         * @return {Number} opacity
         *          0-100 in percents
         */
        getOpacity: function () {
            if(this._opacity === null || this._opacity === undefined) {
                return 100;
            }
            return this._opacity;
        },
        /**
         * @method setGeometryWKT
         * Set geometry as wellknown text
         * @param {String} value
         *          WKT geometry
         */
        setGeometryWKT: function (value) {
            this._geometryWKT = value;
        },
        /**
         * @method getGeometryWKT
         * Get geometry as wellknown text
         * @return {String} WKT geometry
         */
        getGeometryWKT: function () {
            return this._geometryWKT;
        },
        /**
         * @method setGeometry
         * @param {OpenLayers.Geometry.Geometry[]} value
         *          array of WKT geometries or actual OpenLayer geometries
         */
        setGeometry: function (value) {
            this._geometry = value;
        },
        /**
         * @method getGeometry
         * @return {OpenLayers.Geometry.Geometry[]}
         *          array of WKT geometries or actual OpenLayer geometries
         */
        getGeometry: function () {
            return this._geometry;
        },
        /**
         * @method addPermission
         * @param {String} action
         *          action key that we want to add permission setting for
         * @param {String} permission
         *          actual permission setting for action
         */
        addPermission: function (action, permission) {
            this._permissions[action] = permission;
        },
        /**
         * @method removePermission
         * @param {String} action
         *          action key from which permission setting should be removed
         */
        removePermission: function (action) {
            this._permissions[action] = null;
            delete this._permissions[action];
        },
        /**
         * @method getPermission
         * @param {String} action
         *          action key for which permission we want
         * @return {String} permission setting for given action
         */
        getPermission: function (action) {
            return this._permissions[action];
        },
        /**
         * @method getMetadataIdentifier
         * Gets the identifier (uuid style) for getting layers metadata
         * @return {String}
         */
        getMetadataIdentifier: function () {
            return this._metadataIdentifier;
        },
        /**
         * @method setMetadataIdentifier
         * Sets the identifier (uuid style) for getting layers metadata
         * @param {String} metadataid
         */
        setMetadataIdentifier: function (metadataid) {
            this._metadataIdentifier = metadataid;
        },
        /**
         * @method getBackendStatus
         * Status text for layer operatibility (f.ex. 'DOWN')
         * @return {String}
         */
        getBackendStatus: function () {
            return this._backendStatus;
        },
        /**
         * @method setBackendStatus
         * Status text for layer operatibility (f.ex. 'DOWN')
         * @param {String} backendStatus
         */
        setBackendStatus: function (backendStatus) {
            this._backendStatus = backendStatus;
        },
        /**
         * @method setMetaType
         * @param {String} type used to group layers by f.ex. functionality.
         * Layers can be fetched based on metatype f.ex. 'myplaces'
         */
        setMetaType: function (type) {
            this._metaType = type;
        },
        /**
         * @method getMetaType
         * @return {String} type used to group layers by f.ex. functionality.
         * Layers can be fetched based on metatype f.ex. 'myplaces'
         */
        getMetaType: function () {
            return this._metaType;
        },
        /**
         * @method addStyle
         * @param {Oskari.mapframework.domain.Style} style
         * adds style to layer
         */
        addStyle: function (style) {
            this.getStyles().push(style);
        },
        /**
         * @method getStyles
         * @return {Oskari.mapframework.domain.Style[]}
         * Gets layer styles
         */
        getStyles: function () {
            if(!this._styles) {
                this._styles = [];
            }
            return this._styles;
        },
        /**
         * @method selectStyle
         * @param {String} styleName
         * Selects a #Oskari.mapframework.domain.Style with given name as #getCurrentStyle.
         * If style is not found, assigns an empty #Oskari.mapframework.domain.Style to #getCurrentStyle
         */
        selectStyle: function (styleName, preventRecursion) {
            var me = this;

            // Layer doesn't have styles
            if (me.getStyles().length === 0) {
                var style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
                style.setName("");
                style.setTitle("");
                style.setLegend("");
                this.addStyle(style);
            }
            for (var i = 0; i < me.getStyles().length; i++) {
                var style = me.getStyles()[i];
                if (style.getName() === styleName) {
                    me._currentStyle = style;
                    if (style.getLegend() !== "") {
                        me._legendImage = style.getLegend();
                    }
                    return;
                }
            }

            // didn't match anything select the first one
            if(!preventRecursion && !me._currentStyle) {
                this.selectStyle(me.getStyles()[0].getName(), true);
            }
        },
        /**
         * @method getCurrentStyle
         * @return {Oskari.mapframework.domain.Style} current style
         */
        getCurrentStyle: function () {
            if(!this._currentStyle) {
                // prevent "nullpointer" if selectstyle hasn't been called
                this.selectStyle('');
            }
            return this._currentStyle;
        },
        /**
         * @method getTools
         * @return {Oskari.mapframework.domain.Tool[]}
         * Get layer tools
         */
        getTools: function () {
            return this._tools;
        },
        /**
         * @method setTools
         * @params {Oskari.mapframework.domain.Tool[]}
         * Set layer tools
         */
        setTools: function (tools) {
            this._tools = tools;
        },
        /**
         * @method addTool
         * @params {Oskari.mapframework.domain.Tool}
         * adds layer tool to tools
         */
        addTool: function (tool) {
            this._tools.push(tool);
        },

        /**
         * @method getTool
         * @return {Oskari.mapframework.domain.Tool}
         * adds layer tool to tools
         */
        getTool: function (toolName) {

            var tool = null,
                i;
            // Layer have tools
            if (this._tools.length > 0) {
                // 
                if (toolName !== "") {
                    for (i = 0; i < this._tools.length; i++) {
                        tool = this._tools[i];
                        if (tool.getName() === toolName) {
                            return tool;
                        }
                    }
                }
            }
            return tool;
        },
        /**
         * @method setLegendImage
         * @return {String} legendImage URL to a legend image
         */
        setLegendImage: function (legendImage) {
            this._legendImage = legendImage;
        },
        /**
         * @method getLegendImage
         * @return {String} URL to a legend image
         */
        getLegendImage: function () {
            return this._legendImage;
        },
        /**
         * @method getLegendImage
         * @return {Boolean} true if layer has a legendimage or its styles have legend images
         */
        hasLegendImage: function () {
            var i,
                ret = false;
            if (this._legendImage) {
                ret = true;
            } else {
                for (i = 0; i < this.getStyles().length; ++i) {
                    if (this.getStyles()[i].getLegend()) {
                        ret = true;
                        break;
                    }
                }
            }
            return ret;
        },
        /**
         * @method setSticky
         * True if layer switch off is disable
         * @param {Boolean} isSticky
         */
        setSticky: function (isSticky) {
            this._isSticky = isSticky;
        },
        /**
         * @method isSticky
         * True if layer switch off is disable
         */
        isSticky: function () {
            return this._isSticky;
        },
        /**
         * @method setQueryable
         * True if we should call GFI on the layer
         * @param {Boolean} queryable
         */
        setQueryable: function (queryable) {
            this._queryable = queryable;
        },
        /**
         * @method getQueryable
         * True if we should call GFI on the layer
         * @param {Boolean} queryable
         */
        getQueryable: function () {
            return this._queryable;
        },
        /**
         * @method setAsBaseLayer
         * sets layer type to BASE_LAYER
         */
        setAsBaseLayer: function () {
            this._type = "BASE_LAYER";
        },
        /**
         * @method setAsNormalLayer
         * sets layer type to NORMAL_LAYER
         */
        setAsNormalLayer: function () {
            this._type = "NORMAL_LAYER";
        },
        /**
         * @method setAsGroupLayer
         * Sets layer type to GROUP_LAYER
         */
        setAsGroupLayer: function () {
            this._type = "GROUP_LAYER";
        },
        /**
         * @method isGroupLayer
         * @return {Boolean} true if this is a group layer (=has sublayers)
         */
        isGroupLayer: function () {
            return this._type === "GROUP_LAYER";
        },
        /**
         * @method isBaseLayer
         * @return {Boolean} true if this is a base layer (=has sublayers)
         */
        isBaseLayer: function () {
            // TODO check if this really works
            return this._type === "BASE_LAYER";
        },
        /**
         * @method isInScale
         * @param {Number} scale scale to compare to
         * @return {Boolean} true if given scale is between this layer's or its sublayers' min/max scales.
         */
        isInScale: function (scale) {
            var _inScale = false,
                _subLayers = this.getSubLayers();

            scale = scale || Oskari.getSandbox().getMap().getScale();

            if (_subLayers && _subLayers.length) {
                // Check if any of the sublayers is in scale
                _inScale = _.any(_subLayers, function(subLayer) {
                    return subLayer.isInScale(scale);
                })
            } else {
                // Otherwise just check if the scale falls between min/max scales
                if ((scale > this.getMaxScale() || !this.getMaxScale()) &&
                    (scale < this.getMinScale()) || !this.getMinScale()) {
                    _inScale = true;
                }
            }
            return _inScale;
        },
        /**
         * @method getLayerType
         * @return {String} layer type in lower case
         */
        getLayerType: function () {
            return this._layerType.toLowerCase();
        },
        /**
         * @method isLayerOfType
         * @param {String} flavour layer type to check against. A bit misleading since setType is base/group/normal, this is used to check if the layer is a WMS layer.
         * @return {Boolean} true if flavour is the specified layer type
         */
        isLayerOfType: function (flavour) {
            return flavour && flavour.toLowerCase() === this.getLayerType();
        },
        /**
         * @method getIconClassname
         * @return {String} layer icon classname used in the CSS style.
         */
        getIconClassname: function () {
            var ret;
            if (this.isBaseLayer()) {
                ret = 'layer-base';
            } else if (this.isGroupLayer()) {
                ret = 'layer-group';
            } else {
                ret = 'layer-' + this.getLayerType();
            }
            return ret;
        },
        /**
         * @method getParams
         * @return {Object} optional layer parameters for OpenLayers, empty object if no parameters were passed in construction
         */
        getParams: function () {
            return this._params;
        },
        /**
         * @method getOptions
         * @return {Object} optional layer options for OpenLayers, empty object if no options were passed in construction
         */
        getOptions: function () {
            return this._options;
        },
        /**
         * @method hasFeatureData
         * @return {Boolean} true if the layer has feature data
         */
        hasFeatureData: function () {
            return this._featureData;
        },
        /**
         * @method addLayerUrl
         * @param {String} layerUrl
         * Apppends the url to layer array of wms image urls
         */
        addLayerUrl: function (layerUrl) {
            this._layerUrls.push(layerUrl);
        },
        /**
         * @method getWmsUrls
         * @return {String[]}
         * Gets array of layer wms image urls
         */
        getLayerUrls: function () {
            return this._layerUrls;
        }
    });