/**
 * @class Oskari.mapframework.bundle.heatmap.domain.HeatmapLayer
 *
 * MapLayer of type Heatmap
 */
Oskari.clazz.define('Oskari.mapframework.bundle.heatmap.domain.HeatmapLayer',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.init();
    }, {
    	init : function() {
	        this._layerType = "HEATMAP";
            this._selectedProperty = null;
            this._radius = 30;
            this._pixelsPerCell = 10;
	        this.localization = Oskari.getLocalization('heatmap');
    	},
    	copyValues : function(parentLayer, overrides) {
    		var me = this;
    		// maybe just copy url, name, technical stuff?
    		// NOTE! this might have unwanted side-effects
    		_.each(parentLayer, function(value, key) {
    			me[key] = value;
    		});
    		this.init();
            this.setMaxScale(null);
            this.setMinScale(null);
            this._styles = [];
            // initial opacity to 70%
            this.setOpacity(70);

    		this.setId(overrides.id);
    		this.setName(overrides.name);
    	},
        getGeometryProperty : function() {
            var attr = this.getAttributes();
            return attr.geometryProperty;
        },
        getHeatmapProperties : function() {
            var attr = this.getAttributes();
            return attr.heatmap || [];
        },
        setRadius : function(param) {
            this._radius = param;
        },
        getRadius : function() {
            return this._radius;
        },
        setPixelsPerCell : function(param) {
            this._pixelsPerCell = param;
        },
        getPixelsPerCell : function() {
            return this._pixelsPerCell;
        },
        setWeightedHeatmapProperty : function(param) {
            this._selectedProperty = param;
        },
        getWeightedHeatmapProperty : function() {
            if(this._selectedProperty) {
                return this._selectedProperty;
            }
            return null;
        },
        setSelectedTheme: function (el) {
            this._selectedTheme = el;
        },
        getSelectedTheme: function () {
            if (this._selectedTheme) {
                return this._selectedTheme;
            }
        },
        setColorSetup: function (colorSetup) {
            this._selectedColors = colorSetup;
        },
        getColorSetup: function () {
            if (this._selectedColors) {
                return this._selectedColors;
            }
        },
        getSLDNamedLayer : function() {
            var attr = this.getAttributes();
            var name = this.getLayerName();
            var workspace = attr.layerWorkspace;
            if(workspace) {
                name = workspace + ':' + name;
            }
            return name;
        },
        setColorConfig : function (colorConfig) {
            this._colorConfig = [
            { color : colorConfig[0], quantity : 0.02, opacity : 0 },
            { color : colorConfig[1], quantity : 0.1, opacity : 1 },
            { color : colorConfig[2], quantity : 0.5, opacity : 1 },
            { color : colorConfig[3], quantity : 1, opacity : 1 }]
        },

        getColorConfig : function() {
            return this._colorConfig;
        }

    }, {
        "extend": ["Oskari.mapframework.domain.WmsLayer"]
    });
