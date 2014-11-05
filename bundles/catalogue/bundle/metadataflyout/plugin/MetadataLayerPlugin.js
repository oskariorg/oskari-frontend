/**
 * @class Oskari.mapframework.mapmodule.MetadataLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.MetadataLayerPlugin',
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.mapmodule.MetadataLayerPlugin';
        me._name = 'MetadataLayerPlugin';

        me._supportedFormats = {};
        me._features = null;
        me._sldFormat = new OpenLayers.Format.SLD({
            multipleSymbolizers: false,
            namedLayersAsArray: true
        });
    }, {

        register: function () {
            this.getMapModule().setLayerPlugin('metadatalayer', this);
        },

        unregister: function () {
            this.getMapModule().setLayerPlugin('metadatalayer', null);
        },

        _startPluginImpl: function () {
            this.registerVectorFormats();
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                AfterMapLayerRemoveEvent: function (event) {
                    me.afterMapLayerRemoveEvent(event);
                },

                FeaturesAvailableEvent: function (event) {
                    me.handleFeaturesAvailableEvent(event);
                },

                AfterChangeMapLayerOpacityEvent: function (event) {
                    me.afterChangeMapLayerOpacityEvent(event);
                }
            };
        },

        /**
         * @method preselectLayers
         */
            preselectLayers: function (layers) {
            var ownedLayer = this.getMapLayer(),
                sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId() + '';

                if (layer.isLayerOfType('VECTOR') &&
                    ownedLayer.getId() + '' === layerId) {
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
            this.registerVectorFormat(
                'application/json',
                new OpenLayers.Format.GeoJSON({})
            );
            this.registerVectorFormat(
                'application/nlsfi-x-openlayers-feature', {
                    read: function (data) {
                        return data;
                    }
                }
            );
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


            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            var mapLayer = this.getMap().getLayersByName(
                'layer_' + layer.getId()
            );
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
                this.getSandbox().printDebug(sldSpec);
                var styleInfo = this._sldFormat.read(sldSpec),
                    styles = styleInfo.namedLayers[0].userStyles,
                    style = styles[0];
                // if( style.isDefault) {
                styleMap.styles['default'] = style;
                // }
            } else {
                this.getSandbox().printDebug('NO SLD FOUND');
            }

            var openLayer = new OpenLayers.Layer.Vector(
                'layer_' + layer.getId(),
                layerOpts
            );

            openLayer.opacity = layer.getOpacity() / 100;

            this.getMap().addLayer(openLayer);

            if (this._features) {
                openLayer.addFeatures(this._features);
            }


            this.getSandbox().printDebug(
                '#!#! CREATED VECTOR / OPENLAYER.LAYER.VECTOR for ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                this.getMap().setLayerIndex(
                    openLayer,
                    this.getMap().layers.length
                );
            } else {
                this.getMap().setLayerIndex(openLayer, 0);
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

            var remLayer = this.getMap().getLayersByName(
                'layer_' + layer.getId()
            );
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

            return this.getMap().getLayersByName('layer_' + layer.getId());
        },

        /**
         * @method handleFeaturesAvailableEvent
         */
        handleFeaturesAvailableEvent: function (event) {
            var fc,
                features,
                format,
                layer = event.getMapLayer(),
                mapLayer,
                mimeType,
                op,
                ownedLayer;

            if (layer === null || layer === undefined) {
                return;
            }

            ownedLayer = this.getMapLayer();
            if (layer.getId() + '' !== ownedLayer.getId() + '') {
                return;
            }

            mimeType = event.getMimeType();
            features = event.getFeatures();
            op = event.getOp();
            format = this._supportedFormats[mimeType];

            if (!format) {
                return;
            }

            fc = format.read(features);

            this._features = fc;

            mapLayer = this.getMap().getLayersByName(
                'layer_' + layer.getId()
            )[0];
            if (!mapLayer) {
                return;
            }

            if (op === 'replace') {
                mapLayer.removeFeatures(mapLayer.features);
            }

            mapLayer.addFeatures(fc);
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
