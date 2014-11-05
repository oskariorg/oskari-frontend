/**
 * @class Oskari.mapframework.mapmodule.VectorLayerPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.VectorLayerPlugin',
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.mapmodule.VectorLayerPlugin';
        me._name = 'VectorLayerPlugin';

        this._supportedFormats = {};
        this._sldFormat = new OpenLayers.Format.SLD({
            multipleSymbolizers: false,
            namedLayersAsArray: true
        });
    }, {
        register: function () {
            this.getMapModule().setLayerPlugin('vectorlayer', this);
        },
        unregister: function () {
            this.getMapModule().setLayerPlugin('vectorlayer', null);
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
                    me._afterChangeMapLayerOpacityEvent(event);
                }
            };
        },

        /**
         *
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                ilen,
                layer,
                layerId;

            for (i = 0, ilen = layers.length; i < ilen; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (!layer.isLayerOfType('VECTOR')) {
                    continue;
                }

                sandbox.printDebug('preselecting ' + layerId);
                this.addMapLayerToMap(layer, true, layer.isBaseLayer());
            }
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
            this.registerVectorFormat('application/json',
                new OpenLayers.Format.GeoJSON({}));
            this.registerVectorFormat('application/nlsfi-x-openlayers-feature',
                function () {
                    this.read = function (data) {
                        return data;
                    };
                }
            );
        },

        /**
         * primitive for adding layer to this map
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('VECTOR')) {
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
            }

            var openLayer = new OpenLayers.Layer.Vector(
                'layer_' + layer.getId(),
                layerOpts
            );

            openLayer.opacity = layer.getOpacity() / 100;

            this.getMap().addLayer(openLayer);

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
        /***********************************************************
         * Handle AfterMapLayerRemoveEvent
         *
         * @param {Object}
         *            event
         */
        afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();

            this.removeMapLayerFromMap(layer);
        },

        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer();

            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            var mapLayer = this.getMap().getLayersByName(
                'layer_' + layer.getId()
            );
            if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        },

        removeMapLayerFromMap: function (layer) {
            if (!layer.isLayerOfType('VECTOR')) {
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

            return this.getMap().getLayersByName('layer_' + layer.getId());
        },
        /**
         *
         */
        handleFeaturesAvailableEvent: function (event) {
            var layer = event.getMapLayer(),
                mimeType = event.getMimeType(),
                features = event.getFeatures(),
                op = event.getOp(),
                mapLayer = this.getMap().getLayersByName(
                    'layer_' + layer.getId()
                )[0];

            //                      var projCode = event.getProjCode();
            if (!mapLayer) {
                return;
            }

            if (op && op === 'replace') {
                mapLayer.removeFeatures(mapLayer.features);
            }

            var format = this._supportedFormats[mimeType];

            if (!format) {
                return;
            }

            var fc = format.read(features);

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
    }
);
