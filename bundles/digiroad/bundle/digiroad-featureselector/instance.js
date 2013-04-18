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
        var me = this;
        // Should this not come as a param?
        var sandbox = Oskari.$('sandbox');
        this.sandbox = sandbox;

        this._localization = Oskari.getLocalization(this.getName());
        
        this.queryUrl = this.conf.queryUrl;
        
        // register to sandbox as a module
        sandbox.register(me);
        // register to listening events
        for (var p in me.eventHandlers) {
            if (p) {
                sandbox.registerForEventByName(me, p);
            }
        }

        this.vectorLayerPlugin = sandbox.findRegisteredModuleInstance("MainMapModuleVectorLayerPlugin");

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
            var layerName = event.getLayerName().replace(/_vector$/, ""); // layerName is eg. 'nopeusrajoitus_vector'
            var features = event.getFeatures();
            
            if(layerName === "liikenne_elementti") {
                return;
            }
            
            for(var i = 0; i < features.length; ++i) {
                this.features[features[i].data.OID_TUNNUS] = features[i];
            }
            this.plugins['Oskari.userinterface.Flyout'].appendFeatures(layerName, features);
        },
        'FeaturesRemovedEvent': function(event) {
            var layerName = event.getLayerName().replace(/_vector$/, "");
            var features = event.getFeatures();
            
            if(layerName === "liikenne_elementti") {
                return;
            }
            
            if(features) {
	            for(var i = 0; i < features.length; ++i) {
	                delete this.features[features[i].data.OID_TUNNUS];
	            }
            }
            this.plugins['Oskari.userinterface.Flyout'].removeFeatures(layerName, features);
        },
        'AfterMapLayerAddEvent': function(event) {
            var layer = event.getMapLayer();
            
            if(this._layerIsLivi(layer)) {
                var styleName = layer.getStyles()[0].getName(), // eg. 'nopeusrajoitus'
                    layerWmsName = this._wmsNamesToLayerNames[layer.getWmsName().split(':')[1]],
                    featureType = layer.getWmsName().split(':')[1];

                if(styleName) {
                    this._addVectorLayer(featureType, styleName);
                    this.plugins['Oskari.userinterface.Flyout'].addGrid(layerWmsName, styleName);
                }
            }
        },
        'AfterMapLayerRemoveEvent': function(event) {
            var layer = event.getMapLayer();
            
            if(this._layerIsLivi(layer)) {
                var styleName = layer.getStyles()[0].getName();

                if(styleName) {
                    this._removeVectorLayer(styleName);
                    this.plugins['Oskari.userinterface.Flyout'].removeFeatures(styleName);
                    this.plugins['Oskari.userinterface.Flyout'].removeGrid(styleName);
                }
            }
        }
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
    },

    /**
     * @method _addVectorLayer
     * Adds the vector layer of the same feature type to the map when user has
     * selected one of the data type layers from the layer selection.
     * @param {String} featureType 'LIIKENNE_ELEMENTTI' or 'SEGMENTTI'
     * @param {String} layerName e.g. 'nopeusrajoitus'
     */
    _addVectorLayer: function(featureType, layerName) {
        var layerJson = this._baseJson(featureType, layerName),
            vectorLayer = this.mapLayerService.createMapLayer(layerJson),
            filter = this._getFilterFor(layerName),
            municipalityFilter = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "TIEE_KUNTA",
                value: kuntayllapito.user.kuntaKoodi
            });
        
        // The user is a basic user if he has a 'kuntaKoodi' parameter greater than 0.
        // In case he doesn't we're assuming he's an admin.
        // OBS! This is just a quick fix to Get It Work™, should most definitely implement better.
        if(kuntayllapito.user.kuntaKoodi > 0) {
	        if(filter) {
	            filter = new OpenLayers.Filter.Logical({
	                type: OpenLayers.Filter.Logical.AND,
	                filters: [filter, municipalityFilter]
	            });
	        } else {
	            filter = municipalityFilter;
	        }
        }
        
        this.vectorLayerPlugin.addMapLayerToMap(vectorLayer, true, false, filter);
        this.mapLayerService.addLayer(vectorLayer, true);
    },

    /**
     * @method _removeVectorLayer
     * Removes the vector layer when the user removes a layer from the map.
     * @param {String} layerName e.g. 'nopeusrajoitus'
     */
    _removeVectorLayer: function(layerName) {
        var vectorLayer = this.mapLayerService.findMapLayer(layerName + '_vector');
        this.vectorLayerPlugin.removeMapLayerFromMap(vectorLayer);
        this.mapLayerService.removeLayer(layerName+'_vector', true);
    },

    /**
     * @method _baseJson
     * @param {String} type 'LIIKENNE_ELEMENTTI' or 'SEGMENTTI'
     * @param {String} name e.g. 'nopeusrajoitus'
     */
    _baseJson: function(type, name) {
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
                "url": this.queryUrl,
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
    
    /**
     * @method _layerIsLivi
     * @param {Object} layer
     * @return {Boolean}
     */
    _layerIsLivi: function(layer) {
        return layer.isLayerOfType('WMS') && (
            layer.getWmsName() === "LiVi:LIIKENNE_ELEMENTTI" ||
            layer.getWmsName() === "LiVi:SEGMENTTI" ||
            layer.getWmsName() === "LiVi:PALVELU" ||
            layer.getWmsName() === "LiVi:KAANTYMISMAARAYS" ||
            layer.getWmsName() === "LiVi:PYSAKKI"
        );
    },

    /**
     * @property _wmsNamesToLayerNames
     */
    _wmsNamesToLayerNames: {
        "LIIKENNE_ELEMENTTI": "element",
        "SEGMENTTI": "segment",
        "PALVELU": "service"
    },

    /**
     * @method _getFilterFor
     * Returns an OpenLayers filter for given data type.
     * @param {String} layerName e.g. 'nopeusrajoitus'.
     */
    _getFilterFor: function(layerName) {
    	var layerNames = {
            paikannusnimistopiste: {
                property: "TYYPPI",
                value: 1
            },
            tunneli: {
                property: "TYYPPI",
                value: 6
            },
            ajoneuvo_sallittu: {
                property: "DYN_TYYPPI",
                value: 1
            },
            avattava_puomi: {
                property: "DYN_TYYPPI",
                value: 3
            },
            kelirikko: {
                property: "DYN_TYYPPI",
                value: 6
            },
            tien_leveys: {
                property: "DYN_TYYPPI",
                value: 8
            },
            nopeusrajoitus: {
                property: "DYN_TYYPPI",
                value: 11
            },
            suljettu_yhteys: {
                property: "DYN_TYYPPI",
                value: 16
            },
            ass_korkeus: {
                property: "DYN_TYYPPI",
                value: 18
            },
            ass_pituus: {
                property: "DYN_TYYPPI",
                value: 19
            },
            ass_yhdistelma_massa: {
                property: "DYN_TYYPPI",
                value: 20
            },
            ass_akselimassa: {
                property: "DYN_TYYPPI",
                value: 21
            },
            ass_massa: {
                property: "DYN_TYYPPI",
                value: 22
            },
            ass_leveys: {
                property: "DYN_TYYPPI",
                value: 23
            },
            ass_telimassa: {
                property: "DYN_TYYPPI",
                value: 24
            },
            rautatien_tasoristeys: {
                property: "DYN_TYYPPI",
                value: 25
            },
            paallystetty_tie: {
                property: "DYN_TYYPPI",
                value: 26
            },
            valaistu_tie: {
                property: "DYN_TYYPPI",
                value: 27
            },
            ajoneuvo_kielletty: {
                property: "DYN_TYYPPI",
                value: 29
            },
            taajama: {
                property: "DYN_TYYPPI",
                value: 30
            },
            talvinopeusrajoitus: {
                property: "DYN_TYYPPI",
                value: 31
            },
            liikennemaara: {
                property: "DYN_TYYPPI",
                value: 33
            }
        };

        if(layerNames[layerName]) {
            return new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: layerNames[layerName].property,
                value: layerNames[layerName].value
            });
        } else {
            return null;
        }
    }
},
{
    protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});