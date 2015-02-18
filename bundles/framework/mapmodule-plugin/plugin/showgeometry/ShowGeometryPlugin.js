/**
 * @class Oskari.mapframework.bundle.plugin.ShowGeometryPlugin
 * Shows WKT or GeoJSON to the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.ShowGeometryPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._supportedFormats = {};
        
        this._olLayerPrefix = "SHOWGEOMETRY_";
        
    }, {
        /** @static @property __name plugin name */
        __name: 'ShowGeometryPlugin',
        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has not UI so always returns false
         */
        hasUI: function () {
            return false;
        },
        /**
         * @method init
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            
        },

        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {

        },

        /**
         * @method _registerVectorFormat
         * @private
         * Adds vector format to props of known formats
         *
         * @param geometryType vector format
         * @param formatImpl format implementation
         */
        _registerVectorFormat: function (geometryType, formatImpl) {
            var me = this;
            me._supportedFormats[geometryType] = formatImpl;
        },
        /**
         * @method _registerVectorFormats
         * @private
         * Registers default vector formats
         */
        _registerVectorFormats: function () {
            var me = this;
            me._registerVectorFormat('GeoJSON', new OpenLayers.Format.GeoJSON());
            me._registerVectorFormat('WKT', new OpenLayers.Format.WKT({}));
        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this;
            me._sandbox = sandbox;
            me._map = this.getMapModule().getMap();

            sandbox.register(this);

            me._registerVectorFormats();

            var wkt = 'POLYGON (('+
                '429268 6903911,' +
                '438128 6908451,' +
                '443288 6897751,' +
                '430468 6895391,' +
                '429268 6903911' +
                '))';

            var layerJson = {
                wmsName: '',
                type: 'vectorlayer',
                isQueryable: false,
                opacity: 60,
                //metaType: '100000',
                orgName: 'METATIETO ORGANISAATIO',
                inspire: 'METATIETO INSPIRE',
                id: 'METATIETOKATTAVUUS_ID',
                name: 'METATIETOKATTAVUUS'
            };

            var mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var vectorLayer = mapLayerService.createMapLayer(layerJson);

            var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
            style.pointRadius = 8;
            style.strokeColor = '#D3BB1B';
            style.fillColor = '#FFDE00';
            style.fillOpacity = 1;
            style.strokeOpacity = 1;
            style.strokeWidth = 2;
            style.cursor = 'pointer';
            me._sandbox.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [wkt, 'WKT', null, vectorLayer, 'replace', true, style, true]);
            

            //me._addFeatureToMap(wkt, 'WKT', null, null, null, 'replace', true);
        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this;
            sandbox.unregister(this);
            me._map = null;
            me._sandbox = null;
            me._supportedFormats = {};
        },     
        /**
         * @method _getDefaultStyle
         * Get feature deault style
         * @return {OpenLayers.Style} style
         */
        _getDefaultStyle: function(){
            var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
            style.pointRadius = 8;
            style.strokeColor = '#000000';
            style.fillColor = '#E9DA14';
            style.fillOpacity = 0.6;
            style.strokeOpacity = 1;
            style.strokeWidth = 2;
            style.cursor = 'pointer';
            return style;
        },
        _removeFeaturesFromMap: function(identifierValue, identifierName, layer){
            if(identifierValue && identifierName){
                // remove only matching features
                // remove layer from selected (if layer has no anymore features)
            } else {
                // remove all features
                // remove layer from selected
            }
        },

        /** 
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {},
        /** 
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method _getLayers
         * @private
         * @return selected layers in the pop-up
         */
        _getLayers: function () {
            var me = this,
                selectedLayers = me._sandbox.findAllSelectedMapLayers();
            //sort the layers
            selectedLayers.sort(function (a, b) {
                return me._layerListComparator(a, b);
            });
            return selectedLayers;
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });