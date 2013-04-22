/**
 * @class Oskari.digiroad.bundle.myplaces2.plugin.TurningRestrictionsPlugin
 */
Oskari.clazz.define('Oskari.digiroad.bundle.myplaces2.plugin.TurningRestrictionsPlugin', function(url) {
	this.url = url;
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._myPlacesService = null;
    this._vectorLayerPlugin = null;
    this._mapLayerService = null;

    this.features = [];
    this.layerId = "liikenne_elementti";
}, {
    __name: 'DigiroadMyPlaces.TurningRestrictionsPlugin',

    getName: function() {
        return this.pluginName;
    },

    getMapModule: function() {
        return this.mapModule;
    },

    setMapModule: function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },

    init: function(sandbox) {
        var me = this;
        this.requestHandlers = {
            startRestrictionHandler: Oskari.clazz.create('Oskari.digiroad.bundle.myplaces2.request.StartRestrictionRequestPluginHandler', sandbox, me),
            finishRestrictionHandler: Oskari.clazz.create('Oskari.digiroad.bundle.myplaces2.request.FinishRestrictionRequestPluginHandler', sandbox, me)
        };
    },

    startRestriction: function() {
        // First, let's add a layer to the map to display the elements to the user.
        var layer = this._sandbox.findMapLayerFromSelectedMapLayers(this.layerId);
        if(!layer) {
            var request = this._sandbox.getRequestBuilder('AddMapLayerRequest')(this.layerId, true);
            this._sandbox.request(this, request);
        }

        this._addVectorLayer(this.url, "LIIKENNE_ELEMENTTI", this.layerId);
    },

    finishRestriction: function(data, callback) {
        var me = this,
            firstElem = data.firstElem,
            lastElem = data.lastElem,
            restrictionType = data.restrictionType,
            restriction = this._createNewRestriction([firstElem, lastElem], restrictionType);

        if(restriction) {
            this._myPlacesService.saveNewRestriction(restriction, callback);
        }

        this.cleanup();
    },

    // Removes the layer from the map.
    cleanup: function() {
        var layer = this._sandbox.findMapLayerFromSelectedMapLayers(this.layerId);
        if(layer) {
            var request = this._sandbox.getRequestBuilder('RemoveMapLayerRequest')(this.layerId, true);
            this._sandbox.request(this, request);
        }

        this._removeVectorLayer(this.layerId);
    },

    _createNewRestriction: function(features, restrictionType) {
        if(!features || features.length !== 2) {
            return;
        }

        var firstElem = features[0],
            lastElem = features[1],
            featAtts = {
                'KAYTTAJA_ID': kuntayllapito.user.userUUID,
                'TYYPPI': restrictionType,
                'ALKU_ELEM': firstElem,
                'LOPPU_ELEM': lastElem
            };

        return new OpenLayers.Feature.Vector(null, featAtts);
    },

    _addVectorLayer: function(url, featureType, layerName) {
        var layerJson = this._baseJson(url, featureType, layerName),
            vectorLayer = this._mapLayerService.createMapLayer(layerJson),
            keepFeatures = true,
            filter = null;
        
        if(kuntayllapito.user.kuntaKoodi > 0) {
            filter = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "TIEE_KUNTA",
                value: kuntayllapito.user.kuntaKoodi
            });
        }

        this._vectorLayerPlugin.addMapLayerToMap(vectorLayer, true, false, filter);
        this._mapLayerService.addLayer(vectorLayer, true);
    },

    _removeVectorLayer: function(layerName) {
        var vectorLayer = this._mapLayerService.findMapLayer(layerName + '_vector');
        this._vectorLayerPlugin.removeMapLayerFromMap(vectorLayer);
        this._mapLayerService.removeLayer(layerName+'_vector', true);
    },

    _baseJson: function(url, type, name) {
        return {
            "id": name+'_vector',
            "type": "vectorlayer",
            "opacity": 100,
            "name": name+'_vector',
            "minScale": 25001,
            "maxScale": 1,
            "inspire": "Vektoritasot",
            "orgName": "Liikenne-elementit",
            "protocolType": "WFS",
            "protocolOpts": {
                "url": url,
                "srsName": "EPSG:3067",
                "version": "1.1.0",
                "featureType": type,
                "featureNS": "http://digiroad.karttakeskus.fi/LiVi",
                "featurePrefix": "LiVi",
                "geometryName": "GEOMETRY",
                "outputFormat": "json"
            },
            "styleOpts": {
                "defaultStrokeColor": "#22FF22",
                "selectStrokeColor": "#00FF00"
            }
        }
    },

    register: function() {},

    unregister: function() {},

    startPlugin: function(sandbox) {
        this._sandbox = sandbox;
        this._myPlacesService = sandbox.getService("Oskari.digiroad.bundle.myplaces2.service.MyPlacesService");
        this._vectorLayerPlugin = sandbox.findRegisteredModuleInstance("MainMapModuleDigiroadVectorLayerPlugin");
        this._mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

        sandbox.register(this);
        sandbox.addRequestHandler('DigiroadMyPlaces.StartRestrictionRequest', this.requestHandlers.startRestrictionHandler);
        sandbox.addRequestHandler('DigiroadMyPlaces.FinishRestrictionRequest', this.requestHandlers.finishRestrictionHandler);
    },

    stopPlugin: function(sandbox) {
        sandbox.removeRequestHandler('DigiroadMyPlaces.StartRestrictionRequest', this.requestHandlers.startRestrictionHandler);
        sandbox.removeRequestHandler('DigiroadMyPlaces.FinishRestrictionRequest', this.requestHandlers.finishRestrictionHandler);
        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },

    /* @method start
     * called from sandbox
     */
    start: function(sandbox) {},

    /**
     * @method stop
     * called from sandbox
     *
     */
    stop: function(sandbox) {}
}, {
    'protocol' : [
        "Oskari.mapframework.module.Module",
        "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
    ]
});
