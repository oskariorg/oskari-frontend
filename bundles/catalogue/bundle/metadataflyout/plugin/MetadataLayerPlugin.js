/**
 * @class Oskari.mapframework.mapmodule.MetadataLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.MetadataLayerPlugin',
    function () {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._layer = null;
        this._supportedFormats = {};
        this._features = null;
        this._sldFormat = new OpenLayers.Format.SLD({
            multipleSymbolizers: false,
            namedLayersAsArray: true
        });
    }, {
        __name: 'MetadataLayerPlugin',

        getName: function () {
            return this.pluginName;
        },
        getMapModule: function () {
            return this.mapModule;
        },
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            this.pluginName = mapModule.getName() + this.__name;
        },
        register: function () {
            this.getMapModule().setLayerPlugin('metadatalayer', this);
        },
        unregister: function () {
            this.getMapModule().setLayerPlugin('metadatalayer', null);
        },
        init: function (sandbox) {},
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();

            this.registerVectorFormats();

            sandbox.register(this);
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
        },
        stopPlugin: function (sandbox) {
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);

            this._map = null;
            this._sandbox = null;
        },
        /* @method start
         * called from sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * called from sandbox
         *
         */
        stop: function (sandbox) {},
        eventHandlers: {
            AfterMapLayerRemoveEvent: function (event) {
                this.afterMapLayerRemoveEvent(event);
            },
            FeaturesAvailableEvent: function (event) {
                this.handleFeaturesAvailableEvent(event);
            },
            AfterChangeMapLayerOpacityEvent: function (event) {
                this.afterChangeMapLayerOpacityEvent(event);
            }
        },

        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         *
         */
        preselectLayers: function (layers) {
            var ownedLayer = this.getMapLayer(),
                sandbox = this._sandbox,
                i,
                layer,
                layerId;
            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId() + '';

                if (layer.isLayerOfType('VECTOR') && ownedLayer.getId() + '' === layerId) {
                    sandbox.printDebug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }

        },
        setMapLayer: function (layer) {
            this._layer = layer;
        },
        getMapLayer: function () {
            return this._layer;
        },
        /**
         * adds vector format to props of known formats
         */
        registerVectorFormat: function (mimeType, formatImpl) {
            this._supportedFormats[mimeType] = formatImpl;
        },
        /**
         * registers default vector formats
         */
        registerVectorFormats: function () {
            this.registerVectorFormat('application/json', new OpenLayers.Format.GeoJSON({}));
            this.registerVectorFormat('application/nlsfi-x-openlayers-feature', {
                read: function (data) {
                    return data;
                }
            });
        },
        afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();
            this.removeMapLayerFromMap(layer);
        },

        afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                ownedLayer = this.getMapLayer();

            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            if (layer.getId() + '' !== ownedLayer.getId() + '') {
                return;
            }


            this._sandbox.printDebug('Setting Layer Opacity for ' + layer.getId() + ' to ' + layer.getOpacity());
            var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
            if (mapLayer[0] !== null || mapLayer[0] !== undefined) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        },

        /**
         * primitive for adding layer to this map
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var ownedLayer = this.getMapLayer();

            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            if (layer.getId() + '' !== ownedLayer.getId() + '') {
                return;
            }

            var styleMap = new OpenLayers.StyleMap(),
                layerOpts = {
                    styleMap: styleMap
                },
                sldSpec = layer.getStyledLayerDescriptor();

            if (sldSpec) {
                this._sandbox.printDebug(sldSpec);
                var styleInfo = this._sldFormat.read(sldSpec),
                    styles = styleInfo.namedLayers[0].userStyles,
                    style = styles[0];
                // if( style.isDefault) {
                styleMap.styles['default'] = style;
                // }
            } else {
                this._sandbox.printDebug('NO SLD FOUND');
            }

            var openLayer = new OpenLayers.Layer.Vector('layer_' + layer.getId(), layerOpts);

            openLayer.opacity = layer.getOpacity() / 100;

            this._map.addLayer(openLayer);

            if (this._features) {
                openLayer.addFeatures(this._features);
            }


            this._sandbox.printDebug('#!#! CREATED VECTOR / OPENLAYER.LAYER.VECTOR for ' + layer.getId());

            if (keepLayerOnTop) {
                this._map.setLayerIndex(openLayer, this._map.layers.length);
            } else {
                this._map.setLayerIndex(openLayer, 0);
            }
        },
        removeMapLayerFromMap: function (layer) {
            var ownedLayer = this.getMapLayer();

            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            if (layer.getId() + '' !== ownedLayer.getId() + '') {
                return;
            }

            var remLayer = this._map.getLayersByName('layer_' + layer.getId());
            /* This should free all memory */
            remLayer[0].destroy();

        },
        getOLMapLayers: function (layer) {

            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            var ownedLayer = this.getMapLayer();
            if (layer.getId() + '' !== ownedLayer.getId() + '') {
                return;
            }

            return this._map.getLayersByName('layer_' + layer.getId());
        },
        /**
         *
         */
        handleFeaturesAvailableEvent: function (event) {
            var layer = event.getMapLayer();
            if (layer === null || layer === undefined) {
                return;
            }

            var ownedLayer = this.getMapLayer();
            if (layer.getId() + '' !== ownedLayer.getId() + '') {
                return;
            }

            var mimeType = event.getMimeType(),
                features = event.getFeatures(),
                op = event.getOp(),
                format = this._supportedFormats[mimeType];

            if (!format) {
                return;
            }

            var fc = format.read(features);

            this._features = fc;

            var mapLayer = this._map
                .getLayersByName('layer_' + layer.getId())[0];
            if (!mapLayer) {
                return;
            }

            if (op && op === 'replace') {
                mapLayer.removeFeatures(mapLayer.features);
            }

            mapLayer.addFeatures(fc);
        }
    }, {
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    });
