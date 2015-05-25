/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin';
        me._name = 'WmtsLayerPlugin';
        me._supportedFormats = {};
    }, {

        register: function () {
            this.getMapModule().setLayerPlugin('WmtsLayer', this);
        },

        unregister: function () {
            this.getMapModule().setLayerPlugin('WmtsLayer', null);
        },

        _initImpl: function () {
            // register domain builder
            var layerModelBuilder,
                mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );

            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'wmtslayer',
                    'Oskari.mapframework.wmts.domain.WmtsLayer'
                );
                layerModelBuilder = Oskari.clazz.create(
                    'Oskari.mapframework.wmts.service.WmtsLayerModelBuilder'
                );
                mapLayerService.registerLayerModelBuilder(
                    'wmtslayer',
                    layerModelBuilder
                );
            }
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                MapLayerEvent: function(event) {

                    //Maplayer updated -> url might have changed (case forceProxy). Update that.
                    var op = event.getOperation(),
                        layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());

                    //not a selected map layer -> still need to update the layerconfig in "all available"
                    if (!layer) {
                        layer = me.getSandbox().findMapLayerFromAllAvailable(event.getLayerId());
                        if (layer && layer.isLayerOfType('WMTS')) {
                            layer._wmtsurl = null;
                        }

                    } else if (op === 'update' && layer && layer.isLayerOfType('WMTS')) {

                        //if _wmtsurl of the layer has been set -> nullify that so that the next time url will be determined by the layerUrls array
                        layer._wmtsurl = null;
                        me._replaceMapLayer(layer);
                    }
                },
                AfterMapLayerRemoveEvent: function (event) {
                    me.afterMapLayerRemoveEvent(event);
                },

                AfterChangeMapLayerOpacityEvent: function (event) {
                    me.afterChangeMapLayerOpacityEvent(event);
                },

                AfterChangeMapLayerStyleEvent: function (event) {
                    me.afterChangeMapLayerStyleEvent(event);
                }
            };
        },
        /**
         * Replaces a layer on the map with a layer created with an updated config. If layer hasn't been added to map nothing is done.
         * @param {Oskari layerconfig} layer
         *
         */
        _replaceMapLayer: function(layer) {
            var me = this;
            var olMapLayers = me.getOLMapLayers(layer),
                olMapLayer,
                matrixData = me.__calculateMatrix(layer.getWmtsMatrixSet()),
                sandbox = me.getSandbox();
            if (olMapLayers && olMapLayers.length) {
                //layer added to map -> recreate with the new config
                olMapLayer = olMapLayers[0];
                var oldLayerIndex = this._map.getLayerIndex(olMapLayer);
                var layerConfig = me._getLayerConfig(layer, matrixData, sandbox);
                var newLayer = new OpenLayers.Layer.WMTS(layerConfig);

                this._map.removeLayer(olMapLayer);
                this._map.addLayer(newLayer);
                this._map.setLayerIndex(newLayer, oldLayerIndex);
            }
        },
        /**
         *
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (layer.isLayerOfType('WMTS')) {
                    sandbox.printDebug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }
        },

        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('WMTS')) {
                return;
            }

            var me = this,
                map = me.getMap(),
                matrixData = this.__calculateMatrix(layer.getWmtsMatrixSet()),
                sandbox = me.getSandbox(),
                layerConfig = me._getLayerConfig(layer, matrixData, sandbox);

            sandbox.printDebug(
                '[WmtsLayerPlugin] creating WMTS Layer ' +
                layerConfig.name + ' / ' + layerConfig.matrixSet + '/' +
                layerConfig.layer + '/' + layerConfig.url
            );

            var wmtsLayer = new OpenLayers.Layer.WMTS(layerConfig);
            wmtsLayer.opacity = layer.getOpacity() / 100;

            sandbox.printDebug(
                '[WmtsLayerPlugin] created WMTS layer ' + wmtsLayer
            );

            map.addLayers([wmtsLayer]);
        },
        _getLayerConfig: function(layer, matrixData, sandbox) {
            // default params and options
            var layerConfig = {
                name: this.__getLayerName(layer),
                url : layer.getUrl(),
                layer: layer.getLayerName(),
                style: layer.getCurrentStyle().getName(),
                matrixSet : layer.getWmtsMatrixSet().identifier,

                matrixIds: matrixData.matrixIds,
                serverResolutions: matrixData.serverResolutions,
                visibility: layer.isInScale(sandbox.getMap().getScale()),
                requestEncoding : layer.getRequestEncoding(),

                format: 'image/png',
                displayInLayerSwitcher: false,
                isBaseLayer: false,
                buffer: 0,
                params : {},
                // additional debugging props, not needed by OL
                layerDef: layer.getWmtsLayerDef()
            };

            // override default params and options from layer
            var key,
                layerParams = layer.getParams(),
                layerOptions = layer.getOptions();
            for (key in layerOptions) {
                if (layerOptions.hasOwnProperty(key)) {
                    layerConfig[key] = layerOptions[key];
                }
            }
            for (key in layerParams) {
                if (layerParams.hasOwnProperty(key)) {
                    layerConfig.params[key] = layerParams[key];
                }
            }

            return layerConfig;

        },
        __calculateMatrix : function(matrixSet) {
            var matrixIds = [],
                resolutions = [],
                scaleDenom,
                serverResolutions = [],
                n = 0,
                res;

            for (; n < matrixSet.matrixIds.length; ++n) {
                matrixIds.push(matrixSet.matrixIds[n]);
                //.identifier);
                scaleDenom = matrixSet.matrixIds[n].scaleDenominator;
                res = scaleDenom / 90.71446714322 * OpenLayers.METERS_PER_INCH;
                resolutions.push(res);
                serverResolutions.push(res);
            }
            return {
                matrixIds : matrixIds,
                resolutions : resolutions,
                serverResolutions : serverResolutions
            };
        },
        __getLayerName : function(layer) {
            var name = 'layer_' + layer.getId();
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                name = 'basemap_' + layer.getId();
            }
            // removing all dots (they cause problems on OL)
            return name.split('.').join('');
        },

        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType('WMTS')) {
                return null;
            }
            return this._map.getLayersByName(this.__getLayerName(layer));
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

        removeMapLayerFromMap: function (layer) {
            var oLayer = this.getOLMapLayers(layer);

            if (oLayer && oLayer[0]) {
                oLayer[0].destroy();
            }
        },

        afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                oLayer = this.getOLMapLayers(layer),
                newOpacity = (layer.getOpacity() / 100);

            if (oLayer && oLayer[0]) {
                oLayer[0].setOpacity(newOpacity);
            }
        },

        /***********************************************************
         * Handle AfterChangeMapLayerStyleEvent
         *
         * @param {Object}
         *            event
         */
        afterChangeMapLayerStyleEvent: function (event) {
            var layer = event.getMapLayer(),
                oLayer = this.getOLMapLayers(layer),
                newStyle = layer.getCurrentStyle().getName();

            if (oLayer && oLayer[0]) {
                // only works for layers with requestEncoding = 'KVP'
                oLayer[0].mergeNewParams({
                    style: newStyle
                });
            }
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
