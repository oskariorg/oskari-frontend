/*
 *
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.myplaces.MyPlacesPrintModule',
/*
 * @constructor
 ...
 */
function(config) {
    this._sandbox = null;
    this._config = config;
    this.idPrefix = 'myplaces';

}, {
    __name : "MyPlacesPrintModule",
    getName : function() {
        return this.__name;
    },
    init : function(sb) {
        this._sandbox = sb;
        var sandbox = sb;
        var me = this;
        sandbox.printDebug("Initializing my places module...");
		this.processStartupLinkLayersPrint(sb);
    },
            
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
    },
    stop : function(sandbox) {
    },
    
    processStartupLinkLayersPrint: function(sandbox) {
        var mapLayers = sandbox.getRequestParameter('mapLayers');
        
        if(mapLayers === null || mapLayers === "") {
        	// no linked layers
        	return;
        }
        var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var layerStrings = mapLayers.split(",");
        var keepLayersOrder = true;

        for(var i = 0; i < layerStrings.length; i++) {
            var splitted = layerStrings[i].split("+");
            var layerId = splitted[0];
            var opacity = splitted[1];
            //var style = splitted[2];
            if(layerId !== null && layerId.indexOf(this.idPrefix) !== -1) {
            	
            	// add layer to service
        		var json = this.getMapLayerJsonPrint(layerId);
	            var myplacesLayer = mapLayerService.createMapLayer(json);
	            mapLayerService.addLayer(myplacesLayer);
	            
	            // add layer to map
                var rb = null;
                var r = null;
                rb = sandbox.getRequestBuilder('AddMapLayerRequest');
                r = rb(layerId, keepLayersOrder);
                sandbox.request(this.getName(), r);
                rb = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
                r = rb(layerId, opacity);
                sandbox.request(this.getName(), r);
            } 
        }
    },
     
    /**
     * @method getMapLayerJson
     * Populates the category based data to the base maplayer json 
     * @return maplayer json for the category
     */
    getMapLayerJsonPrint : function(layerId) {
    	var baseJson = this._getMapLayerJsonBase();
    	var catId = layerId.substring(this.idPrefix.length + 1);
    	baseJson.wmsUrl = this._config.wmsUrl + "+AND+category_id=" + catId + "&";
    	baseJson.name = layerId;
    	baseJson.id = layerId;
    	return baseJson;
    },
    
    /**
     * @method _getMapLayerJsonBase
     * Returns a base maplayer json for my places map layer
     */
    _getMapLayerJsonBase : function() {
		var json = {
			wmsName: 'ows:my_places_categories',
            descriptionLink:"",
            orgName: '',
            type: "wmslayer",
            metaType: this.idPrefix,
            baseLayerId:-1,
            legendImage:"",
            gfi : 'disabled',
            formats: {
               value:"text/html"
            },
            isQueryable:false,
            minScale:12000000,
            opacity:75,
            inspire: '',
            maxScale:1
		};
        return json;
    }
}, {
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */