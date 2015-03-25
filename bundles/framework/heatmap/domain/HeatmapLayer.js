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
            this._radius = 10;
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
        setSelectedHeatmapProperty : function(param) {
            this._selectedProperty = param;
        },
        getSelectedHeatmapProperty : function() {
            if(this._selectedProperty) {
                return this._selectedProperty;
            }
            var list = this.getHeatmapProperties();
            if(list.length > 0) {
                return list[0];
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
        }
    }, {
        "extend": ["Oskari.mapframework.domain.WmsLayer"]
    });
