/**
 * @class Oskari.digiroad.bundle.featureselector.FeatureSelectorBundleInstance
 * 
 */
Oskari.clazz.define("Oskari.digiroad.bundle.featureselector.FeatureSelectorBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = null;
    this.plugins = {};
    this._localization = null;
    this.mediator = null;

    this.features = {};
    this.vectorLayerPlugin = null;
    this.mapLayerService = null;
}, {
    /**
     * @static
     * @property __name
    */
    __name: "FeatureSelector",

    /**
     * @method getName
     * Module protocol method
     */
    getName: function() {
        return this.__name;
    },
    /**
     * @method getTitle 
     * Extension protocol method
     * @return {String} localized text for the title of the component 
     */
    getTitle: function() {
        return this.getLocalization('title');
    },
    /**
     * @method getDescription 
     * Extension protocol method
     * @return {String} localized text for the description of the component 
     */
    getDescription: function() {
        return this.getLocalization('desc');
    },

    /**
     * @method getSandbox
     * Convenience method to call from Tile and Flyout
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox: function() {
        return this.sandbox;
    },

    /**
     * @method getLocalization
     * Convenience method to call from Tile and Flyout
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization: function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    },

    getFeatures: function() {
        return this.features;
    },

    /**
     * @method startExtension
     * Extension protocol method
     */
    startExtension: function() {
        var me = this;
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.digiroad.bundle.featureselector.Flyout', this);
        this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.digiroad.bundle.featureselector.Tile', this);
    },

    /**
     * @method stopExtension
     * Extension protocol method
     */
    stopExtension: function() {
        var me = this;
        for (var pluginType in me.plugins) {
            if (pluginType) {
                me.plugins[pluginType] = null;
            }
        }
    },

    /**
     * @method getPlugins
     * Extension protocol method
     */
    getPlugins : function() {
        return this.plugins;
    },

    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
        var me = this,
            sandbox = Oskari.getSandbox();

        this.sandbox = sandbox;
        this._localization = Oskari.getLocalization(this.getName());
        this.queryUrl = this.conf.queryUrl;

        // list of layers that should get added when the bundle starts.
        this.targetLayers = this.conf.targetLayers;
        
        // register to sandbox as a module
        sandbox.register(me);
        // register to listening events
        for (var p in me.eventHandlers) {
            if (p) {
                sandbox.registerForEventByName(me, p);
            }
        }

        this.vectorLayerPlugin = sandbox.findRegisteredModuleInstance("MainMapModuleDigiroadVectorLayerPlugin");
        this.mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

        //Let's extend UI with Flyout and Tile
        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);
        
        // draw ui
        me._createUI();
    },

    /**
     * @method init
     * Module protocol method
     */
    init : function() {
        // headless module so nothing to return
        return null;
    },

    /**
     * @method onEvent
     * Module protocol method/Event dispatch
     */
    onEvent : function(event) {
        var me = this;
        var handler = me.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [event]);
    },
    
    /**
     * @static
     * @property eventHandlers
     * Best practices: defining which 
     * events bundle is listening and how bundle reacts to them
     */
    eventHandlers : {
        'FeaturesAddedEvent': function(event) {
            this.afterFeaturesAddedEvent(event);
        },
        'FeaturesRemovedEvent': function(event) {
            this.afterFeaturesRemovedEvent(event);
        },
        'AfterMapLayerAddEvent': function(event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent': function(event) {
            this.afterMapLayerRemoveEvent(event);
        }
    },

    afterFeaturesAddedEvent: function(event) {
        var layerName = event.getLayerName().replace(/_vector$/, ""); // layerName is eg. 'nopeusrajoitus_vector'
        var features = event.getFeatures();
        var objectId = this.conf.objectIds[layerName];
        
        for(var i = 0; i < features.length; ++i) {
            this.features[features[i].data[objectId]] = features[i];
        }
        this.plugins['Oskari.userinterface.Flyout'].appendFeatures(layerName, features);
    },

    afterFeaturesRemovedEvent: function(event) {
        var layerName = event.getLayerName().replace(/_vector$/, "");
        var features = event.getFeatures();
        var objectId = this.conf.objectIds[layerName];
        
        if(features) {
            for(var i = 0; i < features.length; ++i) {
                delete this.features[features[i].data[objectId]];
            }
        }
        this.plugins['Oskari.userinterface.Flyout'].removeFeatures(layerName, features);
    },

    afterMapLayerAddEvent: function(event) {
        var layer = event.getMapLayer(),
            layerId = layer.getId();

        if (this._layerInTargetLayers(layer)) {
            this._addVectorLayer(layerId);
            this.plugins['Oskari.userinterface.Flyout'].addGrid(layerId);
        }
    },

    afterMapLayerRemoveEvent: function(event) {
        var layer = event.getMapLayer(),
            layerId = layer.getId();
        
        if(this._layerInTargetLayers(layer)) {
            this._removeVectorLayer(layerId);
            this.plugins['Oskari.userinterface.Flyout'].removeFeatures(layerId);
            this.plugins['Oskari.userinterface.Flyout'].removeGrid(layerId);
        }
    },

    /**
     * @method _addVectorLayer
     * Adds the vector layer of the same feature type to the map when user has
     * selected one of the data type layers from the layer selection.
     * @param {String} layerId 'LIIKENNE_ELEMENTTI' or 'SEGMENTTI'
     */
    _addVectorLayer: function(layerId) {
        var layerJson = this._baseJson(layerId),
            vectorLayer = this.mapLayerService.createMapLayer(layerJson);

        this.vectorLayerPlugin.addMapLayerToMap(vectorLayer, true, false);
        this.mapLayerService.addLayer(vectorLayer, true);
    },

    /**
     * @method _removeVectorLayer
     * Removes the vector layer when the user removes a layer from the map.
     * @param {String} layerName e.g. 'nopeusrajoitus'
     */
    _removeVectorLayer: function(layerId) {
        var vectorLayer = this.mapLayerService.findMapLayer(layerId + '_vector');
        this.vectorLayerPlugin.removeMapLayerFromMap(vectorLayer);
        this.mapLayerService.removeLayer(layerName+'_vector', true);
    },

    /**
     * @method _baseJson
     * @param {String} name e.g. 'nopeusrajoitus'
     */
    _baseJson: function(name) {
        return {
            "id": name+'_vector',
            "type": "dr-vectorlayer",
            "opacity": 100,
            "name": name+'_vector',
            "minScale": 25001,
            "maxScale": 1,
            "inspire": "Vektoritasot",
            "orgName": "Liikenne-elementit",
            "protocolType": "WFS",
            "protocolOpts": {
                "url": this.queryUrl,
                "srsName": "EPSG:3067",
                "version": "1.1.0",
                "featureType": "LIIKENNE_ELEMENTTI",
                "featureNS": "http://digiroad.karttakeskus.fi/LiVi",
                "featurePrefix": "LiVi",
                "geometryName": "GEOMETRY",
                "outputFormat": "json"
            }
        }
    },

    /**
    * @method _layerInTargetLayers
    * @return {Boolean} true if layer's id is defined in conf.targetLayers,
    * false otherwise.
    */
    _layerInTargetLayers: function(layer) {
        if (!layer.isLayerOfType('WMS')) {
            return false;
        }

        for (var i = 0; i < this.targetLayers.length; ++i) {
            if (layer.getId() === this.targetLayers[i].id) {
                return true;
            }
        }
        return false;
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
        var me = this;
        var sandbox = me.sandbox();
        // unregister from listening events
        for (var p in me.eventHandlers) {
            if (p) {
                sandbox.unregisterFromEventByName(me, p);
            }
        }
        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(me);
        sandbox.request(me, request);
        // unregister module from sandbox
        me.sandbox.unregister(me);
    },

    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    },

    /**
     * @method _createUI
     * @private
     *
     * Custom method, do what ever you like
     * Best practices: start internal/private methods with an underscore
     */
    _createUI : function() {
        this.plugins['Oskari.userinterface.Flyout'].createUI();
    }
},
{
    protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});